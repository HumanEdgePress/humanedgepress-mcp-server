import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchLiveCatalog, isSafeAndSecureUrl } from "../dist/catalog-sync.js";
import { fetchLiveBlogsAndPages } from "../dist/blog-sync.js";
import { DEFAULT_FAQS } from "../dist/authority-knowledge.js";

export { isSafeAndSecureUrl };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");

export async function sync() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const snapshot = await fetchLiveCatalog({
    storeUrl: "https://humanedgepress.com",
    onProgress: (msg) => console.log(msg)
  });

  const blogsAndPages = await fetchLiveBlogsAndPages({
    storeUrl: "https://humanedgepress.com",
    onProgress: (msg) => console.log(msg)
  });

  fs.writeFileSync(path.join(dataDir, "books.json"), JSON.stringify(snapshot.books, null, 2) + "\n", "utf-8");
  fs.writeFileSync(
    path.join(dataDir, "studio_lines.json"),
    JSON.stringify(snapshot.studioLines, null, 2) + "\n",
    "utf-8"
  );
  fs.writeFileSync(
    path.join(dataDir, "collections.json"),
    JSON.stringify(snapshot.collections, null, 2) + "\n",
    "utf-8"
  );
  fs.writeFileSync(
    path.join(dataDir, "blogs_and_pages.json"),
    JSON.stringify(blogsAndPages, null, 2) + "\n",
    "utf-8"
  );
  fs.writeFileSync(
    path.join(dataDir, "press_info.json"),
    JSON.stringify(snapshot.pressInfo, null, 2) + "\n",
    "utf-8"
  );
  fs.writeFileSync(path.join(dataDir, "faqs.json"), JSON.stringify(DEFAULT_FAQS, null, 2) + "\n", "utf-8");

  console.log(`[Sync] Saved ${snapshot.books.length} active books/bundles to data/books.json`);
  console.log(`[Sync] Saved ${snapshot.studioLines.length} studio preview lines to data/studio_lines.json`);
  console.log(`[Sync] Saved ${snapshot.collections.length} series collections to data/collections.json`);
  console.log(`[Sync] Saved ${blogsAndPages.length} blogs & authority essays to data/blogs_and_pages.json`);
  console.log(`[Sync] Saved publisher info & ${DEFAULT_FAQS.length} FAQs to data/press_info.json & data/faqs.json`);
  console.log("[Sync] Data sync complete!");
  return { snapshot, blogsAndPages };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isMain) {
  sync().catch((err) => {
    console.error("[Sync] Error during sync:", err);
    process.exit(1);
  });
}
