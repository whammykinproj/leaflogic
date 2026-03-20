import { createServerClient } from "@supabase/ssr";
import { Resend } from "resend";
import Anthropic from "@anthropic-ai/sdk";

// ── Types ────────────────────────────────────────────────────────────

export interface JobSource {
  name: string;
  urlTemplate: (roles: string[], locations: string[]) => string;
  condition?: (profile: EngineProfile) => boolean;
}

export interface SourceResult {
  name: string;
  url: string;
  status: "success" | "failed";
  text: string;
  errorDetail?: string;
}

export interface EngineUser {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
}

export interface EngineProfile {
  resume_text: string;
  target_roles: string[];
  target_companies: string[];
  target_locations: string[];
  salary_min: number | null;
  salary_max: number | null;
  skills: string[];
  resume_variant_notes: string | null;
}

// ── Job Sources ──────────────────────────────────────────────────────

export const JOB_SOURCES: JobSource[] = [
  {
    name: "Wellfound",
    urlTemplate: (roles, locations) =>
      `https://wellfound.com/search/jobs?role=${encodeURIComponent(roles[0] || "product-manager")}&location=${encodeURIComponent(locations[0] || "new-york")}`,
  },
  {
    name: "YC Jobs",
    urlTemplate: (roles, locations) =>
      `https://www.ycombinator.com/jobs/role/${encodeURIComponent((roles[0] || "product-manager").toLowerCase().replace(/ /g, "-"))}/${encodeURIComponent((locations[0] || "new-york").toLowerCase().replace(/ /g, "-"))}`,
  },
  {
    name: "Built In",
    urlTemplate: (_roles, locations) =>
      `https://www.builtin${(locations[0] || "nyc").toLowerCase().replace(/ /g, "")}.com/jobs`,
  },
  {
    name: "TopStartups",
    urlTemplate: (roles, locations) =>
      `https://topstartups.io/jobs/?role=${encodeURIComponent(roles[0] || "Product Manager")}&location=${encodeURIComponent(locations[0] || "New York")}`,
  },
  {
    name: "LinkedIn Jobs",
    urlTemplate: (roles, locations) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(roles[0] || "product manager")}&location=${encodeURIComponent(locations[0] || "New York")}`,
  },
  {
    name: "Greenhouse",
    urlTemplate: (roles) =>
      `https://boards.greenhouse.io/embed/job_board?for=&content=${encodeURIComponent(roles[0] || "product manager")}`,
  },
  {
    name: "Lever",
    urlTemplate: (roles) =>
      `https://jobs.lever.co/search?query=${encodeURIComponent(roles[0] || "product manager")}`,
  },
  {
    name: "HN Who is Hiring",
    urlTemplate: (roles) => {
      const month = new Date().toLocaleString("en-US", { month: "long" });
      const year = new Date().getFullYear();
      return `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(`Ask HN: Who is hiring? (${month} ${year})`)}&tags=story`;
    },
  },
  {
    name: "Indeed",
    urlTemplate: (roles, locations) =>
      `https://www.indeed.com/jobs?q=${encodeURIComponent(roles[0] || "product manager")}&l=${encodeURIComponent(locations[0] || "New York")}`,
  },
  {
    name: "RemoteOK",
    urlTemplate: (roles) =>
      `https://remoteok.com/remote-${encodeURIComponent((roles[0] || "product-manager").toLowerCase().replace(/ /g, "-"))}-jobs`,
    condition: (profile) =>
      profile.target_locations.some((loc) => /remote/i.test(loc)),
  },
  {
    name: "Glassdoor",
    urlTemplate: (roles, locations) =>
      `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(roles[0] || "product manager")}&locT=C&locKeyword=${encodeURIComponent(locations[0] || "New York")}`,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

export function buildCompanyCareerSources(companies: string[]): JobSource[] {
  if (!companies || companies.length === 0) return [];

  return companies.slice(0, 5).map((company) => {
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return {
      name: `${company} Careers`,
      urlTemplate: () => `https://www.${slug}.com/careers`,
    };
  });
}

export async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return `[Failed to fetch: ${res.status}]`;
    const html = await res.text();
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 15000);
  } catch {
    return `[Fetch error for ${url}]`;
  }
}

export function isActiveUser(user: EngineUser): boolean {
  if (user.subscription_status === "active") return true;
  if (
    user.subscription_status === "trialing" &&
    user.trial_ends_at &&
    new Date(user.trial_ends_at) > new Date()
  ) {
    return true;
  }
  return false;
}

export function resolveSourcesForProfile(profile: EngineProfile): JobSource[] {
  const baseSources = JOB_SOURCES.filter(
    (s) => !s.condition || s.condition(profile)
  );
  const companySources = buildCompanyCareerSources(profile.target_companies);
  return [...baseSources, ...companySources];
}

// ── Core Engine ──────────────────────────────────────────────────────

