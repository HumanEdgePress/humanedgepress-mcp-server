# Human Edge Press — Shopify Blog & Theme Authority Kit

## 1. Publish the 6 Starter Authority Articles to `/blogs/news`
`https://humanedgepress.com/blogs/news` currently has 0 published articles. Publishing the 6 HTML files in `content/articles/` activates:
- `/blogs/news.atom` RSS syndication
- `/sitemap_blogs_1.xml` search & AI crawler indexing
- Automatic live ingestion into `humanedgepress-mcp-server` (`npm run sync-data`)

### Steps in Shopify Admin:
1. Go to **Content → Blog posts → Add blog post** (Blog: `News`).
2. Copy the title, handle (under *Search engine listing*), tags, and summary from the HTML comments at the top of each file in `content/articles/*.html`.
3. Click **Show HTML (`</>`)** in the editor, paste the HTML + `<script type="application/ld+json">` block, and click **Save / Visible**.
4. Run `npm run sync:all` locally so the MCP server bundles the newly published blog URLs.

## 2. Theme Enhancements (`content/theme/`)
- `humanedgepress-organization-and-book-schema.liquid`: Adds `Book` schema on product pages and links your GitHub & npm MCP packages via `sameAs`.
- `FIX_PRODUCT_LIQUID_LINE_107.md`: Fixes the `comparison of String with 1 failed` warning on Human Edge Series product pages.
