import { NextRequest, NextResponse } from "next/server";
import { getUser, createClient } from "@/lib/scout/supabase-server";
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

  const { company, role, jobDescription } = body;

  if (!company || !role || !jobDescription) {
    return NextResponse.json(
      { error: "company, role, and jobDescription are required" },
      { status: 400 }
    );
  }

  if (jobDescription.length > 15000) {
    return NextResponse.json(
      { error: "Job description is too long (max 15,000 characters)" },
      { status: 400 }
    );
  }

  // Fetch user's profile for personalization
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("scout_profiles")
    .select("resume_text, skills")
    .eq("user_id", user.id)
    .single();

  const resumeText = profile?.resume_text || "No resume on file.";
  const skills = profile?.skills?.join(", ") || "Not specified";

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are an expert interview coach. A job seeker needs help preparing for an interview.

## THE CANDIDATE
Resume / experience:
${resumeText}

Key skills: ${skills}

## THE OPPORTUNITY
Company: ${company}
Role: ${role}
Job Description:
${jobDescription}

## YOUR TASK
Produce a comprehensive interview prep document in clean HTML (no markdown, no code fences). Use the following structure:

<h2>Likely Interview Questions</h2>
Generate exactly 5 interview questions that are specific to this role at ${company} — not generic. Reference actual requirements from the job description.
For each question:
<h3>Q1: [Question text]</h3>
<p><b>Suggested answer:</b> A strong answer (3-5 sentences) tailored to the candidate's resume and experience. Reference specific projects, skills, or accomplishments from their resume where relevant.</p>

<h2>Questions to Ask the Interviewer</h2>
Provide exactly 3 smart, specific questions the candidate should ask. These should demonstrate knowledge of ${company} and genuine curiosity about the role. For each:
<h3>[Question]</h3>
<p><b>Why this works:</b> Brief explanation of what this question signals to the interviewer.</p>

<h2>Key Talking Points</h2>
<p>Provide 4-5 bullet points (use <ul><li> tags) that connect the candidate's specific experience to this role's requirements. Each bullet should bridge a resume highlight to a job description requirement.</p>

Important guidelines:
- Be specific, not generic. Reference the actual company, role requirements, and candidate background.
- Answers should sound natural and conversational, not robotic.
- If the resume is sparse, work with what's available and note where the candidate should prepare additional examples.
- Output ONLY the HTML content, no wrapper tags like <html> or <body>.`,
      },
    ],
  });

  const html =
    response.content[0].type === "text"
      ? response.content[0].text
      : "<p>Failed to generate interview prep.</p>";

  return NextResponse.json({ html });
}
