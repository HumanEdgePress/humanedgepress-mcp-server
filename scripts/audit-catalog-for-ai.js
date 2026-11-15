/**
 * Audits Human Edge Press's live Shopify catalog & blog metadata for AI Shopping & Citation Readiness.
 * Outputs actionable reports in reports/catalog-ai-audit.md and reports/catalog-ai-audit.csv.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const books = JSON.parse(fs.readFileSync(path.join(root, "data", "books.json"), "utf-8"));
const blogs = JSON.parse(fs.readFileSync(path.join(root, "data", "blogs_and_pages.json"), "utf-8"));

const reportsDir = path.join(root, "reports");
fs.mkdirSync(reportsDir, { recursive: true });

const rows = [];
let missingSkuCount = 0;
let singleImageCount = 0;
let missingAgeInTitleCount = 0;

for (const b of books) {
  const issues = [];
  const hasSku = b.variants.every((v) => Boolean(v.sku));
  if (!hasSku) {
    missingSkuCount++;
    issues.push("Missing SKU/ISBN on variant (helpful for Google Merchant Center & book schema)");
  }
  if ((b.images || []).length < 2) {
    singleImageCount++;
    issues.push("Fewer than 2 product images (add interior spread photos for higher AI shopping CTR)");
  }
  if (!/age|0–2|2–4|3–5|3–7|baby|pre-k|steam/i.test(b.title)) {
    missingAgeInTitleCount++;
    issues.push("Consider adding age stage or format subtitle (e.g. 'Ages 3–7 Hardcover Virtue Book') for search queries");
  }
  rows.push({
    handle: b.handle,
    title: b.title,
    series: b.series,
    ageStage: b.ageStage,
    price: b.priceFormatted,
    imageCount: (b.images || []).length,
    hasSku,
    tagCount: (b.tags || []).length,
    issues
  });
}

const shopifyBlogsCount = blogs.filter((r) => r.sourceType === "shopify_blog").length;
const editorialPagesCount = blogs.filter((r) => r.sourceType === "editorial_page").length;

const md = [
  "# Human Edge Press — AI Discoverability, Shopping & Blog Citation Audit",
  "",
  `*Generated on ${new Date().toISOString().slice(0, 10)} across ${books.length} live products and ${blogs.length} synced editorial assets.*`,
  "",
  "## 1. Executive Summary",
  `- **Active Published Books & Bundles**: **${books.length}**`,
  `- **Synced Shopify Blog Articles (\`/blogs/*\`)**: **${shopifyBlogsCount}**`,
  `- **Synced Editorial & Research Pages (\`/pages/*\`)**: **${editorialPagesCount}**`,
  `- **Products missing variant SKU / ISBN**: **${missingSkuCount} / ${books.length}**`,
  `- **Products with < 2 gallery images**: **${singleImageCount} / ${books.length}**`,
  `- **Titles without explicit age/format keyword**: **${missingAgeInTitleCount} / ${books.length}**`,
  "",
  "## 2. High-Impact Storefront Action Items Discovered",
  `1. **Populate \`/blogs/news\` Using \`content/articles/\`**: \`/blogs/news\` currently has **${shopifyBlogsCount}** published blog articles while your research essays live in \`/pages/*\`. Publishing the 6 generated HTML articles in \`content/articles/\` activates \`/blogs/news.atom\` RSS, \`/sitemap_blogs_1.xml\`, and \`BlogPosting\` JSON-LD.`,
  "2. **Fix Live Liquid Error on Human Edge Series Product Pages**: In Shopify Theme Editor, check `sections/product-human-edge-content.liquid` around **line 107** (`Liquid error: comparison of String with 1 failed` — cast with `| plus: 0` before comparing to `1`; see `content/theme/FIX_PRODUCT_LIQUID_LINE_107.md`).",
  "3. **Publish Smart Collections to Online Store Sitemap**: Ensure `/collections/high-contrast-baby-books`, `/collections/steam-board-books`, and `/collections/human-edge-series` are published to the Online Store channel so `/sitemap_collections_1.xml` indexes all series (not just `frontpage`).",
  "4. **Align Free US Shipping Threshold Copy**: Site announcement bar states **Free shipping on orders $50+**, while `/pages/shipping` states **Free Shipping over $49**.",
  "5. **Add Variant SKUs / ISBNs & Interior Spread Images**: Adding SKUs/ISBNs and 2–3 interior page-spread photos per book unlocks richer Google Merchant Center & Gemini/ChatGPT shopping cards.",
  "",
  "## 3. Per-Product AI Readiness Table",
  "| Title | Handle | Stage | Images | SKU | Recommendations |",
  "| :--- | :--- | :--- | :---: | :---: | :--- |",
  ...rows.map(
    (r) =>
      `| ${r.title} | \`${r.handle}\` | ${r.ageStage} | ${r.imageCount} | ${r.hasSku ? "Yes" : "No"} | ${r.issues.join("; ") || "Ready"} |`
  )
].join("\n");

const csvEscape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
const csv = [
  ["handle", "title", "series", "age_stage", "price", "image_count", "has_sku", "tag_count", "recommendations"].join(","),
  ...rows.map((r) =>
    [
      r.handle,
      r.title,
      r.series,
      r.ageStage,
      r.price,
      r.imageCount,
      r.hasSku,
      r.tagCount,
      r.issues.join(" | ")
    ]
      .map(csvEscape)
      .join(",")
  )
].join("\n");

fs.writeFileSync(path.join(reportsDir, "catalog-ai-audit.md"), md + "\n", "utf-8");
fs.writeFileSync(path.join(reportsDir, "catalog-ai-audit.csv"), csv + "\n", "utf-8");
console.log(`[Audit] Audited ${books.length} books & ${blogs.length} essays -> reports/catalog-ai-audit.md`);
