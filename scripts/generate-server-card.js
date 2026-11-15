// Regenerates .well-known/mcp/server-card.json from the built server's real tools/prompts/resources,
// so directory listings (Smithery, Glama, PulseMCP, etc.) never drift from what the server actually exposes.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const books = JSON.parse(readFileSync(join(root, "data", "books.json"), "utf-8"));
const blogs = JSON.parse(readFileSync(join(root, "data", "blogs_and_pages.json"), "utf-8"));

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [join(root, "dist", "index.js")],
  env: { ...process.env, HUMANEDGEPRESS_LIVE_SYNC: "false", HUMANEDGEPRESS_DISABLE_LOGS: "true" },
  stderr: "ignore"
});
const client = new Client({ name: "server-card-generator", version: "1.0.0" });
await client.connect(transport);

const info = client.getServerVersion();
const [{ tools }, { prompts }, { resources }] = await Promise.all([
  client.listTools(),
  client.listPrompts(),
  client.listResources()
]);

const cardDir = join(root, ".well-known", "mcp");
mkdirSync(cardDir, { recursive: true });

const card = {
  $schema: "https://modelcontextprotocol.io/schema/server-card.json",
  serverInfo: {
    name: info.name,
    title: info.title,
    version: info.version,
    websiteUrl: info.websiteUrl,
    description:
      `Official Human Edge Press MCP server & developmental knowledge base (${books.length} live-synced 100% screen-free books & bundles + ${blogs.length} research essays): ` +
      "High-Contrast Baby Board Books (ages 0–2), Ethan Finch's STEAM Alphabet Series (ages 2–4), Pre-K Workbooks (ages 3–5), The Human Edge Hardcover Virtue Series (ages 3–7), " +
      "Socratic parent conversation prompts, screen-time neuroscience ('Transfer Deficit', 'Serve & Return', 'Cortical Thickness Crisis'), young adult AI literacy ('The Human Veto'), and 1-click Shopify checkout."
  },
  instructions: client.getInstructions(),
  authentication: { required: false },
  install: { command: "npx", args: ["-y", "humanedgepress-mcp-server@latest"] },
  tools: tools.map(({ name, title, description, inputSchema, annotations }) => ({
    name,
    title,
    description,
    inputSchema,
    annotations
  })),
  prompts: prompts.map(({ name, description, arguments: args }) => ({ name, description, arguments: args })),
  resources: resources.map(({ name, uri, description, mimeType }) => ({ name, uri, description, mimeType }))
};

writeFileSync(join(cardDir, "server-card.json"), JSON.stringify(card, null, 2) + "\n", "utf-8");
await client.close();
console.log(
  `[server-card] Wrote ${tools.length} tools, ${prompts.length} prompts, ${resources.length} resources (v${info.version}).`
);
