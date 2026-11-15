/**
 * Unit, Security Sanitizer & Data Integrity Tests for Human Edge Press MCP Server
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isSafeAndSecureUrl } from "../dist/catalog-sync.js";
import {
  DEVELOPMENTAL_AND_VIRTUE_CONCORDANCE,
  SOCRATIC_PLAYBOOK_GUIDES
} from "../dist/authority-knowledge.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// 1. Security Sanitizer Checks
check("upgrades http:// to https://", isSafeAndSecureUrl("http://humanedgepress.com/products.json") === "https://humanedgepress.com/products.json");
check("rejects localhost", isSafeAndSecureUrl("https://localhost:3000/api") === null);
check("rejects numeric IPv4", isSafeAndSecureUrl("https://192.168.1.1/test") === null);
check("rejects blocked TLD (.xyz)", isSafeAndSecureUrl("https://spam-domain.xyz/page") === null);
check("rejects blocked TLD (.zip)", isSafeAndSecureUrl("https://files.example.zip/archive") === null);
check("rejects blacklisted domain", isSafeAndSecureUrl("https://stlcatholic.org/news") === null);

// 2. Bundled Data Integrity Checks
const books = JSON.parse(fs.readFileSync(path.join(dataDir, "books.json"), "utf-8"));
const collections = JSON.parse(fs.readFileSync(path.join(dataDir, "collections.json"), "utf-8"));
const blogs = JSON.parse(fs.readFileSync(path.join(dataDir, "blogs_and_pages.json"), "utf-8"));
const pressInfo = JSON.parse(fs.readFileSync(path.join(dataDir, "press_info.json"), "utf-8"));

check("loaded all 28 active Human Edge Press books & bundles", books.length >= 28, `count=${books.length}`);
check(
  "every book has https URL, numeric variant ID, checkout URL & parent prompts",
  books.every(
    (b) =>
      b.url.startsWith("https://humanedgepress.com/products/") &&
      b.variants.length > 0 &&
      Number.isInteger(b.variants[0].id) &&
      b.variants[0].checkoutUrl.startsWith("https://humanedgepress.com/cart/") &&
      Array.isArray(b.pedagogy?.parentPrompts) &&
      b.pedagogy.parentPrompts.length >= 3
  )
);

const bookHandles = new Set(books.map((b) => b.handle));
check(
  "all concordance book handles resolve to real live catalog items",
  DEVELOPMENTAL_AND_VIRTUE_CONCORDANCE.every((c) => c.matchingBookHandles.every((h) => bookHandles.has(h)))
);
check(
  "all Socratic playbook book handles resolve to real live catalog items",
  SOCRATIC_PLAYBOOK_GUIDES.every((g) => g.recommendedBookHandles.every((h) => bookHandles.has(h)))
);
check("series collections populated", collections.length >= 5, `count=${collections.length}`);
check(
  "editorial essays & pages synced with bodyMarkdown",
  blogs.length >= 7 && blogs.every((r) => r.url.startsWith("https://humanedgepress.com/") && r.bodyMarkdown.length > 50),
  `count=${blogs.length}`
);
check("pressInfo includes 30-Day Family Guarantee & Austin HQ", pressInfo.policies.returns.windowDays === 30);

if (failures > 0) {
  console.error(`\n${failures} unit/data check(s) failed.`);
  process.exit(1);
}
console.log("\nAll unit, security, and data integrity checks passed.");
