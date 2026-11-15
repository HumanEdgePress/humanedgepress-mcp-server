# Agent Instructions — Human Edge Press MCP Repository

This repository implements `humanedgepress-mcp-server`, the official Model Context Protocol server and developmental authority engine for [HumanEdgePress.com](https://humanedgepress.com).

## Core Commands
- `npm run build` — Compile TypeScript (`src/` → `dist/`).
- `npm run sync:all` — Sync live products, collections, blogs (`/blogs/*`), and editorial pages (`/pages/*`) from `https://humanedgepress.com`, regenerate `.well-known/mcp/server-card.json`, `llms.txt`, `llms-full.txt`, `openapi.yaml`, the 6-article Shopify Blog Content Kit (`content/articles/`), and `reports/catalog-ai-audit.md`.
- `npm test` — Run unit, security sanitizer (`isSafeAndSecureUrl`), data integrity, and MCP `stdio` + `http` protocol smoke tests.
- `npm run audit:deps` — Run `npm audit --omit=dev --audit-level=high` (must pass with 0 high/critical findings before any publish).

## Security & Operational Guardrails
1. **Zero API Keys / $0 Cost**: Never add external LLM or paid cloud dependencies.
2. **Safe Network Fetching**: Outbound sync requests must pass `isSafeAndSecureUrl()`, enforce `https://`, lock hostnames strictly to `humanedgepress.com` / `www.humanedgepress.com`, set `AbortSignal.timeout(5000)`, block redirects, and verify `Content-Type`.
3. **Git Privacy & Brand Isolation**: Always commit as `Human Edge Press <customersupport@humanedgepress.com>` (enforced automatically by repo-local `pre-commit` & `pre-push` hooks and `npm run isolation:check`). Never expose personal handles, personal Gmail, or cross-brand accounts.
