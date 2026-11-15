// End-to-end MCP protocol smoke test against the built server over BOTH stdio and Streamable HTTP.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [join(root, "dist", "index.js")],
  env: { ...process.env, HUMANEDGEPRESS_LIVE_SYNC: "false", HUMANEDGEPRESS_DISABLE_LOGS: "true" },
  stderr: "ignore"
});
const client = new Client({ name: "smoke-test", version: "1.0.0" });

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};
const textOf = (r) => r.content?.[0]?.text ?? "";

await client.connect(transport);

const info = client.getServerVersion();
check(
  "server identity",
  info?.name === "humanedgepress-store-search" && Boolean(info?.version),
  `${info?.title} v${info?.version}`
);
check("server instructions present", (client.getInstructions() || "").includes("Human Edge Press"));

const { tools } = await client.listTools();
const names = tools.map((t) => t.name);
check("all 15 tools registered", tools.length === 15, names.join(", "));
check("all tools annotated read-only", tools.every((t) => t.annotations?.readOnlyHint === true));
check("connector search/fetch tools present", names.includes("search") && names.includes("fetch"));
check(
  "blog & authority tools present",
  names.includes("search_blogs_and_essays") &&
    names.includes("read_blog_or_essay") &&
    names.includes("explore_developmental_science_and_virtues")
);

const { resources } = await client.listResources();
check("all 7 resources registered", resources.length === 7);
check(
  "blogs & concordance resources present",
  resources.some((r) => r.uri === "humanedgepress://content/blogs-and-essays") &&
    resources.some((r) => r.uri === "humanedgepress://knowledge/developmental-concordance")
);

const { prompts } = await client.listPrompts();
check("all 6 prompts registered", prompts.length === 6);

// Tool behavioral checks
const newbornSearch = await client.callTool({
  name: "search_human_edge_books",
  arguments: { query: "high contrast newborn baby faces", ageStage: "0-2" }
});
check("newborn book search returns Baby Faces", /Baby Faces/i.test(textOf(newbornSearch)));

const virtueDetail = await client.callTool({
  name: "get_book_details_and_parent_prompts",
  arguments: { bookHandleOrTitle: "human-edge-kind" }
});
check(
  "book detail includes character duo & Socratic parent prompts",
  /Caleb & Retriever/i.test(textOf(virtueDetail)) && /Socratic Conversation Prompts/i.test(textOf(virtueDetail))
);

const blogSearch = await client.callTool({
  name: "search_blogs_and_essays",
  arguments: { query: "the human veto AI young adults" }
});
check("blog search finds 'The Human Veto' essay", /Human Veto/i.test(textOf(blogSearch)));

const blogRead = await client.callTool({
  name: "read_blog_or_essay",
  arguments: { slugOrId: "teen-social-media" }
});
check("read_blog_or_essay returns full teen cortical thickness essay", /Cortical Thickness/i.test(textOf(blogRead)));

const concordance = await client.callTool({
  name: "explore_developmental_science_and_virtues",
  arguments: { query: "gives up easily frustration" }
});
check("concordance maps frustration to Persistent (Theo & Beaver)", /Theo & Beaver/i.test(textOf(concordance)));

const playbook = await client.callTool({
  name: "get_socratic_reading_and_unit_study_guide",
  arguments: { topic: "screen-free-steam-at-home" }
});
check("playbook returns 5-day kitchen-table STEAM unit study", /5-Day Screen-Free Kitchen-Table STEAM/i.test(textOf(playbook)));

const gift = await client.callTool({
  name: "recommend_books_and_bundles",
  arguments: { childAge: "newborn", occasion: "Baby Shower", maxBudget: 70 }
});
check("gift recommender suggests Newborn Sensory Starter bundle", /Newborn Sensory Starter/i.test(textOf(gift)));

// ChatGPT Connector search + fetch check across BOTH books and essays
const sBook = JSON.parse(textOf(await client.callTool({ name: "search", arguments: { query: "S is for Science" } })));
check(
  "connector search returns {id, title, url}",
  Array.isArray(sBook.results) && sBook.results.length > 0 && sBook.results.every((r) => r.id && r.title && r.url)
);

const fetchedBook = JSON.parse(
  textOf(await client.callTool({ name: "fetch", arguments: { id: "book:s-is-for-science-steam-alphabet-board-book" } }))
);
check("connector fetch book returns checkout metadata", Boolean(fetchedBook.metadata?.checkoutUrl), fetchedBook.title);

const fetchedEssay = JSON.parse(
  textOf(await client.callTool({ name: "fetch", arguments: { id: "page:socratic-homeschooling" } }))
);
check("connector fetch essay returns full editorial text", fetchedEssay.text.length > 200, fetchedEssay.title);

// Checkout permalink security validation
const badCart = await client.callTool({
  name: "generate_direct_checkout_link",
  arguments: { items: [{ variantId: "123/../../evil", quantity: 1 }] }
});
check("checkout rejects path-traversal variant IDs", /Invalid item/i.test(textOf(badCart)));

const goodCart = await client.callTool({
  name: "generate_direct_checkout_link",
  arguments: { items: [{ variantId: fetchedBook.metadata.variantId, quantity: 2 }] }
});
check("checkout builds valid humanedgepress.com cart permalink", /https:\/\/humanedgepress\.com\/cart\/\d+:2\?/.test(textOf(goodCart)));

await client.close();

// Quick HTTP transport health check on random high port
const testPort = 39481;
const httpProc = spawn(process.execPath, [join(root, "dist", "index.js"), "--http", "--port", String(testPort)], {
  env: { ...process.env, HUMANEDGEPRESS_LIVE_SYNC: "false", HUMANEDGEPRESS_DISABLE_LOGS: "true" },
  stdio: "ignore"
});

try {
  let healthRes;
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      healthRes = await fetch(`http://127.0.0.1:${testPort}/health`, { signal: AbortSignal.timeout(1000) });
      if (healthRes.ok) break;
    } catch {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  if (!healthRes) {
    throw new Error(`HTTP server on port ${testPort} did not become ready within 5s`);
  }
  const healthJson = await healthRes.json();
  check(
    "HTTP /health endpoint serves book & blog counts",
    healthJson.status === "ok" && healthJson.booksCount >= 28 && healthJson.blogsAndEssaysCount >= 7
  );
} finally {
  httpProc.kill("SIGTERM");
}

console.log(failures ? `\n${failures} check(s) failed` : "\nAll MCP stdio & HTTP protocol checks passed.");
process.exit(failures ? 1 : 0);
