import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  company: string;
  role: string;
  type: string;
  jobDescription?: string;
  messages: Message[];
}

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { company, role, type, jobDescription, messages } = body;

  if (!company || !role || !type) {
    return NextResponse.json(
      { error: "company, role, and type are required" },
      { status: 400 }
    );
  }

  if (jobDescription && jobDescription.length > 15000) {
    return NextResponse.json(
      { error: "Job description is too long (max 15,000 characters)" },
      { status: 400 }
    );
  }

  const jdSection = jobDescription
    ? `\n\nJob Description:\n${jobDescription}`
    : "";

  const systemPrompt = `You are a senior interviewer at ${company}, conducting a ${type} interview for a ${role} position.${jdSection}

Your behavior:
- Ask realistic, challenging questions one at a time that a real interviewer at ${company} would ask for this specific role and interview type.
- After the candidate answers, give concise but helpful feedback (2-3 sentences max) on their answer — what was strong, what could be improved.
- Then either ask a follow-up question or move to the next topic.
- Keep a mental count of questions asked. After 6-8 questions, instead of asking another question, provide a comprehensive scorecard.

When providing the scorecard (after 6-8 questions), use EXACTLY this format:

[SCORECARD]
Overall Score: X/10

Strengths:
- Strength 1
- Strength 2
- Strength 3

Areas to Improve:
- Area 1
- Area 2
- Area 3

Recommended Practice Areas:
- Practice area 1
- Practice area 2
- Practice area 3
[/SCORECARD]

Important rules:
- Output plain text only, no markdown formatting, no HTML.
- Be specific to the company, role, and interview type.
- For behavioral interviews, expect STAR-format answers.
- For technical interviews, ask about architecture, system design, or coding concepts relevant to the role.
- For case study interviews, present realistic business scenarios.
- For culture fit interviews, explore values alignment and work style.
- Start with your first question immediately. Do not introduce yourself with a long preamble — just a brief one-liner greeting and then the question.`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const apiMessages =
      messages.length === 0
        ? [{ role: "user" as const, content: "Begin the interview." }]
        : messages;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: apiMessages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const message = textBlock ? textBlock.text : "";

    const isComplete = message.includes("[SCORECARD]");

    let scorecard = null;
    if (isComplete) {
      const match = message.match(
        /\[SCORECARD\]([\s\S]*?)\[\/SCORECARD\]/
      );
      if (match) {
        const raw = match[1].trim();

        const scoreMatch = raw.match(/Overall Score:\s*(\d+)\/10/);
        const overallScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 7;

        const strengthsMatch = raw.match(
          /Strengths:\n([\s\S]*?)(?=\nAreas to Improve:)/
        );
        const strengths = strengthsMatch
          ? strengthsMatch[1]
              .trim()
              .split("\n")
              .map((s: string) => s.replace(/^-\s*/, "").trim())
              .filter(Boolean)
          : [];

        const areasMatch = raw.match(
          /Areas to Improve:\n([\s\S]*?)(?=\nRecommended Practice Areas:)/
        );
        const areasToImprove = areasMatch
          ? areasMatch[1]
              .trim()
              .split("\n")
              .map((s: string) => s.replace(/^-\s*/, "").trim())
              .filter(Boolean)
          : [];

        const practiceMatch = raw.match(
          /Recommended Practice Areas:\n([\s\S]*?)$/
        );
        const practiceAreas = practiceMatch
          ? practiceMatch[1]
              .trim()
              .split("\n")
              .map((s: string) => s.replace(/^-\s*/, "").trim())
              .filter(Boolean)
          : [];

        scorecard = {
          overallScore,
          strengths,
          areasToImprove,
          practiceAreas,
        };
      }
    }

    // Strip scorecard tags from the message for cleaner display
    const cleanMessage = message
      .replace(/\[SCORECARD\][\s\S]*?\[\/SCORECARD\]/, "")
      .trim();

    return NextResponse.json({
      message: cleanMessage,
      isComplete,
      scorecard,
    });
  } catch (err) {
    console.error("Interview sim API error:", err);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
