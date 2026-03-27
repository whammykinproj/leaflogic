import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  let body: {
    company: string;
    role: string;
    baseSalary: number;
    equity?: string;
    signingBonus?: number;
    benefits?: string;
    experience: string;
    location: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { company, role, baseSalary, equity, signingBonus, benefits, experience, location } = body;

  if (!company || !role || !baseSalary || !experience || !location) {
    return NextResponse.json(
      { error: "Company, role, base salary, experience, and location are required." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are an expert salary negotiation coach with deep knowledge of tech compensation. Analyze this job offer and provide a comprehensive negotiation strategy.

## THE OFFER
Company: ${company}
Role: ${role}
Base Salary: $${baseSalary.toLocaleString()}
${equity ? `Equity/RSUs: ${equity}` : "Equity/RSUs: Not specified"}
${signingBonus ? `Signing Bonus: $${signingBonus.toLocaleString()}` : "Signing Bonus: None offered"}
${benefits ? `Other Benefits/Perks: ${benefits}` : ""}
Experience Level: ${experience}
Location: ${location}

## YOUR TASK
Produce a comprehensive salary negotiation package in clean HTML (no markdown, no code fences, no wrapper tags like <html> or <body>). Use the following structure exactly:

<h2>📊 Offer Assessment</h2>
<p>Analyze how this offer compares to market rates for a ${experience}-level ${role} in ${location}. Provide a clear verdict: <strong>Below Market</strong>, <strong>At Market</strong>, or <strong>Above Market</strong>. Include estimated market range. Be specific with numbers.</p>

<h2>💰 Counter-Offer Strategy</h2>
<p>Provide specific counter-offer numbers for base salary, equity, and signing bonus. Justify each number with market data reasoning. Structure as a clear table or list showing: Current Offer → Suggested Counter → Justification for each component.</p>

<h2>📧 Email Template: Grateful Counter-Offer</h2>
<div class="email-template">Write a complete, ready-to-send email for countering the offer. It should be grateful, professional, and confident. Include specific numbers. The candidate should be able to copy-paste this with minimal edits.</div>

<h2>📧 Email Template: Follow-Up After Verbal Negotiation</h2>
<div class="email-template">Write a follow-up email for after a verbal negotiation call. It should summarize agreed-upon terms and express enthusiasm. Ready to copy-paste.</div>

<h2>🎯 Talking Points</h2>
<p>Provide 5-7 specific talking points as a bulleted list (<ul><li> tags) for the negotiation conversation. Each should be a concrete thing to say, not vague advice. Include phrases the candidate can use verbatim.</p>

<h2>🚩 Red Flags to Watch For</h2>
<p>List 4-6 potential red flags or things to watch out for in the offer/contract, specific to this type of role and company. Use a bulleted list.</p>

<h2>📈 Total Compensation Breakdown</h2>
<p>Create a comparison showing annualized total compensation for the current offer vs. the suggested counter-offer. Break down: Base + Equity (annualized) + Signing Bonus (annualized over typical vesting) + estimated benefits value. Show both as clear totals.</p>

Important guidelines:
- Be specific with numbers — don't give vague ranges like "10-20% more"
- All dollar amounts should be formatted with $ and commas
- Email templates should be complete and professional, ready to send
- Each email template MUST be wrapped in a <div class="email-template"> tag
- Output ONLY the HTML content, no wrapper tags.`,
      },
    ],
  });

  const html =
    response.content[0].type === "text"
      ? response.content[0].text
      : "<p>Failed to generate negotiation analysis.</p>";

  return NextResponse.json({ html });
}
