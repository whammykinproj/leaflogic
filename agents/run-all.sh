#!/bin/bash
# LeafLogic Agent Pipeline — Full Money Machine
# Runs ALL agents in sequence: research → write → optimize → index → promote
#
# Usage: ./agents/run-all.sh
# Required env vars: ANTHROPIC_API_KEY
# Optional env vars: AMAZON_AFFILIATE_TAG, BATCH_SIZE

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

# Step 4: Affiliate Links
echo "--- Step 4: Affiliate Injector ---"
npx tsx agents/05-affiliate-injector.ts
echo ""

# Step 5: SEO Audit
echo "--- Step 5: SEO Auditor ---"
npx tsx agents/08-seo-auditor.ts
echo ""

# Step 6: Sitemap
echo "--- Step 6: Sitemap Generator ---"
npx tsx agents/04-sitemap-generator.ts
echo ""

# Step 7: Ping Search Engines
echo "--- Step 7: Google Indexer ---"
npx tsx agents/06-google-indexer.ts
echo ""

# Step 8: Social Media Posts
echo "--- Step 8: Social Post Generator ---"
npx tsx agents/07-social-poster.ts
echo ""

echo "========================================="
echo "  Pipeline complete!"
echo "  New articles, affiliate links, social"
echo "  posts, and search engine pings done."
echo "========================================="
