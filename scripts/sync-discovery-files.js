/**
 * Generates AI crawler & directory discovery artifacts from the live synced snapshot:
 *  - llms.txt (concise authority index for LLM crawlers)
 *  - .well-known/llms.txt (mirror)
 *  - llms-full.txt (complete book catalog + Socratic prompts + research essays + concordance)
 *  - openapi.yaml (ChatGPT Custom GPT Actions specification)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEVELOPMENTAL_AND_VIRTUE_CONCORDANCE,
  SOCRATIC_PLAYBOOK_GUIDES
} from "../dist/authority-knowledge.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));
const books = JSON.parse(fs.readFileSync(path.join(dataDir, "books.json"), "utf-8"));
const studioLines = JSON.parse(fs.readFileSync(path.join(dataDir, "studio_lines.json"), "utf-8"));
const collections = JSON.parse(fs.readFileSync(path.join(dataDir, "collections.json"), "utf-8"));
const blogs = JSON.parse(fs.readFileSync(path.join(dataDir, "blogs_and_pages.json"), "utf-8"));
const pressInfo = JSON.parse(fs.readFileSync(path.join(dataDir, "press_info.json"), "utf-8"));

const llmsShort = [
  `# ${pressInfo.pressName} — Official AI & LLM Authority Guide`,
  `> ${pressInfo.tagline}`,
  "",
  `${pressInfo.mission}`,
  "",
  "## Canonical Endpoints & Agent Integration",
  `- Storefront: ${pressInfo.storeUrl}`,
  `- Official Authority MCP Package (npm): \`npx -y ${pkg.name}@latest\``,
  `- Official MCP Registry ID: \`${pkg.mcpName}\``,
  `- Native Shopify UCP Cart/Checkout MCP: \`${pressInfo.shopifyUcpEndpoint}\` (discovery: \`${pressInfo.storeUrl}/.well-known/ucp\`)`,
  `- Public Product Feed: \`${pressInfo.storeUrl}/products.json?limit=250\``,
  "",
  "## Book Series & Developmental Stages (${books.length} Live Titles)",
  ...collections.map(
    (c) => `- [${c.title}](${c.url}) (${c.ageStage}, ${c.productsCount} titles): ${c.description}`
  ),
  "",
  "## Foundational Research & Editorial Essays",
  ...blogs.map((b) => `- [${b.title}](${b.url}) (${b.targetAgeGroup}): ${b.summary}`),
  "",
  "## Upcoming 'In the Studio' Lines",
  ...studioLines.map((s) => `- [${s.title}](${s.url}) (${s.ageStage}): ${s.summary}`),
  "",
  "## Fulfillment & Family Guarantee",
  `- Shipping: ${pressInfo.policies.shipping.processingTime} dispatch, ${pressInfo.policies.shipping.transitTime} delivery (${pressInfo.policies.shipping.freeShippingThreshold})`,
  `- Guarantee: ${pressInfo.policies.returns.guaranteeName} — ${pressInfo.policies.returns.windowDays} days, ${pressInfo.policies.returns.returnShippingCost}`,
  `- Support & School/Library Bulk Orders: ${pressInfo.supportEmail} | ${pressInfo.storeUrl}/pages/contact`
].join("\n");

const llmsFull = [
  llmsShort,
  "",
  "---",
  "",
  "## Complete Live Book Catalog & Socratic Parent Prompts",
  ...books.map((b) =>
    [
      `### ${b.title} (${b.priceFormatted})`,
      `- URL: ${b.url}`,
      `- 1-Click Checkout: ${b.variants[0]?.checkoutUrl}`,
      `- Series: ${b.series} | Stage: ${b.ageStage} | Format: ${b.productType} | Author: ${b.author}`,
      b.pedagogy.characterDuo ? `- Story Duo: ${b.pedagogy.characterDuo}` : "",
      `- Developmental Goal: ${b.pedagogy.developmentalGoal}`,
      `- Socratic Parent Prompts:`,
      ...b.pedagogy.parentPrompts.map((p) => `  - "${p}"`)
    ]
      .filter(Boolean)
      .join("\n")
  ),
  "",
  "---",
  "",
  "## Developmental Science, Virtue & STEAM Concordance",
  ...DEVELOPMENTAL_AND_VIRTUE_CONCORDANCE.map(
    (c) =>
      `### ${c.term} — ${c.title} (${c.ageRelevance})\n${c.scientificAndPedagogicalExplanation}\nReference: ${c.canonicalEssayUrl}`
  ),
  "",
  "---",
  "",
  "## Official Socratic Reading & Unit Study Playbooks",
  ...SOCRATIC_PLAYBOOK_GUIDES.map((g) => g.bodyMarkdown)
].join("\n\n");

fs.writeFileSync(path.join(root, "llms.txt"), llmsShort.replace("${books.length}", String(books.length)) + "\n", "utf-8");
fs.mkdirSync(path.join(root, ".well-known"), { recursive: true });
fs.writeFileSync(
  path.join(root, ".well-known", "llms.txt"),
  llmsShort.replace("${books.length}", String(books.length)) + "\n",
  "utf-8"
);
fs.writeFileSync(
  path.join(root, "llms-full.txt"),
  llmsFull.replace("${books.length}", String(books.length)) + "\n",
  "utf-8"
);

const openapiYaml = `openapi: 3.1.0
info:
  title: Human Edge Press Catalog & Developmental Research API
  version: ${pkg.version}
  description: >
    Public read-only endpoints for discovering Human Edge Press's 100% screen-free
    children's books (ages 0-8), Socratic homeschooling guides, and developmental
    neuroscience resources on https://humanedgepress.com.
servers:
  - url: https://humanedgepress.com
    description: Canonical Human Edge Press Shopify Storefront
paths:
  /products.json:
    get:
      operationId: listHumanEdgeBooks
      summary: List all active Human Edge Press books, workbooks, and gift box sets
      parameters:
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            default: 250
      responses:
        "200":
          description: JSON array of published Shopify book products and variant IDs
  /collections.json:
    get:
      operationId: listHumanEdgeCollections
      summary: List published Human Edge Press book collections
      responses:
        "200":
          description: JSON array of Shopify collections
  /blogs/news/articles.json:
    get:
      operationId: listHumanEdgeBlogArticles
      summary: List published Human Edge Press blog articles and research essays
      responses:
        "200":
          description: JSON array of published Shopify blog articles
`;

fs.writeFileSync(path.join(root, "openapi.yaml"), openapiYaml, "utf-8");
console.log("[Discovery] Wrote llms.txt, .well-known/llms.txt, llms-full.txt, and openapi.yaml.");
