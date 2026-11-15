# Security Policy

## Scope & Architecture
`humanedgepress-mcp-server` is a **100% read-only (`readOnlyHint: true`), zero-credential** Model Context Protocol server:
- Requires **no API keys, secrets, or user authentication**.
- Executes locally over `stdio` (or self-hosted `http`) with bundled offline catalog & research snapshots.
- Optional background catalog/blog sync is strictly locked via `isSafeAndSecureUrl()` to `https://humanedgepress.com` with `AbortSignal.timeout(5000)`, blocked redirects, and `Content-Type` verification.
- Production dependencies are audited via `npm audit --omit=dev --audit-level=high` before every release (`prepublishOnly`).

## Reporting a Vulnerability
Please report any security concern to `customersupport@humanedgepress.com` or open a security advisory on GitHub.
