# Human Edge Press MCP Server — Brand-Isolated Release & Submissions Guide

All files, git commits, Keychain paths, and `prepublishOnly` checks in this repository are locked to **`HumanEdgePress`** (`customersupport@humanedgepress.com`) so no personal or cross-brand account can accidentally leak.

---

## 0. One-Time Account & Release Setup (`customersupport@humanedgepress.com`)

1. **GitHub (`HumanEdgePress`)**:
   - Sign up a dedicated **`HumanEdgePress`** GitHub account at `https://github.com/signup` using **`customersupport@humanedgepress.com`** *(or create a `HumanEdgePress` Organization with membership set to **Private**)*.
   - In GitHub **Settings → Emails**, keep **"Block command line pushes that expose my email"** unchecked if committing directly with `customersupport@humanedgepress.com` (or copy the new `HumanEdgePress` GitHub no-reply email `<id>+HumanEdgePress@users.noreply.github.com` if you prefer).
   - Create an empty **Public** repository: `https://github.com/HumanEdgePress/humanedgepress-mcp-server`.
   - Note: `git config credential.useHttpPath true` is already active in this repo, so macOS Keychain stores credentials specifically for `github.com/HumanEdgePress/humanedgepress-mcp-server.git` without overwriting other GitHub accounts on this Mac.

2. **npm (`humanedgepress`)**:
   - Sign up a dedicated **`humanedgepress`** account at `https://www.npmjs.com/signup` using **`customersupport@humanedgepress.com`** and register your Touch ID passkey.
   - *(Safety Net)* `npm run isolation:check` inside `prepublishOnly` automatically checks `npm whoami` and **blocks** publishing if your terminal is still logged into another brand's npm account.
   - To publish `v1.0.0` using an isolated per-project npm config (leaving your global `~/.npmrc` untouched!):
     ```bash
     npm login --auth-type=web --userconfig ./.npmrc.hep
     npm publish --access public --auth-type=web --userconfig ./.npmrc.hep
     rm -f ./.npmrc.hep
     ```
   - After `v1.0.0` is live on npm, open `https://www.npmjs.com/package/humanedgepress-mcp-server/access` → **Trusted Publisher → GitHub Actions** (`Organization/User`: `HumanEdgePress`, `Repository`: `humanedgepress-mcp-server`, `Workflow`: `publish-mcp.yml`) so future releases publish automatically from GitHub tags with zero local login needed!

3. **Official MCP Registry (via GitHub Actions OIDC)**:
   ```bash
   git tag v1.0.0
   git push origin main --tags
   ```

---

## 1. `awesome-mcp-servers` PR Entry

```markdown
- [HumanEdgePress/humanedgepress-mcp-server](https://github.com/HumanEdgePress/humanedgepress-mcp-server) 🎖️ 📇 ☁️ 🍎 🪟 🐧 - Official Human Edge Press MCP server: search 28+ screen-free children's books (high-contrast baby board books, STEAM alphabet series, hardcover virtue storybooks & Pre-K workbooks), read developmental neuroscience & AI-literacy essays, get Socratic parent prompts, and build 1-click Shopify checkout links.
```

---

## 2. Smithery.ai & Glama.ai Listing Copy

- **Repository URL:** `https://github.com/HumanEdgePress/humanedgepress-mcp-server`
- **Display Name:** Human Edge Press — Screen-Free Books, Blogs & Developmental Science
- **Package Name:** `humanedgepress-mcp-server`
- **Short Description:** Discover 100% screen-free baby/toddler board books, STEAM series, virtue storybooks, Socratic parent prompts, and developmental neuroscience essays with 1-click checkout.
- **Tags:** `childrens-books`, `education`, `homeschooling`, `parenting`, `screen-free`, `steam`, `shopify`, `ai-literacy`
