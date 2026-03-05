#!/bin/bash
# LeafLogic Agent Pipeline
# Run all agents in sequence to generate and publish content.
#
# Usage: ./agents/run-all.sh
# Set ANTHROPIC_API_KEY env var before running.

set -e

cd "$(dirname "$0")/.."

echo "========================================="
echo "  LeafLogic Agent Pipeline"
echo "========================================="
echo ""

# Step 1: Keyword Research
echo "--- Step 1: Keyword Scout ---"
npx tsx agents/01-keyword-scout.ts
echo ""

# Step 2: Content Generation
echo "--- Step 2: Content Writer ---"
npx tsx agents/02-content-writer.ts
echo ""

# Step 3: Internal Linking
echo "--- Step 3: Internal Linker ---"
npx tsx agents/03-internal-linker.ts
echo ""

# Step 4: Sitemap
echo "--- Step 4: Sitemap Generator ---"
npx tsx agents/04-sitemap-generator.ts
echo ""

echo "========================================="
echo "  Pipeline complete!"
echo "  Run 'npm run build' to rebuild the site."
echo "========================================="
