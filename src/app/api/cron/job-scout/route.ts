import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Anthropic from "@anthropic-ai/sdk";

// Vercel Cron — runs every 3 days at 10am ET (2pm UTC)

const MAC_EMAIL = "mac.kincheloe@gmail.com";

const RESUME_CONTEXT = `
Mac Kincheloe — NYC-based, 3 years post-grad from UPenn (BA Economics & Philosophy, MA Philosophy, 3.78/3.80 GPA, Benjamin Franklin Scholar).

Current: Strategy & Ops Senior Associate at Headway (healthtech startup). Led product dev of ML claims classification tool (5M+ claims/yr), recovered $5M+ via data analysis (Foundry, Metabase, SQL), hired/managed team of 5, championed AI adoption (Glean AI, Claude Code).

Previous: Accenture Strategy Analyst — GTM analysis for $150M Series C fintech, 8+ GenAI PoCs, design thinking workshops ($500K contract). Also interned as consulting analyst building ML cash forecasting dashboards.

Previous: Sunstone Credit Analyst — underwrote $3M commercial solar loan end-to-end, redesigned credit policy cutting cycle times 25%.

Side project: Built Deposit Deadline (depositdeadline.com) — full-stack Next.js app, 1,000+ monthly visitors, featured by tenant unions with 1M+ followers. Built with Claude Code, no prior coding background.

Skills: SQL, Python, Figma, JIRA, Claude Code, Next.js, Foundry, Metabase, Power BI, Excel, Financial Modeling, Prompt Engineering.

Target roles: VC Analyst/Associate, PM at tech/startups, Chief of Staff at Series A-C startups, Strategy/Ops at AI companies. NYC. $140-170K base.

Has PM resume and VC resume variants.
`;

const JOB_SOURCES = [
  {
    name: "Wellfound VC NYC",
    url: "https://wellfound.com/role/l/venture-capital/new-york",
    scrapeUrl: "https://wellfound.com/search/jobs?role=venture-capital&location=new-york",
  },
  {
    name: "Wellfound Chief of Staff NYC",
    url: "https://wellfound.com/role/l/chief-of-staff/new-york",
    scrapeUrl: "https://wellfound.com/search/jobs?role=chief-of-staff&location=new-york",
  },
  {
    name: "Startup&VC - NYC VC Jobs",
    url: "https://www.startupandvc.com/locations/new-york",
    scrapeUrl: "https://www.startupandvc.com/locations/new-york",
  },
  {
    name: "TopStartups CoS",
    url: "https://topstartups.io/jobs/?role=Chief+Of+Staff&location=New+York",
    scrapeUrl: "https://topstartups.io/jobs/?role=Chief+Of+Staff&location=New+York",
  },
  {
    name: "Built In NYC - PM + AI",
    url: "https://www.builtinnyc.com/jobs/product/artificial-intelligence",
    scrapeUrl: "https://www.builtinnyc.com/jobs/product/artificial-intelligence",
  },
  {
    name: "YC PM Jobs NYC",
    url: "https://www.ycombinator.com/jobs/role/product-manager/new-york",
    scrapeUrl: "https://www.ycombinator.com/jobs/role/product-manager/new-york",
  },
];

const TARGET_COMPANIES = [
  "Ramp", "Hebbia", "Canaan", "Primary Venture Partners", "First Round Capital",
  "Rogo", "Sixfold AI", "Anthropic", "OpenAI", "Scale AI", "Anduril", "Brex",
  "Figma", "Notion", "Linear", "Vercel", "Stripe",
];

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
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

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel auto-injects for cron jobs)
  // Also accepts JOB_SCOUT_TEST_TOKEN via query param for manual triggers
  const authHeader = request.headers.get("authorization");
  const testToken = request.nextUrl.searchParams.get("token");
  const cronSecret = process.env.CRON_SECRET;
  const testSecret = process.env.JOB_SCOUT_TEST_TOKEN;
  const isAuthed =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (testSecret && testToken === testSecret);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Scrape all job sources in parallel
    const scrapeResults = await Promise.all(
      JOB_SOURCES.map(async (source) => {
        const text = await fetchPageText(source.scrapeUrl);
        return `\n--- ${source.name} (${source.url}) ---\n${text}`;
      })
    );

    const allJobText = scrapeResults.join("\n\n");

    // 2. Use Claude to extract relevant jobs and draft application answers
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a job search assistant for Mac Kincheloe. Here is his background:

${RESUME_CONTEXT}

Below is scraped text from several job boards. Extract the most relevant job postings (up to 10) that match Mac's profile and target roles. Focus on HIGH-SLOPE roles: VC, PM at rocketship startups, Chief of Staff, Strategy/Ops at AI companies. Only NYC roles. Skip anything clearly junior or unrelated.

For each job found, provide:
1. Company name
2. Role title
3. Link (if visible in the text)
4. Which resume to use (PM or VC)
5. A 2-3 sentence tailored pitch for why Mac is a strong fit (ready to copy-paste into an application)

If a job has specific application questions visible, draft answers.

Also list 2-3 companies from this target list that Mac should cold-email even if no specific posting was found: ${TARGET_COMPANIES.join(", ")}

Format the output as clean HTML for an email — use <h3> for each job, <p> for descriptions, <b> for labels. Make everything scannable and copy-pasteable. Do not use markdown.

SCRAPED JOB DATA:
${allJobText}`,
        },
      ],
    });

    const emailContent =
      response.content[0].type === "text"
        ? response.content[0].text
        : "No results generated.";

    // 3. Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Job Scout <noreply@resend.dev>",
      to: MAC_EMAIL,
      subject: `Job Scout Digest — ${today}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 680px; margin: 0 auto; color: #1a1a1a;">
          <h1 style="font-size: 22px; border-bottom: 2px solid #000; padding-bottom: 8px;">
            Job Scout — ${today}
          </h1>
          <p style="color: #555; font-size: 14px;">
            Roles matched to your profile. Copy-paste pitches included. Resume recommendation per role.
          </p>
          ${emailContent}
          <hr style="margin-top: 32px;">
          <p style="font-size: 12px; color: #999;">
            Sources checked: ${JOB_SOURCES.map((s) => s.name).join(", ")}<br>
            Target companies monitored: ${TARGET_COMPANIES.join(", ")}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Job digest sent to ${MAC_EMAIL}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Job scout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
