/**
 * SEO Auditor Agent
 *
 * Checks every article for SEO best practices and flags issues.
 * Run: npx tsx agents/08-seo-auditor.ts
 */

import fs from "fs";
import path from "path";
import { CONFIG } from "./config";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
}

interface Issue {
  severity: "error" | "warning" | "info";
  message: string;
}

function auditArticle(article: Article): Issue[] {
  const issues: Issue[] = [];
  const content = article.content;
  const textOnly = content.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;

  // Title checks
  if (article.title.length > 70) {
    issues.push({
      severity: "warning",
      message: `Title too long (${article.title.length} chars, aim for <70)`,
    });
  }
  if (article.title.length < 20) {
    issues.push({
      severity: "error",
      message: `Title too short (${article.title.length} chars)`,
    });
  }

  // Excerpt / meta description
  if (article.excerpt.length > 160) {
    issues.push({
      severity: "warning",
      message: `Excerpt too long for meta description (${article.excerpt.length} chars, aim for <160)`,
    });
  }
  if (article.excerpt.length < 50) {
    issues.push({
      severity: "warning",
      message: `Excerpt too short (${article.excerpt.length} chars, aim for 50-160)`,
    });
  }

  // Content length
  if (wordCount < 500) {
    issues.push({
      severity: "error",
      message: `Content too thin (${wordCount} words, aim for 800+)`,
    });
  } else if (wordCount < 800) {
    issues.push({
      severity: "warning",
      message: `Content slightly thin (${wordCount} words, aim for 800+)`,
    });
  }

  // Headings
  const h2Count = (content.match(/<h2/g) || []).length;
  if (h2Count < 2) {
    issues.push({
      severity: "warning",
      message: `Only ${h2Count} H2 headings (aim for 3+)`,
    });
  }

  // Keywords in content
  const primaryKeyword = article.keywords[0]?.toLowerCase();
  if (primaryKeyword && !textOnly.toLowerCase().includes(primaryKeyword)) {
    issues.push({
      severity: "error",
      message: `Primary keyword "${primaryKeyword}" not found in content`,
    });
  }

  // Keyword in title
  if (
    primaryKeyword &&
    !article.title.toLowerCase().includes(primaryKeyword.split(" ").slice(0, 3).join(" "))
  ) {
    issues.push({
      severity: "warning",
      message: `Primary keyword not reflected in title`,
    });
  }

  // Internal links
  const internalLinks = (content.match(/href="\/articles\//g) || []).length;
  if (internalLinks === 0) {
    issues.push({
      severity: "warning",
      message: `No internal links — run the internal linker agent`,
    });
  }

  // Images (we don't have images yet, but flag it)
  const imgCount = (content.match(/<img/g) || []).length;
  if (imgCount === 0) {
    issues.push({
      severity: "info",
      message: `No images — consider adding visual content`,
    });
  }

  // External/affiliate links
  const affiliateLinks = (content.match(/amazon\.com/g) || []).length;
  if (affiliateLinks === 0) {
    issues.push({
      severity: "info",
      message: `No affiliate links — run the affiliate injector`,
    });
  }

  // Lists
  const hasList = content.includes("<ul") || content.includes("<ol");
  if (!hasList) {
    issues.push({
      severity: "info",
      message: `No lists — structured content helps SEO`,
    });
  }

  return issues;
}

function main() {
  console.log("🔎 SEO Auditor starting...\n");

  const files = fs
    .readdirSync(CONFIG.CONTENT_DIR)
    .filter((f) => f.endsWith(".json"));

  let totalErrors = 0;
  let totalWarnings = 0;

  const report: string[] = ["# SEO Audit Report", `Date: ${new Date().toISOString().split("T")[0]}`, ""];

  for (const file of files) {
    const article: Article = JSON.parse(
      fs.readFileSync(path.join(CONFIG.CONTENT_DIR, file), "utf-8")
    );

    const issues = auditArticle(article);
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");
    const infos = issues.filter((i) => i.severity === "info");

    totalErrors += errors.length;
    totalWarnings += warnings.length;

    const icon =
      errors.length > 0 ? "❌" : warnings.length > 0 ? "⚠️" : "✅";
    console.log(`${icon} ${article.slug}`);

    report.push(`## ${article.title}`);
    report.push(`Slug: ${article.slug}`);

    if (issues.length === 0) {
      console.log(`   All clear!`);
      report.push("All clear!");
    } else {
      for (const issue of issues) {
        const prefix =
          issue.severity === "error"
            ? "  ❌"
            : issue.severity === "warning"
              ? "  ⚠️"
              : "  ℹ️";
        console.log(`${prefix} ${issue.message}`);
        report.push(`- [${issue.severity.toUpperCase()}] ${issue.message}`);
      }
    }
    report.push("");
  }

  // Save report
  const reportPath = path.join(process.cwd(), "agents/data/seo-audit.md");
  fs.writeFileSync(reportPath, report.join("\n"));

  console.log(`\n========================================`);
  console.log(`  Audit complete: ${files.length} articles`);
  console.log(`  ❌ Errors: ${totalErrors}`);
  console.log(`  ⚠️  Warnings: ${totalWarnings}`);
  console.log(`  Report saved: agents/data/seo-audit.md`);
  console.log(`========================================`);
}

main();
