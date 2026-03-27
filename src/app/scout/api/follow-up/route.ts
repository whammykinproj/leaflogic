import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/scout/supabase-server";
import { getScoutProfile } from "@/lib/scout/supabase-server";
import Anthropic from "@anthropic-ai/sdk";

const EMAIL_TYPES = {
  thank_you: "Write a professional thank-you email after a job interview.",
  status_check:
    "Write a professional follow-up email to check on the status of a job application.",
  follow_up:
    "Write a professional follow-up email after a job interview to reiterate interest and qualifications.",
  negotiate:
    "Write a professional email to negotiate a job offer (salary, benefits, start date, etc.).",
} as const;

type EmailType = keyof typeof EMAIL_TYPES;

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    company: string;
    role: string;
    status: string;
    context?: string;
    type: EmailType;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.company || !body.role || !body.type) {
    return NextResponse.json(
      { error: "company, role, and type are required" },
      { status: 400 }
    );
  }

  if (!EMAIL_TYPES[body.type]) {
    return NextResponse.json(
      { error: "Invalid email type" },
      { status: 400 }
    );
  }

  const profile = await getScoutProfile(user.id);

  const client = new Anthropic();

  const systemPrompt = `You are an expert career coach and professional email writer. Write concise, warm, and professional emails that feel human — not templated. Keep emails under 200 words. Do not include subject lines or email headers. Just write the body of the email. Use the candidate's name if provided.`;

  const userPrompt = `${EMAIL_TYPES[body.type]}

Company: ${body.company}
Role: ${body.role}
Current application status: ${body.status}
${profile?.full_name ? `Candidate name: ${profile.full_name}` : ""}
${body.context ? `Additional context: ${body.context}` : ""}

Write the email body only. Be concise, professional, and genuine.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ html: text });
  } catch (err) {
    console.error("Follow-up email generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}
