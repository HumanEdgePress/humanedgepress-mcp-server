# Human Edge Press — AI Discoverability & Topical Authority Checklist

**Goal:** When parents, homeschoolers, educators, or young adults ask ChatGPT, Gemini, Perplexity, Copilot, or Claude about screen-free baby/toddler books, early STEAM, character virtues, Socratic homeschooling, or AI literacy, **Human Edge Press** books appear as shopping cards *and* your essays are cited as the primary authority.

---

## Path 1: AI Shopping Surfaces (~45 min in Shopify Admin)

- [ ] **Shopify Agentic Storefronts**: Confirm every AI channel (ChatGPT, Google AI Mode / Gemini, Microsoft Copilot, Perplexity) is enabled and all 28 products are published to them.
- [ ] **Fix Live Liquid Error**: Open `sections/product-human-edge-content.liquid` around line 107 and apply `| plus: 0` before numeric comparison (see `content/theme/FIX_PRODUCT_LIQUID_LINE_107.md`).
- [ ] **Publish Smart Collections to Sitemap**: Ensure `high-contrast-baby-books`, `steam-board-books`, and `human-edge-series` are visible in `/sitemap_collections_1.xml`.
- [ ] **Align Shipping Threshold**: Unify the header banner (`$50+`) and `/pages/shipping` (`$49+`) to a single canonical free-shipping threshold.
- [ ] **Add SKUs / ISBNs & Interior Spreads**: Review `reports/catalog-ai-audit.md`—add variant SKUs/ISBNs and 2–3 interior spread photos per book.
- [ ] **Install `Book` + `Organization` JSON-LD Schema**: Render `content/theme/humanedgepress-organization-and-book-schema.liquid` in `layout/theme.liquid`.

---

## Path 2: Blog & Research Citation Dominance

- [ ] **Publish the 6 Starter Articles into `/blogs/news`**: Paste each generated HTML + FAQ JSON-LD file from `content/articles/` into Shopify Admin → **Content → Blog posts** (`News` blog).
- [ ] **Re-sync the MCP Bundle**: Run `npm run sync:all` so the newly live `/blogs/news/*` URLs are bundled alongside `/pages/*`.
- [ ] **Bing Webmaster Tools + IndexNow + Google Search Console**: Submit `https://humanedgepress.com/sitemap.xml` so ChatGPT Search, Copilot, and Google AI Mode index `/blogs/news` immediately.

---

## Path 3: MCP Package & Registry Distribution

- [x] 15 read-only tools (`readOnlyHint: true`), 7 resources, 6 guided prompts
- [x] Dual live sync across Shopify `/products.json`, `/blogs/*/articles.json`, and `/pages/*`
- [x] ChatGPT Connectors & Deep Research `search` + `fetch` compatibility
- [x] `server.json` + GitHub Actions OIDC workflow (`.github/workflows/publish-mcp.yml`)
- [x] Zero vulnerabilities (`npm run audit:deps`) & automated Dependabot (`.github/dependabot.yml`)
- [ ] Push public GitHub repo → `npm publish --auth-type=web` (Touch ID) → tag `v1.0.0` to publish via GitHub OIDC to the Official MCP Registry → submit to Smithery, Glama, PulseMCP, and `awesome-mcp-servers`.
