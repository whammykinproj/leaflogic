import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { company: string; context?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.company || body.company.length < 2) {
    return NextResponse.json({ error: "Company name required" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are a company research analyst helping a job seeker prepare for applications and interviews. Research this company and provide a comprehensive brief.

COMPANY: ${body.company}
${body.context ? `ADDITIONAL CONTEXT: ${body.context}` : ""}

Provide the following as clean HTML (no markdown). Be specific and actionable:

<h2>Company Overview</h2>
<p>What the company does, founding year (if known), HQ location, size estimate, stage (startup/growth/enterprise). 2-3 sentences max.</p>

<h2>Mission & Culture</h2>
<p>What drives this company? What's their mission? What's the culture like based on public signals (Glassdoor themes, LinkedIn presence, engineering blog, etc.)? What type of person thrives here?</p>

<h2>Recent News & Momentum</h2>
<p>Any recent funding rounds, product launches, partnerships, or press coverage? What direction is the company heading? If you don't have recent data, say so honestly and suggest where to look.</p>

<h2>Key People to Know</h2>
<p>CEO, CTO, notable leaders. For each, a one-liner on their background. This helps the candidate reference leaders in cover letters or interviews.</p>

<h2>Interview Intelligence</h2>
<p>Based on publicly available information:
- What interview format do they likely use? (Behavioral, case study, technical, etc.)
- What values do they screen for?
- Common Glassdoor interview themes?</p>

<h2>Talking Points for Your Application</h2>
<p>3-4 specific things the candidate could mention in a cover letter or interview that would show genuine knowledge of this company. Be specific — reference real products, initiatives, or values.</p>

<h2>Red Flags to Watch For</h2>
<p>Any publicly known concerns? Glassdoor trends? Layoff history? High turnover signals? Be honest — this helps the candidate make informed decisions.</p>

<h2>Verdict</h2>
<p>One paragraph: is this company worth pursuing? What type of candidate would be the best fit?</p>

Be honest, specific, and helpful. If you don't know something, say "Not available — check [specific source]" rather than making it up.`,
      },
    ],
  });

  const html =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Unable to generate research.";

  return NextResponse.json({ html });
}
