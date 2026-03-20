// Job Fit Score — pure heuristic, no API calls
// Returns a 1-100 score based on keyword overlap between user profile and job text

export interface FitScoreBreakdown {
  roleMatch: number;
  skillsMatch: number;
  locationMatch: number;
  companyMatch: number;
}

export type FitLabel = "Strong" | "Good" | "Stretch" | "Long shot";

export interface FitScoreResult {
  score: number;
  breakdown: FitScoreBreakdown;
  label: FitLabel;
}

interface FitScoreInput {
  targetRoles: string[];
  skills: string[];
  targetLocations: string[];
  targetCompanies: string[];
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function tokenize(s: string): string[] {
  return normalize(s).split(/\s+/).filter((t) => t.length > 1);
}

/**
 * Calculates overlap between a set of target terms and job text.
 * Returns 0-100 representing how many target terms appear in the text.
 */
function overlapScore(targets: string[], jobText: string): number {
  if (targets.length === 0) return 50; // neutral if nothing specified
  const normalizedText = normalize(jobText);
  let matches = 0;
  for (const target of targets) {
    const normalizedTarget = normalize(target);
    // Check both full phrase and individual tokens
    if (normalizedText.includes(normalizedTarget)) {
      matches++;
      continue;
    }
    // Check if most tokens from the target appear
    const tokens = tokenize(target);
    if (tokens.length === 0) continue;
    const tokenMatches = tokens.filter((t) => normalizedText.includes(t)).length;
    if (tokenMatches / tokens.length >= 0.6) {
      matches += 0.7; // partial credit
    }
  }
  return Math.min(100, Math.round((matches / targets.length) * 100));
}

function getLabel(score: number): FitLabel {
  if (score >= 75) return "Strong";
  if (score >= 55) return "Good";
  if (score >= 35) return "Stretch";
  return "Long shot";
}

/**
 * Calculate a fit score for a job against a user profile.
 * Weights: role title match (40%), skills overlap (30%), location match (20%), company preference (10%)
 */
export function calculateFitScore(
  profile: FitScoreInput,
  jobTitle: string,
  jobText: string
): FitScoreResult {
  const fullText = `${jobTitle} ${jobText}`;

  const roleMatch = overlapScore(profile.targetRoles, fullText);
  const skillsMatch = overlapScore(profile.skills, fullText);
  const locationMatch = overlapScore(profile.targetLocations, fullText);
  const companyMatch = overlapScore(profile.targetCompanies, jobTitle);

  const score = Math.round(
    roleMatch * 0.4 +
    skillsMatch * 0.3 +
    locationMatch * 0.2 +
    companyMatch * 0.1
  );

  // Clamp to 1-100
  const clampedScore = Math.max(1, Math.min(100, score));

  return {
    score: clampedScore,
    breakdown: { roleMatch, skillsMatch, locationMatch, companyMatch },
    label: getLabel(clampedScore),
  };
}

/**
 * Returns the CSS color class for a fit label (for use in digest badges).
 */
export function fitLabelColor(label: FitLabel): string {
  switch (label) {
    case "Strong":
      return "#10b981"; // emerald
    case "Good":
      return "#3b82f6"; // blue
    case "Stretch":
      return "#f59e0b"; // amber
    case "Long shot":
      return "#ef4444"; // red
  }
}

/**
 * Generate an HTML badge for a fit score, for embedding in digest emails.
 */
export function fitScoreBadgeHtml(result: FitScoreResult): string {
  const color = fitLabelColor(result.label);
  return `<span style="display:inline-block;background:${color}22;color:${color};border:1px solid ${color}44;border-radius:12px;padding:2px 10px;font-size:12px;font-weight:600;margin-left:8px;">${result.score}% ${result.label}</span>`;
}
