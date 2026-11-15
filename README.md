# 🌱 Human Edge Press MCP Server: Screen-Free Children's Books, Blogs & Developmental Science

[![MCP Server](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue.svg)](https://modelcontextprotocol.io)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-io.github.HumanEdgePress%2Fhumanedgepress--mcp--server-black.svg)](https://registry.modelcontextprotocol.io)
[![npm version](https://img.shields.io/npm/v/humanedgepress-mcp-server.svg?color=green)](https://www.npmjs.com/package/humanedgepress-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The official **screen-free children's book, Socratic homeschooling & developmental neuroscience MCP server** from [HumanEdgePress.com](https://humanedgepress.com) for Claude, ChatGPT, Gemini, Perplexity, Cursor, Windsurf, VS Code, and Antigravity.

Search **28+ live-synced physical books, workbooks & box sets** (High-Contrast Baby Board Books for ages 0–2, Ethan Finch's STEAM Alphabet Board Books for ages 2–4, Pre-K Workbooks for ages 3–5, and The Human Edge Hardcover Virtue Series for ages 3–7), read **long-form research & blog essays** (*Transfer Deficit*, *Serve & Return*, *The Cortical Thickness Crisis*, *The Human Veto*), unlock **Socratic parent conversation prompts**, and generate **1-click Shopify checkout links**.

No API key. Runs locally. Free.

---

## 💬 Try asking your assistant

- *"What are the best high-contrast black-and-white books for a newborn's visual development?"*
- *"My 4-year-old gets frustrated and gives up easily when building blocks—what storybook and conversation prompts help?"*
- *"Build a 5-day screen-free kitchen-table STEAM unit study for my 3-year-old."*
- *"What does pediatric neuroscience say about toddler educational apps and the Transfer Deficit?"*
- *"What is 'The Human Veto' for raising teens and young adults in the age of AI?"*
- *"Recommend a screen-free baby shower book gift under $65 with 1-click checkout."*

---

## 🚀 Install

### Claude Desktop · Cursor · Windsurf · VS Code · Antigravity
Add to your MCP config (`claude_desktop_config.json`, `.cursor/mcp.json`, `~/.codeium/windsurf/mcp_config.json`, `.vscode/mcp.json`, or `~/.gemini/antigravity/mcp_config.json`):

```json
{
  "mcpServers": {
    "humanedgepress": {
      "command": "npx",
      "args": ["-y", "humanedgepress-mcp-server@latest"]
    }
  }
}
```

### Claude Code
```bash
claude mcp add humanedgepress -- npx -y humanedgepress-mcp-server@latest
```

### Self-hosted HTTP (Streamable HTTP + SSE)
```bash
npx -y humanedgepress-mcp-server@latest --http --port 3000
# MCP: http://127.0.0.1:3000/mcp · SSE: /sse · health: /health · local advisor: /chat?q=newborn
```

### Live cart & Shop Pay checkout: Shopify's hosted UCP endpoint
`humanedgepress.com` also runs Shopify's native **Universal Commerce Protocol (UCP)** MCP endpoint:
`https://humanedgepress.com/api/ucp/mcp` (discovery: `https://humanedgepress.com/.well-known/ucp`). This server complements it with Socratic parent prompts, blog & research essays, developmental science concordance, and gift curation.

---

## 🛠️ Tools (15 Read-Only Tools)

| Tool | What it does |
|---|---|
| `search_human_edge_books` | Search 28+ live-synced screen-free books, Pre-K workbooks & gift bundles by keyword, age stage (`0-2`, `2-4`, `3-5`, `3-7`), series, virtue/skill, format, or price |
| `get_book_details_and_parent_prompts` | Full book synopsis, child-and-animal duo, **3 built-in Socratic conversation prompts for parents**, craft specs & 1-click checkout |
| `search_blogs_and_essays` | Search live-synced Shopify blog posts (`/blogs/*`), foundational essays (`/pages/*`), and Socratic guides |
| `read_blog_or_essay` | Read the full clean Markdown text, takeaways, and paired books for any blog article or editorial essay |
| `explore_developmental_science_and_virtues` | **Developmental Science, Virtue & STEAM Concordance:** lookup neuroscience concepts (*Transfer Deficit*, *Serve & Return*, *Cortical Thickness*, *The Human Veto*), 5 STEAM pillars, & 12 virtues |
| `get_socratic_reading_and_unit_study_guide` | **Parent & Homeschool Playbooks:** *Analog Roots 0–7*, *Socratic Read-Aloud Method*, *Newborn High-Contrast Routine*, *5-Day Kitchen STEAM*, *Teen Focus Rules*, & *Human Veto AI Guide* |
| `recommend_books_and_bundles` | Personalized gift & curriculum recommender by child age, occasion, learning goal, and budget |
| `list_book_series_and_collections` | Browse all book series, gift boxes, and upcoming *In the Studio* lines (*Oddlings*, *First Think First Words*, *Human Edge Stories*) |
| `get_series_books` | List every book inside a specific series or stage collection |
| `get_age_and_stage_reading_roadmap` | Birth-to-Age-8 developmental roadmap mapping visual, motor, STEAM & character milestones to formats |
| `generate_direct_checkout_link` | Validated 1-click Shopify cart permalink (`https://humanedgepress.com/cart/{variantId}:{qty}`) |
| `answer_publisher_and_parent_faqs` | Official FAQ: shipping, 30-Day Family Guarantee ($0 free prepaid return label), school/co-op bulk orders |
| `get_press_mission_and_editorial_stance` | Publisher manifesto (*"Analog Roots First, Digital Wings Later"*) and 5 Core Beliefs |
| `search` / `fetch` | ChatGPT Connectors & OpenAI Deep Research unified search + fetch across books, blogs, guides, and neuroscience concepts |

**Prompts:** `age-and-stage-book-advisor`, `socratic-read-aloud-coach`, `screen-free-homeschool-unit-builder`, `parenting-challenge-book-match`, `screen-time-and-ai-research-brief`, `gift-and-bundle-curator`

**Resources:** `humanedgepress://catalog/books`, `humanedgepress://catalog/series`, `humanedgepress://content/blogs-and-essays`, `humanedgepress://knowledge/developmental-concordance`, `humanedgepress://guides/socratic-playbooks`, `humanedgepress://press/manifesto-and-policies`, `humanedgepress://knowledge/geo-entity-summary`

---

## 🧑‍💻 Development & Sync

```bash
npm install
npm run sync:all        # sync live books + blogs/pages from humanedgepress.com & rebuild all discovery/audit/blog kits
npm test                # unit + security sanitizer + data checks + MCP stdio & HTTP smoke test
npm run audit:deps      # production dependency vulnerability audit (enforced in prepublishOnly)
```

## 📜 License

MIT © 2026 [Human Edge Press](https://humanedgepress.com)
