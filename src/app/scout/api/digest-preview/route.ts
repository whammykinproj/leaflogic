import { NextResponse } from "next/server";
import { getUser, getScoutProfile } from "@/lib/scout/supabase-server";

// Returns a preview of what the user's next digest would look like
// without actually running the full scout (no scraping, no Claude call)
// Shows their profile config as a "here's what we'll search for" preview

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getScoutProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "No profile" }, { status: 404 });
  }

  const preview = {
    roles: profile.target_roles || [],
    locations: profile.target_locations || [],
    companies: profile.target_companies || [],
    skills: profile.skills || [],
    sources: [
      "Wellfound",
      "YC Jobs",
      "Built In",
      "TopStartups",
      "LinkedIn",
      "Greenhouse",
      "Lever",
      "HN Who is Hiring",
      "Indeed",
      ...(profile.target_locations?.some((l: string) => /remote/i.test(l))
        ? ["RemoteOK"]
        : []),
      "Glassdoor",
      ...(profile.target_companies || [])
        .slice(0, 5)
        .map((c: string) => `${c} Careers`),
    ],
    estimatedMatches: Math.min(
      15,
      Math.max(
        3,
        (profile.target_roles?.length || 1) *
          (profile.target_locations?.length || 1) +
          (profile.target_companies?.length || 0)
      )
    ),
    nextDigestAt: getNextDigestTime(),
  };

  return NextResponse.json(preview);
}

function getNextDigestTime(): string {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(14, 0, 0, 0); // 2pm UTC = 10am ET
  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }
  return next.toISOString();
}
