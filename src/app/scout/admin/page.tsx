import { redirect } from "next/navigation";
import { createClient } from "@/lib/scout/supabase-server";
import { headers } from "next/headers";

// Simple admin dashboard — protected by a secret token in the URL
// Access: /scout/admin?token=YOUR_ADMIN_TOKEN

async function verifyAdmin(searchParams: Promise<{ token?: string }>) {
  const params = await searchParams;
  const adminToken = process.env.SCOUT_ADMIN_TOKEN;
  if (!adminToken || params.token !== adminToken) {
    redirect("/scout");
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  await verifyAdmin(searchParams);

  // Suppress unused import warning
  void headers;

  const supabase = await createClient();

  // Fetch all users
  const { data: users } = await supabase
    .from("scout_users")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch digest counts per user
  const { data: digestCounts } = await supabase
    .from("scout_digests")
    .select("user_id, id")
    .order("sent_at", { ascending: false });

  const digestCountMap = new Map<string, number>();
  digestCounts?.forEach((d) => {
    digestCountMap.set(d.user_id, (digestCountMap.get(d.user_id) || 0) + 1);
  });

  // Stats
  const totalUsers = users?.length || 0;
  const activeUsers =
    users?.filter(
      (u) =>
        u.subscription_status === "active" ||
        (u.subscription_status === "trialing" &&
          u.trial_ends_at &&
          new Date(u.trial_ends_at) > new Date())
    ).length || 0;
  const payingUsers =
    users?.filter((u) => u.subscription_status === "active").length || 0;
  const trialingUsers =
    users?.filter((u) => u.subscription_status === "trialing").length || 0;
  const totalDigests = digestCounts?.length || 0;
  const mrr = payingUsers * 29;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">
            <span className="text-emerald-400">JobScout</span> Admin
          </h1>
          <span className="text-sm text-zinc-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Total Users", value: totalUsers, color: "text-white" },
            {
              label: "Active (trial+paid)",
              value: activeUsers,
              color: "text-emerald-400",
            },
            {
              label: "Paying",
              value: payingUsers,
              color: "text-emerald-400",
            },
            {
              label: "Trialing",
              value: trialingUsers,
              color: "text-amber-400",
            },
            {
              label: "MRR",
              value: `$${mrr.toLocaleString()}`,
              color: "text-emerald-400",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{totalDigests}</p>
            <p className="text-xs text-zinc-500 mt-1">Total digests sent</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">
              {totalUsers > 0
                ? (totalDigests / totalUsers).toFixed(1)
                : "0"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Avg digests/user</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-white">
              {payingUsers > 0 && totalUsers > 0
                ? `${((payingUsers / totalUsers) * 100).toFixed(0)}%`
                : "0%"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Conversion rate</p>
          </div>
        </div>

        {/* User table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-left">
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Trial Ends</th>
                  <th className="px-6 py-3 font-medium">Digests</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => {
                  const isExpired =
                    user.subscription_status === "trialing" &&
                    user.trial_ends_at &&
                    new Date(user.trial_ends_at) < new Date();

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                    >
                      <td className="px-6 py-3 text-zinc-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-3 text-zinc-400">
                        {user.full_name || "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            user.subscription_status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isExpired
                                ? "bg-red-500/20 text-red-400"
                                : user.subscription_status === "trialing"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-zinc-700 text-zinc-400"
                          }`}
                        >
                          {isExpired ? "expired" : user.subscription_status || "none"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-zinc-500">
                        {user.trial_ends_at
                          ? new Date(user.trial_ends_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-3 text-zinc-400">
                        {digestCountMap.get(user.id) || 0}
                      </td>
                      <td className="px-6 py-3 text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
                {(!users || users.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
