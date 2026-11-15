/**
 * Installs repo-local git pre-commit & pre-push brand-isolation hooks
 * and configures isolated repo git identity + per-repo Keychain path isolation.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const gitDir = path.join(root, ".git");

if (!fs.existsSync(gitDir)) {
  process.exit(0);
}

const hooksDir = path.join(gitDir, "hooks");
fs.mkdirSync(hooksDir, { recursive: true });

// Assemble forbidden cross-brand fragments dynamically so this file itself stays clean in raw text searches
const f1 = ["neks", "jones"].join("");
const f2 = ["armorn", "glory"].join("");
const f3 = ["kobe", "church"].join("");
const f4 = ["@(gmail|googlemail)", "\\.com"].join("");

const preCommitScript = `#!/bin/sh
# Repo-local Brand Isolation Guard for Human Edge Press
ALLOWED_BRAND_EMAIL="customersupport@humanedgepress.com"
AUTHOR_IDENT="$(git var GIT_AUTHOR_IDENT 2>/dev/null)"
COMMITTER_IDENT="$(git var GIT_COMMITTER_IDENT 2>/dev/null)"

case "$AUTHOR_IDENT" in
  *"<$ALLOWED_BRAND_EMAIL>"*|*"humanedgepress@users.noreply.github.com>"*) ;;
  *)
    echo "[hep-isolation-guard] BLOCKED COMMIT: Author email in Human_Edge_Press_MCP must be <$ALLOWED_BRAND_EMAIL>." >&2
    echo "  Got: $AUTHOR_IDENT" >&2
    exit 1
    ;;
esac

case "$COMMITTER_IDENT" in
  *"<$ALLOWED_BRAND_EMAIL>"*|*"humanedgepress@users.noreply.github.com>"*) ;;
  *)
    echo "[hep-isolation-guard] BLOCKED COMMIT: Committer email in Human_Edge_Press_MCP must be <$ALLOWED_BRAND_EMAIL>." >&2
    echo "  Got: $COMMITTER_IDENT" >&2
    exit 1
    ;;
esac

FORBIDDEN_REGEX="(${f1}|${f2}|${f3}|${f4})"
STAGED_FILES="$(git diff --cached --name-only --diff-filter=ACMR)"
if [ -n "$STAGED_FILES" ]; then
  LEAKS="$(echo "$STAGED_FILES" | xargs grep -IinE "$FORBIDDEN_REGEX" 2>/dev/null || true)"
  if [ -n "$LEAKS" ]; then
    echo "[hep-isolation-guard] BLOCKED COMMIT: Cross-brand or personal identifier found in staged files:" >&2
    echo "$LEAKS" >&2
    exit 1
  fi
fi
exit 0
`;

const prePushScript = `#!/bin/sh
# Repo-local Push Guard: verify entire commit history is 100% isolated to Human Edge Press
FORBIDDEN_REGEX="(${f1}|${f2}|${f3}|${f4})"
BAD_COMMITS="$(git log --all --format="%h %an <%ae> | %cn <%ce>" | grep -iE "$FORBIDDEN_REGEX" || true)"
if [ -n "$BAD_COMMITS" ]; then
  echo "[hep-isolation-guard] BLOCKED PUSH: Non-isolated author/committer found in git history:" >&2
  echo "$BAD_COMMITS" >&2
  exit 1
fi
exit 0
`;

const preCommitPath = path.join(hooksDir, "pre-commit");
const prePushPath = path.join(hooksDir, "pre-push");

fs.writeFileSync(preCommitPath, preCommitScript, { mode: 0o755 });
fs.writeFileSync(prePushPath, prePushScript, { mode: 0o755 });
fs.chmodSync(preCommitPath, 0o755);
fs.chmodSync(prePushPath, 0o755);

try {
  execFileSync("git", ["config", "user.name", "Human Edge Press"], { cwd: root });
  execFileSync("git", ["config", "user.email", "customersupport@humanedgepress.com"], { cwd: root });
  execFileSync("git", ["config", "credential.useHttpPath", "true"], { cwd: root });
} catch {
  // Ignore inside CI environments where git config may be read-only
}

console.log("[Isolation] Installed repo-local pre-commit & pre-push guards and configured customersupport@humanedgepress.com.");
