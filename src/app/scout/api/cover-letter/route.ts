import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import { getScoutProfile } from "@/lib/scout/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { company: string; role: string; jobDescription: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.company || !body.role) {
    return NextResponse.json(
      { error: "Company and role are required" },
      { status: 400 }
    );
  }

  const profile = await getScoutProfile(user.id);
  if (!profile?.resume_text) {
    return NextResponse.json(
      { error: "Please add your resume first." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Write a compelling, personalized cover letter for this job application.

APPLICANT RESUME:
${profile.resume_text}

APPLICANT SKILLS: ${(profile.skills || []).join(", ")}

TARGET JOB:
Company: ${body.company}
Role: ${body.role}
${body.jobDescription ? `Job Description:\n${body.jobDescription}` : ""}

INSTRUCTIONS:
- Write a professional but personable cover letter (250-350 words)
- Open with a hook that shows genuine interest in the company/role (not generic)
- Connect 2-3 specific experiences from the resume to the job requirements
- Show you understand what the company does and why you want to work there
- End with a confident, forward-looking close
- Tone: professional, confident, human — not stiff or formulaic
- DO NOT use phrases like "I am writing to express my interest" or "I believe I would be a great fit"
- Output as clean HTML with paragraphs. No headers, just the letter body.
- After the letter, add a <hr> and a brief section titled "Key talking points" with 3-4 bullet points the applicant should emphasize if they get an interview.`,
      },
    ],
  });

  const html =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Unable to generate cover letter.";

  return NextResponse.json({ html });
}
