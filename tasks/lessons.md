# Lessons Learned

## Supabase TypeScript Generics
- **Problem:** `createServerClient<Database>` from `@supabase/ssr` resolves query results to `{}` or `never` when using manually defined Database types
- **Root Cause:** The Database interface must include `Views`, `Functions`, `Enums`, `CompositeTypes` keys and `Relationships` arrays on each table. Even with those, JSONB columns with custom interface types (like `PostContent`) break resolution.
- **Solution:** Use `Json` type for JSONB columns in the Database interface, and explicitly cast query results: `const posts = (data || []) as Post[]`
- **Rule:** Always use explicit type assertions on Supabase query results when using manual types

## Tailwind v4 in Next.js 16
- **Info:** Next.js 16.1.6 ships with Tailwind v4 by default
- **Config:** Uses `@theme inline {}` in CSS instead of `tailwind.config.ts`
- **Fonts:** Register font CSS variables in `@theme inline` block as `--font-*`
- **Rule:** Don't downgrade to v3 when using Next.js 16 — v4 is now stable and fully supported

## Next.js 16 Middleware Deprecation
- **Info:** Next.js 16 deprecates `middleware.ts` in favor of `proxy.ts`
- **Impact:** Non-blocking warning during build, middleware still works
- **Action:** Will need to migrate when Supabase SSR updates their docs

## n8n Workflow Creation via MCP
- **Node types:** Use `@n8n/n8n-nodes-langchain.googleGemini` (standalone) for Gemini, `@n8n/n8n-nodes-langchain.chainLlm` + `@n8n/n8n-nodes-langchain.lmChatAnthropic` (sub-node) for Claude
- **Connections:** Chat model sub-nodes connect via `ai_languageModel` type, not `main`
- **Partial update:** Node names with special characters (& etc.) fail in `updateNode` — use `nodeId` instead, but ensure full ID (not truncated)
- **Credential IDs:** Left empty during creation — user must configure in n8n UI
- **Rule:** Always validate workflow after creation with `n8n_validate_workflow`

## Supabase MCP Permissions
- **Problem:** Supabase MCP tool may not have access to all projects (different org or access token scope)
- **Workaround:** Provide SQL migration file for manual execution in Supabase SQL Editor
- **Rule:** Always have a fallback SQL migration file when using Supabase MCP for DDL operations

## n8n Code Nodes — No `fetch()` Available
- **Problem:** n8n Code nodes run in a sandboxed environment where `fetch()` is NOT defined
- **Solution:** Use `this.helpers.httpRequest()` for all HTTP calls — this is n8n's built-in HTTP utility
- **Syntax:** `await this.helpers.httpRequest({ method, url, headers, body, json: true })`
- **Rule:** NEVER use `fetch()` in n8n Code nodes. Always use `this.helpers.httpRequest()`

## n8n Partial Update API
- **Problem:** `updateNode` operation requires `updates` (plural), not `update`
- **Rule:** Always use `updates` key in `updateNode` operations for `n8n_update_partial_workflow`

## LLM JSON Output + Bulgarian Text — Escaping Loop Prevention
- **Problem:** Bulgarian text uses curly quotes (`„"`, `""`, `''`) which break JSON parsing. Trying to fix quotes in post-processing creates an escaping loop (each fix adds more broken escaping).
- **Solution:** Prevent at the source — add strict JSON output rules to the LLM prompt: "Use ONLY straight quotes, escape inner quotes as \", never use curly quotes"
- **Rule:** NEVER try to regex-replace curly quotes in a JSON validator node. Fix the prompt instead.
- **Validator should:** Only do safe fixes (trailing commas, comments), parse as-is, and give clear error positions on failure.

## n8n Nodes Created via API — Always Set `operation` Explicitly
- **Problem:** n8n nodes created via MCP/API may not correctly infer default `operation` values. The UI always writes operation explicitly, but the API doesn't auto-fill defaults.
- **Impact:** Node silently fails because parameters gated by `displayOptions.show.operation` aren't recognized as active
- **Rule:** ALWAYS set both `resource` AND `operation` explicitly when creating/updating n8n nodes via API
- **Example:** For image generation: `resource: "image"` + `operation: "generate"` (not just `resource: "image"`)

## Tailwind v4 — `prose` Requires Typography Plugin
- **Problem:** `prose` and `prose-invert` classes do nothing without `@tailwindcss/typography` installed
- **Impact:** Markdown rendered by react-markdown gets no base typography styles (bold, lists, links, etc.)
- **Workaround:** Use explicit descendant selectors like `[&_strong]:font-bold [&_strong]:text-brand-white`
- **Rule:** Either install the typography plugin OR use explicit styles — don't rely on `prose` without the plugin

## n8n Validation False Positives
- **Info:** n8n workflow validator warns about "Invalid $ usage" and "Use $helpers not helpers" for valid Code node patterns like `$('Node Name')` and `this.helpers.httpRequest()`
- **Rule:** These warnings are false positives — ignore them if the patterns match known n8n Code node APIs

## n8n Code Nodes Cannot Access $env
- **Problem:** `$env.VARIABLE_NAME` works in expression fields (HTTP Request, Set, etc.) but NOT in Code node JavaScript
- **Workaround:** Use HTTP Request nodes for env-dependent operations, or hardcode values in Code nodes with clear `// USER: Replace` comments
- **Rule:** For Supabase/API key access in Code nodes, use placeholder constants that the user replaces manually

## Bulgarian Curly Quotes in JSX Break Turbopack Parser
- **Problem:** Bulgarian quotation marks `„"` inside JSX string literals cause Turbopack parsing errors in Next.js 16
- **Solution:** Use Unicode escape sequences: `\u201E` for `„` and `\u201C` for `"`
- **Rule:** Always escape Bulgarian curly quotes in JSX/TSX files using Unicode escapes

## n8n IF Node False Branch Is Output Index 1
- **Info:** In n8n IF node v2, true branch = `main[0]`, false branch = `main[1]`
- **Warning:** Validator warns about "error output connections in main[1]" — this is a false positive for IF nodes, not an actual error
- **Rule:** Ignore the "missing onError: continueErrorOutput" warning for IF node false branches