export async function runScoutForUser(
  user: EngineUser,
  profile: EngineProfile,
  anthropic: Anthropic,
  resend: Resend,
  fromEmail: string,
  supabase: ReturnType<typeof createServerClient>
): Promise<{ success: boolean; jobsFound: number }> {
  const sources = resolveSourcesForProfile(profile);

  const urls = sources.map((source) => ({
    name: source.name,
    url: source.urlTemplate(profile.target_roles, profile.target_locations),
  }));

  // Scrape all sources in parallel
  const scrapeResults: SourceResult[] = await Promise.all(
    urls.map(async (source) => {
      try {
        const text = await fetchPageText(source.url);
        const failed =
          text.startsWith("[Failed to fetch") ||
          text.startsWith("[Fetch error");
        return {
          name: source.name,
          url: source.url,
          status: failed ? ("failed" as const) : ("success" as const),
          text: failed ? "" : text,
          errorDetail: failed ? text : undefined,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`[Scout] Source "${source.name}" failed: ${msg}`);
        return {
          name: source.name,
          url: source.url,
          status: "failed" as const,
          text: "",
          errorDetail: msg,
        };
      }
    })
  );

  const succeeded = scrapeResults.filter((r) => r.status === "success");
  const failed = scrapeResults.filter((r) => r.status === "failed");

  if (failed.length > 0) {
    console.warn(
      `[Scout] User ${user.id}: ${failed.length}/${scrapeResults.length} sources failed: ${failed.map((f) => f.name).join(", ")}`
    );
  }

  const allJobText = succeeded
    .map((r) => `\n--- ${r.name} (${r.url}) ---\n${r.text}`)
    .join("\n\n");

  if (succeeded.length === 0) {
    console.error(
      `[Scout] User ${user.id}: ALL sources failed. Sending empty digest.`
    );
  }

  // Build user context for Claude
  const userContext = `
Name: ${user.full_name || "Job Seeker"}
Resume: ${profile.resume_text}
Target Roles: ${profile.target_roles.join(", ")}
Target Locations: ${profile.target_locations.join(", ")}
Target Companies: ${profile.target_companies.join(", ") || "Any"}
Key Skills: ${profile.skills.join(", ")}
Salary Range: ${profile.salary_min ? `$${profile.salary_min}` : "?"}–${profile.salary_max ? `$${profile.salary_max}` : "?"}
${profile.resume_variant_notes ? `Resume Notes: ${profile.resume_variant_notes}` : ""}
`.trim();

  // Send to Claude for analysis
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are a job search assistant. Here is the job seeker's profile:

${userContext}

Below is scraped text from several job boards. Analyze it and produce a structured digest with THREE sections:

## OUTPUT FORMAT (use clean HTML, no markdown)

**Section 1 — TOP MATCHES (up to 5)**
These are roles where the person's experience, skills, and target roles are a strong fit. For each:
- <h3>Company — Role Title</h3>
- <p><b>Why you're a fit:</b> 2-3 sentence tailored pitch ready to copy-paste into an application.</p>
- <p><b>Link:</b> <a href="URL">Apply here</a></p> (if a URL is visible in the scraped text)

**Section 2 — WORTH A LOOK (up to 5)**
Roles that are adjacent or stretch matches — not a perfect fit but worth exploring. Same format as above, but the pitch should note what makes it a stretch and why it could still work.

**Section 3 — COLD EMAIL TARGETS (2-3)**
${profile.target_companies.length > 0 ? `Companies from the user's target list that they should reach out to even if no open role was found: ${profile.target_companies.join(", ")}. For each, suggest a specific team or hiring manager angle.` : "Companies that appeared in the scraped data that seem like a culture or mission fit, even if no perfect role was posted. Suggest a cold outreach angle."}

Use these exact section headers as <h2> tags: "Top Matches", "Worth a Look", "Cold Email Targets".
If a section has zero results, include the header and write "None found today — we'll keep looking."

At the very end, include a hidden count: <!-- JOBS_FOUND: X --> where X is the total number of jobs across Top Matches and Worth a Look.

SCRAPED JOB DATA:
${allJobText || "[No data retrieved from any source today.]"}`,
      },
    ],
  });

  const emailContent =
    response.content[0].type === "text"
      ? response.content[0].text
      : "No results generated.";

  // Extract job count
  const jobCountMatch = emailContent.match(/<!-- JOBS_FOUND: (\d+) -->/);
  const jobsFound = jobCountMatch ? parseInt(jobCountMatch[1]) : 0;

  // Send digest email
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const sourceSummary = scrapeResults
    .map((r) => `${r.name} ${r.status === "success" ? "\u2713" : "\u2717"}`)
    .join(", ");

  await resend.emails.send({
    from: fromEmail,
    to: user.email,
    subject: `JobScout Digest — ${today}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 680px; margin: 0 auto; color: #1a1a1a; background: #fafafa; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700;">
            <span style="color: #10b981;">JobScout</span>
            <span style="color: #999; font-weight: 400;"> AI</span>
          </span>
        </div>
        <h1 style="font-size: 20px; border-bottom: 2px solid #10b981; padding-bottom: 8px; color: #111;">
          Your Daily Digest — ${today}
        </h1>
        <p style="color: #666; font-size: 14px;">
          Roles matched to your profile. Pitches ready to copy-paste.
        </p>
        ${emailContent}
        <hr style="margin-top: 32px; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 11px; color: #999; text-align: center; margin-top: 16px;">
          Sources: ${sourceSummary}<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://leaflogic.app"}/scout/dashboard" style="color: #10b981;">Manage your profile</a>
        </p>
        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
          This digest was curated by <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://leaflogic.app"}/scout?utm_source=digest_email&utm_medium=email&utm_campaign=digest_footer" style="color: #10b981; font-weight: 600; text-decoration: none;">JobScout AI</a> — Your AI-powered job search agent
        </p>
      </div>
    `,
  });

  // Save digest record
  await supabase.from("scout_digests").insert({
    user_id: user.id,
    jobs_found: jobsFound,
    email_html: emailContent,
  });

  return { success: true, jobsFound };
}
