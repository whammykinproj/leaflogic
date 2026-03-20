import { NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import { getScoutProfile } from "@/lib/scout/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getScoutProfile(user.id);
  if (!profile?.resume_text || profile.resume_text.length < 50) {
    return NextResponse.json(
      { error: "Please add your resume in your profile first." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are an expert resume reviewer and career coach. Review this resume and provide actionable, specific feedback.

TARGET ROLES: ${(profile.target_roles || []).join(", ") || "Not specified"}
TARGET LOCATIONS: ${(profile.target_locations || []).join(", ") || "Not specified"}
SKILLS HIGHLIGHTED: ${(profile.skills || []).join(", ") || "Not specified"}

RESUME:
${profile.resume_text}

Provide your review as clean HTML (no markdown). Structure it as:

<h2>Overall Score</h2>
<p>Give a score out of 10 and a 2-sentence summary of the resume's strength.</p>

<h2>Top 3 Strengths</h2>
<p>What's working well — be specific, reference actual content from the resume.</p>

<h2>Top 3 Improvements</h2>
<p>What would make the biggest difference — be specific and actionable. For each, show a before/after example if possible.</p>

<h2>Missing Keywords</h2>
<p>Based on the target roles, what keywords or skills are missing that recruiters/ATS systems look for?</p>

<h2>Formatting & Structure</h2>
<p>Any issues with how the resume is organized? Suggestions for better flow?</p>

<h2>Tailored Advice</h2>
<p>Based on the target roles (${(profile.target_roles || []).join(", ")}), what specific changes would make this resume land more interviews for those roles?</p>

Be direct, honest, and constructive. No fluff.`,
      },
    ],
  });

  const html =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Unable to generate review.";

  return NextResponse.json({ html });
}
