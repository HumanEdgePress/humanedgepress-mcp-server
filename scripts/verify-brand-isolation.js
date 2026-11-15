/**
 * Brand-Isolation & Anonymity Verifier for Human Edge Press MCP Server
 *
 * Runs automatically in `npm test` and `prepublishOnly`:
 *  1. Scans all repository files (excluding node_modules & .git) for zero personal or cross-brand leaks.
 *  2. Verifies git commit history contains ONLY Human Edge Press brand identities.
 *  3. During `npm publish`, verifies the active npm user is NOT a personal or cross-brand npm account.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

const forbiddenTokens = [
  ["neks", "jones"].join(""),
  ["armorn", "glory"].join(""),
  ["kobe", "church"].join(""),
  ["@gmail", ".com"].join(""),
  ["@googlemail", ".com"].join("")
];

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} [Isolation] ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

function walkFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const allFiles = walkFiles(root);
const leakingFiles = [];

for (const file of allFiles) {
  // Skip binary files if any
  const rel = path.relative(root, file);
  if (rel === ".git/hooks/pre-commit" || rel === ".git/hooks/pre-push") continue;
  const content = fs.readFileSync(file, "utf-8");
  const lower = content.toLowerCase();
  for (const tok of forbiddenTokens) {
    if (lower.includes(tok)) {
      leakingFiles.push(`${rel} (matched '${tok}')`);
    }
  }
}

check("zero personal or cross-brand strings across all workspace files", leakingFiles.length === 0, leakingFiles.join(", "));

// Verify git history if .git exists
if (fs.existsSync(path.join(root, ".git"))) {
  try {
    const logOut = execFileSync("git", ["log", "--all", "--format=%h %an <%ae> | %cn <%ce>"], {
      cwd: root,
      encoding: "utf-8"
    }).trim();
    const badLines = logOut
      .split("\n")
      .filter(Boolean)
      .filter((line) => forbiddenTokens.some((t) => line.toLowerCase().includes(t)));
    check(
      "git commit history uses only Human Edge Press brand identity",
      badLines.length === 0,
      badLines.length > 0 ? badLines.join("; ") : logOut.split("\n")[0] || "clean"
    );
  } catch {
    // No commits yet
  }
}

// During `npm publish`, block accidental publish from non-HumanEdgePress npm session
if (process.env.npm_command === "publish" && process.env.GITHUB_ACTIONS !== "true") {
  let whoami = "";
  try {
    whoami = execFileSync("npm", ["whoami"], { cwd: root, encoding: "utf-8" }).trim();
  } catch {
    check(
      "npm session authenticated",
      false,
      "Not logged into npm. Log into your dedicated 'humanedgepress' npm account (customersupport@humanedgepress.com) via 'npm login --auth-type=web'."
    );
  }
  if (whoami) {
    const blockedNpm = forbiddenTokens.some((t) => whoami.toLowerCase().includes(t));
    check(
      "active npm account is isolated to Human Edge Press",
      !blockedNpm,
      blockedNpm
        ? `Logged in as '${whoami}' — BLOCKED to prevent cross-brand linking! Sign into your Human Edge Press npm account (customersupport@humanedgepress.com) first.`
        : `logged in as '${whoami}'`
    );
  }
}

if (failures > 0) {
  console.error(`\n[Isolation] ${failures} brand-isolation check(s) failed.`);
  process.exit(1);
}
