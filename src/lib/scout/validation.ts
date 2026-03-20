// Input validation and sanitization for scout profiles

const MAX_RESUME_LENGTH = 10000;
const MAX_ROLE_LENGTH = 100;
const MAX_COMPANY_LENGTH = 100;
const MAX_LOCATION_LENGTH = 100;
const MAX_SKILL_LENGTH = 100;
const MAX_ARRAY_ITEMS = 20;
const MAX_NOTES_LENGTH = 500;

function sanitizeString(input: string, maxLength: number): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>'"]/g, "") // Strip dangerous chars
    .trim()
    .slice(0, maxLength);
}

function sanitizeArray(
  input: unknown,
  maxLength: number,
  maxItems: number
): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === "string")
    .map((item) => sanitizeString(item, maxLength))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export interface ProfileInput {
  resume_text: string;
  target_roles: string[];
  target_companies: string[];
  target_locations: string[];
  salary_min: number | null;
  salary_max: number | null;
  skills: string[];
  resume_variant_notes: string | null;
}

export function validateAndSanitizeProfile(input: Record<string, unknown>): {
  valid: boolean;
  data: ProfileInput | null;
  error: string | null;
} {
  const resumeText =
    typeof input.resume_text === "string"
      ? sanitizeString(input.resume_text, MAX_RESUME_LENGTH)
      : "";

  if (!resumeText || resumeText.length < 50) {
    return {
      valid: false,
      data: null,
      error: "Resume must be at least 50 characters",
    };
  }

  const targetRoles = sanitizeArray(
    input.target_roles,
    MAX_ROLE_LENGTH,
    MAX_ARRAY_ITEMS
  );

  if (targetRoles.length === 0) {
    return {
      valid: false,
      data: null,
      error: "At least one target role is required",
    };
  }

  const salaryMin =
    typeof input.salary_min === "number" && input.salary_min > 0
      ? Math.min(input.salary_min, 1000000)
      : null;

  const salaryMax =
    typeof input.salary_max === "number" && input.salary_max > 0
      ? Math.min(input.salary_max, 1000000)
      : null;

  return {
    valid: true,
    error: null,
    data: {
      resume_text: resumeText,
      target_roles: targetRoles,
      target_companies: sanitizeArray(
        input.target_companies,
        MAX_COMPANY_LENGTH,
        MAX_ARRAY_ITEMS
      ),
      target_locations: sanitizeArray(
        input.target_locations,
        MAX_LOCATION_LENGTH,
        MAX_ARRAY_ITEMS
      ),
      salary_min: salaryMin,
      salary_max: salaryMax,
      skills: sanitizeArray(input.skills, MAX_SKILL_LENGTH, MAX_ARRAY_ITEMS),
      resume_variant_notes:
        typeof input.resume_variant_notes === "string"
          ? sanitizeString(input.resume_variant_notes, MAX_NOTES_LENGTH)
          : null,
    },
  };
}
