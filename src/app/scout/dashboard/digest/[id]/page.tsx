import { redirect, notFound } from "next/navigation";
import { getUser, createClient } from "@/lib/scout/supabase-server";
import Link from "next/link";
import DigestSaveBar from "./DigestSaveBar";

export default async function DigestViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUser();
  if (!user) redirect("/scout/login");

  const supabase = await createClient();

  const { data: digest, error } = await supabase
    .from("scout_digests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !digest) notFound();

  // Verify the authenticated user owns this digest
  if (digest.user_id !== user.id) notFound();

  const sentDate = new Date(digest.sent_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/scout/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mt-6 flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Job Digest</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{sentDate}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-emerald-400">
              <span className="text-xs font-semibold">
                {digest.jobs_found}
              </span>
              {digest.jobs_found === 1 ? "job" : "jobs"} found
            </span>
          </div>
        </div>
      </div>

      {/* Email content frame */}
      <div className="mx-auto max-w-4xl px-4 pb-24">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-white">
          <div
            className="prose prose-sm max-w-none p-6 text-zinc-900 sm:p-8"
            dangerouslySetInnerHTML={{ __html: digest.email_html }}
          />
        </div>
      </div>

      {/* Floating save-to-tracker bar */}
      <DigestSaveBar digestHtml={digest.email_html} />
    </div>
  );
}
