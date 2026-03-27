import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    company: string;
    role: string;
    industry?: string;
    focusAreas?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.company || body.company.length < 2) {
    return NextResponse.json(
      { error: "Company name required" },
      { status: 400 }
    );
  }
  if (!body.role || body.role.length < 2) {
    return NextResponse.json(
      { error: "Role title required" },
      { status: 400 }
    );
  }

  const focusNote =
    body.focusAreas && body.focusAreas.length > 0
      ? `\n\nThe candidate is ESPECIALLY interested in these areas (give extra depth here): ${body.focusAreas.join(", ")}`
      : "";

  const industryNote = body.industry
    ? `\nINDUSTRY: ${body.industry}`
    : "";

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are an elite company research analyst preparing an intelligence brief for a job seeker. This is the kind of deep research a top recruiter would do before sending a candidate to interview.

COMPANY: ${body.company}
ROLE: ${body.role}${industryNote}${focusNote}

Generate a comprehensive Company Intelligence Brief as clean HTML (no markdown, no code fences, no \`\`\`). Each section should be wrapped in a <div class="section-card"> for visual separation.

Include ALL 8 sections below:

<h2>1. Company Snapshot</h2>
<div class="section-card">
One paragraph: what the company does, founding year, HQ, employee count estimate, funding stage/revenue estimate, key investors. Be specific with numbers where possible.
</div>

<h2>2. Culture & Values</h2>
<div class="section-card">
What employees say about working there (Glassdoor themes). Work-life balance reality. Remote/hybrid/in-office policy. What type of person thrives here vs. who would struggle. Engineering culture vs. business culture balance.
</div>

<h2>3. Recent News & Momentum</h2>
<div class="section-card">
Last 6-12 months of notable events: funding rounds, product launches, partnerships, leadership changes, layoffs, acquisitions. What direction is the company heading? If you don't have recent data, say so honestly and name specific sources to check (TechCrunch, Crunchbase, etc.).
</div>

<h2>4. Interview Intelligence</h2>
<div class="section-card">
For the role of ${body.role}:
- Interview process stages (how many rounds, types)
- Common question themes from Glassdoor/Levels.fyi
- Values they screen for
- Technical vs. behavioral split
- Timeline (how long from first screen to offer)
- Tips from people who've been through it
</div>

<h2>5. Compensation Intel</h2>
<div class="section-card">
For ${body.role} at this company:
- Estimated salary range (base)
- Equity/RSU expectations
- Bonus structure
- Notable benefits or perks
- How comp compares to market (above/at/below)
Source your estimates (Levels.fyi, Glassdoor, Blind, etc.)
</div>

<h2>6. Red Flags & Concerns</h2>
<div class="section-card">
Be honest and direct:
- Any layoff history? When and how many?
- Glassdoor complaint patterns (management, WLB, growth)
- Turnover signals (lots of recent job postings for same role?)
- Burn rate concerns (if startup)
- Any controversies or legal issues?
If there are genuinely no red flags, say so — don't fabricate concerns.
</div>

<h2>7. Your Angle — Talking Points</h2>
<div class="section-card">
3-5 SPECIFIC talking points the candidate should use in their cover letter or interview for the ${body.role} role. Reference real products, initiatives, technologies, or values. These should demonstrate genuine knowledge of the company, not generic statements.
</div>

<h2>8. Key People to Research</h2>
<div class="section-card">
- CEO/Founder: name + one-line background
- CTO/VP Eng: name + one-line background
- Likely hiring manager (title and team)
- 2-3 team leads or notable employees to look up on LinkedIn
For each person, suggest one thing the candidate could reference in conversation.
</div>

Be honest, specific, and actionable. If you don't know something, say "Not available — check [specific source]" rather than making it up. This is an intelligence brief, not a marketing brochure.`,
      },
    ],
  });

  const html =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Unable to generate research.";

  return NextResponse.json({ html });
}
