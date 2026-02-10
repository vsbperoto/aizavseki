# Session Log

> Append-only. Newest sessions at the top. Never delete old entries.

---

## Session: 2026-02-10 (Resources UX Overhaul + SEO Audit)

### What Was Done
- **Resources page UX overhaul**: Server-side pagination (24/page), search with debounce, sort (4 options), stats bar with clickable type counts
- **Resource cards enhanced**: Colored left border per content type (cyan/green/amber), quality badge (★ Топ for ≥8.5), category emoji icons
- **SEO fixes**: robots.txt blocks /admin, blog listing CollectionPage JSON-LD, about page AboutPage JSON-LD
- **Resource detail SEO**: DefinedTerm schema for definitions, inLanguage: "bg" on all resources, isPartOf linking to CollectionPage
- **Performance**: Listing page now selects only 10 columns instead of `select("*")`, no more loading all 333 resources at once
- **Full audit report**: Created `tasks/audit-2026-02-10.md` with all findings

### Last Known Good State
- **Build Status:** ✅ Passing (0 errors)
- **Dev Server:** Not tested (Supabase queries need live DB)
- **Last Successful Command:** `npm run build`
- **Git State:** master, uncommitted changes (ready to commit)

### What Changed (Files Modified)
- `src/app/resources/page.tsx` — Major rewrite: pagination, search, sort, stats, column selection
- `src/components/resources/ResourceCard.tsx` — Colored border, quality badge, hover lift, category emoji
- `src/components/resources/ResourceGrid.tsx` — Accept count info, result summary text
- `src/components/resources/ResourceTypeFilter.tsx` — Reset page on filter change, category emoji icons
- `src/lib/constants.ts` — Added emoji icon to each RESOURCE_CATEGORIES entry
- `src/app/robots.ts` — Added `/admin` to disallow
- `src/app/blog/page.tsx` — Added CollectionPage + ItemList JSON-LD
- `src/app/about/page.tsx` — Added AboutPage JSON-LD
- `src/app/resources/[slug]/page.tsx` — DefinedTerm for definitions, inLanguage, isPartOf

### New Files Created
- `src/components/resources/Pagination.tsx` — Page navigation with ellipsis
- `src/components/resources/ResourceSearch.tsx` — Debounced search input (client)
- `src/components/resources/ResourceSort.tsx` — Sort dropdown (client)
- `src/components/resources/ResourceStats.tsx` — Clickable type count stats bar
- `tasks/audit-2026-02-10.md` — Full SEO/LLMO audit report

### Active Decisions
- Using ilike search instead of Supabase FTS (simpler, works on title + key_takeaway)
- Hardcoded type counts (111/111/111) when no filters — dynamic counts only when filtered
- ResourceCard uses `hover={false}` on Card to avoid double hover effect (Card already has hover)
- PER_PAGE = 24 (divisible by 2 and 3 for grid layout)

### Known Issues
- None — build passing

### Next Steps (Priority Order)
1. Commit + push to deploy on Vercel
2. Verify live site: pagination, search, sort, filters, JSON-LD
3. Submit updated sitemap to Google Search Console
4. Fact-check Wave 1 articles (58 shorter articles)
5. Configure n8n credentials and activate workflows

### ⚠️ DO NOT Touch
- `src/app/resources/[slug]/page.tsx` markdown styles — long but intentional explicit selectors
- `src/lib/supabase/types.ts` — manual types, use explicit casts
- n8n workflow nodes — need user credential config first

---

## Session: 2026-02-10 (333 Resource Seeding — COMPLETE)

### What Was Done
- **333/333 articles seeded successfully** via Codex CLI (gpt-5.3-codex + web_search: live)
- Created 7 initial batch files from topic-map.json (batch-0 through batch-6)
- Fixed Codex CLI flags: `codex exec --full-auto --json` (v0.98.0 syntax)
- Launched 7 Codex agents → 6 retry agents → 3 final agents across 3 rate-limit cycles
- Fixed 9 articles with word_count=1 (content was fine, just bad counting) — batch UPDATE
- Quality verification passed:
  - **Content types**: 111 definitions + 111 howtos + 111 comparisons = 333 total
  - **Word counts**: min 464, avg 1,578, max 2,117 (20 articles <1000 words — all Wave 1 originals)
  - **Quality scores**: 322 scored 9/10, 11 scored 8/10
  - **FAQ items**: all 333 articles have 5 FAQ items
  - **All content in Bulgarian**, answer-first format, bold quotable statements, 2026 web-researched data

### Seeding Timeline
| Wave | Articles | Method | Notes |
|------|----------|--------|-------|
| Wave 1 (pre-session) | 58 | Sonnet agents | Original definitions, shorter format |
| Agent 0 | +2 | Codex exec | Gap fill (IDs 29, 30) |
| Agents 1-6 | +46 | Codex exec | Agent 2 crashed exit 127, others hit rate limits |
| Retry 1-6 | +200 | Codex exec | After rate limit reset #1 |
| Final 1-3 | +27 | Codex exec | After rate limit reset #2, last 3 needed one more agent |

### Last Known Good State
- **Build Status:** ✅ Passing (no app code changes)
- **Dev Server:** Not tested (no code changes)
- **Last Successful Command:** `codex exec --full-auto --json "..."`
- **Git State:** master, `8996065` — no new commits this session
- **DB Count:** 333/333 resources — ALL COMPLETE

### What Changed (Files Modified/Created)
- `tasks/seed/batch-0.json` through `batch-6.json` — initial batch files
- `tasks/seed/batch-retry-1.json` through `batch-retry-6.json` — retry wave batches
- `tasks/seed/batch-final-1.json` through `batch-final-3.json` — final gap fill batches
- `tasks/seed/create-batches.js` — batch creation script
- `tasks/seed/check-progress.js` — progress checker + retry batch generator
- `tasks/seed/find-missing.js` — missing slug finder
- `tasks/seed/resume-seeding.md` — account switch protocol
- `tasks/seed/logs/agent-*.log` — Codex agent logs (multiple waves)

### Active Decisions
- Using `codex exec` (non-interactive) instead of interactive mode (stdin TTY issue)
- `--full-auto` + `--json` flags, web search via config `web_search = "live"`
- Supabase MCP for direct SQL inserts with dollar-quoting `$body$...$body$`
- UNIQUE slug constraint for idempotent inserts (safe to retry)

### Known Issues
- 20 articles below 1000 words (all from Wave 1 original batch — different format, not broken)
- 2 comparisons at ~464-499 words are genuinely short but have valid content

### Next Steps (Priority Order)
1. Fact-check Wave 1 (original 58 articles) — update with 2026 web-researched data
2. Verify live site renders all 333 resources correctly
3. Configure n8n credentials and activate pipelines

### ⚠️ DO NOT Touch
- `~/.codex/config.toml` — Supabase MCP + web_search config
- All 333 articles in DB — seeding complete

---

## Session: 2026-02-10 (Pipeline v5.1 Website Fixes)

### What Was Done
- Added `keywords TEXT[]` column to `posts` table via Supabase migration
- Updated TypeScript types (Row, Insert, Update) with `keywords: string[] | null`
- Webhook now accepts `keywords` from pipeline and stores with `Array.isArray()` guard
- Blog article metadata upgraded: structured OG image `{url, width: 1200, height: 630}`, Twitter `summary_large_image` card, per-article `keywords` meta tag

### Last Known Good State
- **Build Status:** ✅ Passing
- **Dev Server:** ✅ (not tested this session, build confirmed)
- **Last Successful Command:** `npm run build`
- **Git State:** master, `8996065` "feat: pipeline v5.1 — OG image dimensions, Twitter card, article keywords"
- **Vercel:** Auto-deploying from push

### What Changed (Files Modified)
- `src/lib/supabase/types.ts` — added `keywords` field to posts Row, Insert, Update
- `src/app/api/webhook/content/route.ts` — destructure `keywords` from body + insert with Array.isArray guard
- `src/app/blog/[slug]/page.tsx` — replaced metadata return: structured OG image with dimensions, Twitter card, article keywords

### Active Decisions
- OG image dimensions hardcoded to 1200x630 (standard social preview size)
- Twitter card type `summary_large_image` for Cloudinary URLs
- Keywords fall back to undefined (inherits layout.tsx globals via Next.js metadata merging)

### Known Issues
- n8n workflows still need credential config before activation (unchanged from previous session)

### Next Steps (Priority Order)
1. Configure n8n credentials and activate pipelines
2. Test end-to-end: pipeline sends keywords + image_urls → webhook stores → blog renders metadata
3. Verify OG tags with Facebook Sharing Debugger / Twitter Card Validator after first v5.1 post

### ⚠️ DO NOT Touch
- `src/components/blog/FaqSection.tsx` — working, no changes needed
- WEBHOOK_SECRET / auth logic — stable
- Cloudinary config — managed in n8n, not Next.js

---

## Session: 2026-02-10 (Codex 5.3 Seeding Infrastructure — Web Research + Supabase MCP)

### What Was Done
- Added `supabase_aizavseki` MCP server to Codex config (`~/.codex/config.toml`) with user's PAT
- Changed Codex `model_reasoning_effort` from `xhigh` to `high` (cost optimization)
- Rewrote `tasks/seed/agent-prompt.md` — added mandatory web research step, switched from webhook POST to direct Supabase MCP SQL INSERTs with dollar-quoting
- Rewrote `scripts/seed-orchestrator.sh` — default START=61 (skip Wave 1), removed WEBHOOK_SECRET dependency, added `--model-reasoning-effort high` flag, Supabase MCP instructions
- Created `scripts/seed-update-existing.sh` — fact-check agent for Wave 1 articles (topics 1-60), reads existing articles then web searches and UPDATEs
- Updated `scripts/seed-retry-failed.sh` — switched from webhook to Supabase MCP approach
- Created `CODEX.md` in project root — Codex agent context file with table schema, SQL templates, content rules, web research requirements

### Last Known Good State
- **Build Status:** ✅ Passing (no app code changes — config/scripts only)
- **Dev Server:** Not tested (no code changes)
- **Last Successful Command:** file edits only
- **Git State:** master, `522e8b0` — uncommitted changes to scripts + new files

### What Changed (Files Modified)
- `~/.codex/config.toml` — Added supabase_aizavseki MCP, reasoning_effort xhigh→high
- `tasks/seed/agent-prompt.md` — Complete rewrite: webhook→Supabase MCP, added web research mandate
- `scripts/seed-orchestrator.sh` — Rewritten for Supabase MCP, START=61, 6 agents default
- `scripts/seed-retry-failed.sh` — Updated for Supabase MCP approach

### New Files Created
- `CODEX.md` — Project-level Codex agent instructions (table schema, SQL templates, rules)
- `scripts/seed-update-existing.sh` — Fact-check and update Wave 1 articles

### Active Decisions
- Supabase MCP replaces webhook for resource seeding (direct SQL = no escaping issues, supports UPDATE)
- Dollar-quoting `$body$...$body$` for content fields (avoids single-quote escaping hell)
- Web search mandatory for every article (2026 fact-checked data)
- Wave 1 (1-60) handled separately by seed-update-existing.sh after Wave 2 completes
- Reasoning effort reduced to "high" (from "xhigh") for cost/speed balance

### Known Issues
- Wave 1 agents (topics 1-60) currently running via Claude Sonnet — those articles lack web research
- seed-update-existing.sh will fix Wave 1 after completion

### Next Steps (Priority Order)
1. Wait for Wave 1 Sonnet agents to finish (topics 1-60)
2. User runs from WSL: `./scripts/seed-orchestrator.sh 61 333 6`
3. Monitor: `./scripts/seed-status.sh`
4. After Wave 2 done: `./scripts/seed-update-existing.sh` (fact-checks Wave 1)
5. Retry failures: `./scripts/seed-retry-failed.sh`
6. Verify: `SELECT count(*), content_type FROM resources GROUP BY content_type;` = 111 each

### ⚠️ DO NOT Touch
- Codex MCP configs for other projects (globalnik, sladkishcho, vintage)
- n8n credential IDs
- WEBHOOK_SECRET in Vercel (still needed for n8n content pipeline)
- Wave 1 Sonnet agents currently running — let them finish

---

## Session: 2026-02-10 (333 Resources Infrastructure + Seeding System)

### What Was Done
- Created `resources` table in Supabase via MCP migration (UUID, slug, content_type, category, content, FAQ, keywords, etc.)
- Added Resource type to `src/lib/supabase/types.ts` (Row/Insert/Update + type export)
- Added `RESOURCE_CATEGORIES` (8 categories) and `CONTENT_TYPES` (3 types) to `src/lib/constants.ts`
- Created `/api/webhook/resources` endpoint — same auth pattern as content webhook, validates content_type/category, auto-calculates word count, handles slug dedup
- Created 3 resource components: `ResourceCard`, `ResourceGrid`, `ResourceTypeFilter`
- Replaced static `/resources` page with DB-driven listing (ISR, filters by type+category, CollectionPage JSON-LD)
- Created `/resources/[slug]` detail page (type-specific JSON-LD, BreadcrumbList, FAQPage, speakable, markdown rendering, related resources, key takeaway box)
- Updated sitemap with resource entries
- Updated `llms.txt` with resources section
- Generated 333-topic map: 111 definitions + 111 how-to + 111 comparisons, balanced across 8 categories
- Created Codex agent prompt (`tasks/seed/agent-prompt.md`) with content structure, LLMO/GEO rules, JSON schema
- Created 3 orchestration scripts: `seed-orchestrator.sh`, `seed-status.sh`, `seed-retry-failed.sh`

### Last Known Good State
- **Build Status:** ✅ Passing (0 errors, 32 routes)
- **Dev Server:** Not tested
- **Last Successful Command:** `npm run build`
- **Git State:** master, `522e8b0` — pushed to origin, Vercel auto-deploying

### What Changed (Files Modified)
- `src/lib/supabase/types.ts` — Added resources table + Resource type
- `src/lib/constants.ts` — Added RESOURCE_CATEGORIES, CONTENT_TYPES, ResourceCategoryKey, ContentTypeKey
- `src/app/resources/page.tsx` — REPLACED static tools page with DB-driven listing
- `src/app/sitemap.ts` — Added resource entries from Supabase
- `public/llms.txt` — Added resources section

### New Files Created
- `tasks/migrations/create_resources_table.sql` — DB migration
- `src/app/api/webhook/resources/route.ts` — Resource ingestion webhook
- `src/app/resources/[slug]/page.tsx` — Resource detail page
- `src/components/resources/ResourceCard.tsx` — Card component
- `src/components/resources/ResourceGrid.tsx` — Grid layout
- `src/components/resources/ResourceTypeFilter.tsx` — Filter tabs
- `tasks/seed/topic-map.json` — 333 topics master list
- `tasks/seed/agent-prompt.md` — Codex agent instructions
- `scripts/seed-orchestrator.sh` — Parallel agent launcher
- `scripts/seed-status.sh` — Progress monitor
- `scripts/seed-retry-failed.sh` — Retry failed topics

### Active Decisions
- Resources use plain markdown (via react-markdown), not slides format like blog posts
- 8 resource categories are independent from 5 blog pillars (more granular)
- Resource webhook uses same WEBHOOK_SECRET as content webhook
- Slug dedup: append `-{timestamp.toString(36)}` for collisions
- FaqSection component reused from blog (no new component needed)

### Known Issues
- None blocking — all infrastructure is deployed

### Next Steps (Priority Order)
1. Wait for Vercel deploy to complete
2. Test webhook with curl: `curl -X POST https://aizavseki.eu/api/webhook/resources -H "Authorization: Bearer $WEBHOOK_SECRET" -H "Content-Type: application/json" -d '{"title":"Тест","content_type":"definition","category":"AI_BASICS","content":"Тестово съдържание."}'`
3. Verify test resource at `/resources/{slug}`, then delete from Supabase
4. Run seeding from WSL: `./scripts/seed-orchestrator.sh 1 333 4`
5. Monitor with `./scripts/seed-status.sh`
6. Retry failures with `./scripts/seed-retry-failed.sh`
7. Verify count: `SELECT count(*), content_type FROM resources GROUP BY content_type;`

### ⚠️ DO NOT Touch
- n8n credential IDs: `BZp9maC2RuSSomid` (Gemini), `jb8lJzGL9ZRWU2Vy` (Anthropic)
- WEBHOOK_SECRET in Vercel — already configured
- `/resources/rechnik/` glossary page — still works as sub-route
- Blog components — not modified, resources have their own components

---

## Session: 2026-02-10 (Pipeline v3 Critical Fixes — Scout-First + JSON Robustness)

### What Was Done
- **Fix 1: Scout-first architecture** — Rewired entire pipeline so scout topic DRIVES pillar choice
  - Renamed "Get Scout Topic" → "Get Best Topic" with cross-pillar query (`order=relevance_score.desc,engagement_score.desc`)
  - Moved "Pick Daily Pillar" to FALSE branch of IF (only runs when no scout topics exist)
  - Rewired: `Daily 8AM → Get Best Topic → Has Topic? → TRUE: SERP Brief / FALSE: Pick Daily Pillar → Gemini Fallback → SERP Brief`
  - Updated all downstream expressions with conditional `has_scout_topic ? scout : pillar` pattern
- **Fix 2: JSON parsing robustness** — Two-layer defense
  - Replaced Validate JSON sanitizer with robust version (Bulgarian curly quotes, control chars, BOM, regex extraction)
  - Used `String.fromCharCode()` approach to avoid JSON encoding hell in n8n Code nodes
  - Updated Sonnet Writer + Gemini Quality Review prompts with strict JSON output rules
- IF node `Has Topic?` now uses `looseTypeValidation: true` for reliable boolean check
- Workflow validated: **0 errors**, 14 warnings (all known false positives)
- Connection graph verified: 12 nodes, 11 connections, scout-first architecture confirmed

### Last Known Good State
- **Build Status:** ✅ Passing (no local code changes — n8n-only session)
- **n8n Workflow:** ✅ Valid (0 errors, Rs3zNLx8hSSTgw47)
- **Git State:** master, uncommitted local changes from v3 implementation

### What Changed (Files Modified)
- No local files changed — all changes to n8n workflow `Rs3zNLx8hSSTgw47` via MCP
- **n8n nodes updated:** Get Best Topic (renamed + new code), Pick Daily Pillar (moved to false branch), Gemini SERP Brief (updated expressions), Sonnet Writer (stricter JSON rules + conditional pillar refs), Gemini Quality Review (stricter JSON rules), Validate JSON (robust sanitizer), Upload & Publish (updated refs)

### Active Decisions
- Scout-first: best unused topic (any pillar) drives the article's pillar — no more pillar rotation when topics exist
- Pillar rotation (dayOfYear % 5) only fires as fallback when trending_topics table is empty
- `String.fromCharCode()` used in Validate JSON Code node to avoid backslash/quote escaping issues in n8n API

### Known Issues
- Supabase service role key still placeholder `'REPLACE_WITH_SERVICE_ROLE_KEY'` in Get Best Topic + Upload & Publish
- xAI API key not yet configured for Grok Scout workflow
- Neither workflow activated yet — needs manual testing first

### Next Steps (Priority Order)
1. ~~Git commit and push all v3 changes~~ — DONE: `fc7cc43`, pushed to origin/master, Vercel auto-deploying
2. Configure Supabase service role key in n8n Code nodes (Get Best Topic + Upload & Publish)
3. Configure xAI API key credential in n8n (Grok Scout)
4. Manual test Scout workflow → verify topics in Supabase
5. Manual test main pipeline v3 → verify article publishes
6. Activate both workflows

### ⚠️ DO NOT Touch
- n8n credential IDs: `BZp9maC2RuSSomid` (Gemini), `jb8lJzGL9ZRWU2Vy` (Anthropic) — DO NOT change
- WEBHOOK_SECRET in Vercel — already configured
- Cloudinary config: `dgpayiccs` / `aizavseki_unsigned` / `aizavseki/posts`
- IF node `looseTypeValidation: true` — needed for boolean check to work correctly

---

## Session: 2026-02-10 (Content Pipeline v3 Implementation)

### What Was Done
- Implemented full Content Pipeline v3 overhaul (all 6 phases)
- **Phase 1**: Supabase migration (trending_topics table + 5 new post columns), webhook + types update
- **Phase 2**: Created Grok Scout workflow (J0KAdiRqGkGcp41i) — 5 nodes, xAI Responses API with x_search + web_search
- **Phase 3**: Rebuilt main pipeline to v3 (Rs3zNLx8hSSTgw47) — 12 nodes with scout integration, IF branching, SERP brief, quality review
- **Phase 4**: LLMO optimizations — llms.txt, speakable schema, HowTo schema, dateModified, reading time, image_alt_text, enhanced Organization JSON-LD, sitemap update
- **Phase 5**: 5 pillar landing pages, Bulgarian AI glossary (24 terms), AI bot detection middleware, pillar slug mapping
- **Phase 6**: Content type cycling (article/definition/comparison) in pillar rotation + Sonnet Writer prompt

### Last Known Good State
- **Build Status:** ✅ Passing (0 errors)
- **Dev Server:** Not tested this session
- **Last Successful Command:** `npm run build`
- **Git State:** master, uncommitted changes (ready to commit)

### What Changed (Files Modified)
- `src/lib/supabase/types.ts` — Added TrendingTopic type, 5 new Post fields
- `src/app/api/webhook/content/route.ts` — Accept image_alt_text, quality_score, word_count, target_keyword, internal_links_used
- `src/app/blog/[slug]/page.tsx` — Speakable, HowTo, dateModified, reading time, image_alt_text
- `src/app/layout.tsx` — Enhanced Organization JSON-LD (knowsAbout, foundingDate, areaServed)
- `src/app/sitemap.ts` — Added pillar pages + glossary
- `src/components/blog/PostContent.tsx` — Added imageAltText prop
- `src/lib/constants.ts` — Added PILLAR_SLUGS + SLUG_TO_PILLAR mappings
- `src/middleware.ts` — AI bot detection (GPTBot, ClaudeBot, PerplexityBot, etc.)

### New Files Created
- `public/llms.txt` — AI crawler discovery file
- `tasks/migrations/v3_pipeline.sql` — DB migration
- `src/components/blog/PillarPage.tsx` — Shared pillar page component
- `src/app/blog/(pillars)/ai-novini/page.tsx` — AI News pillar page
- `src/app/blog/(pillars)/ai-instrumenti/page.tsx` — AI Tools pillar page
- `src/app/blog/(pillars)/ai-saveti/page.tsx` — AI Tips pillar page
- `src/app/blog/(pillars)/ai-za-biznes/page.tsx` — AI Business pillar page
- `src/app/blog/(pillars)/ai-zabavlenia/page.tsx` — AI Fun pillar page
- `src/app/resources/rechnik/page.tsx` — Bulgarian AI glossary (24 terms)

### Active Decisions
- Grok Scout uses HTTP Request to xAI Responses API (not built-in node) for x_search/web_search tools
- trending_topics uses `used_at TIMESTAMPTZ` (NULL = available) instead of boolean
- Supabase service role key stored as placeholder in Code nodes — user must replace
- Content types cycle independently from pillars (dayOfYear % 3 for types, % 5 for pillars)
- Quality Review uses Gemini (free via Google credits) instead of Claude

### Known Issues
- Supabase service role key is placeholder `'REPLACE_WITH_SERVICE_ROLE_KEY'` in n8n Code nodes (Get Scout Topic, Upload & Publish)
- Grok Scout HTTP Request needs Header Auth credential configured for xAI API key
- Scout workflow Insert to Supabase uses `$env.SUPABASE_SERVICE_ROLE_KEY` — user must set this n8n env var
- IF node "Has Topic?" warning about error output connections — this is the false branch, not an error

### Next Steps (Priority Order)
1. Git commit and push all v3 changes
2. Configure xAI API key credential in n8n for Grok Scout
3. Replace Supabase key placeholders in n8n Code nodes
4. Manual test Scout workflow → verify topics in Supabase
5. Manual test main pipeline v3 → verify article publishes with all new fields
6. Activate both workflows
7. Deploy to Vercel

### ⚠️ DO NOT Touch
- `src/components/blog/FaqSection.tsx` — Working as-is
- n8n credential IDs: `BZp9maC2RuSSomid` (Gemini), `jb8lJzGL9ZRWU2Vy` (Anthropic) — DO NOT change
- WEBHOOK_SECRET in Vercel — already configured, do not modify
- Cloudinary config: `dgpayiccs` / `aizavseki_unsigned` / `aizavseki/posts`

---

## Session: 2026-02-10 (Fix JSON Escaping Loop in n8n)

### What Was Done
- Updated "Sonnet Writer" prompt: added CRITICAL JSON OUTPUT RULES to prevent Bulgarian curly quotes in JSON output
- Simplified "Validate JSON" node: removed all quote-fixing regex (caused escaping loops), kept only safe fixes (trailing commas, comments), added better error reporting with position context

### Last Known Good State
- **Build Status:** ✅ Passing (no code changes)
- **n8n Workflow:** ✅ Valid (0 errors)
- **Git State:** master, 3ee475c

### What Changed (Files Modified)
- **n8n workflow `Rs3zNLx8hSSTgw47`:** 2 node updates (Sonnet Writer prompt + Validate JSON code)

### Active Decisions
- Prevent JSON issues at the source (LLM prompt) instead of patching in post-processing
- Validate JSON node no longer attempts to fix quotes — just parse and report errors clearly

### Known Issues
- Needs manual test to confirm Sonnet 4.5 respects the JSON output rules consistently

### Next Steps (Priority Order)
1. User triggers n8n workflow manually to test JSON output
2. If still failing, error message now shows exact position for debugging

### ⚠️ DO NOT Touch
- Same as previous session

---

## Session: 2026-02-10 (Fix Image Generation Node + Bold Text)

### What Was Done
- Fixed n8n "Generate Image" node: added explicit `operation: "generate"` parameter (was missing, causing node to silently fail)
- Fixed bold text rendering in PostContent: added `[&_strong]:font-bold` to ensure `font-weight: 700` on `<strong>` elements
- User fixed webhook 401 by adding `WEBHOOK_SECRET` to Vercel env vars

### Last Known Good State
- **Build Status:** ✅ Passing (`npm run build` — 25 routes, 0 errors, 1594ms)
- **Dev Server:** Not tested (build-only)
- **Last Successful Command:** `npm run build`
- **Git State:** master, uncommitted change in PostContent.tsx

### What Changed (Files Modified)
- `src/components/blog/PostContent.tsx` — added `[&_strong]:font-bold` to markdown container div
- **n8n workflow `Rs3zNLx8hSSTgw47`:** "Generate Image" node updated with explicit `operation: "generate"`

### Active Decisions
- Using explicit `operation` parameter on all n8n nodes (API-created nodes don't reliably use defaults)
- Not installing `@tailwindcss/typography` — using manual CSS selectors for markdown instead

### Known Issues
- Image generation not yet tested end-to-end (user needs to trigger workflow)
- `prose prose-invert` classes on PostContent outer div are no-ops (no typography plugin) — harmless but could be cleaned up later

### Next Steps (Priority Order)
1. User triggers n8n workflow manually to test image generation end-to-end
2. Verify bold text renders correctly on live site after deploy
3. Deploy updated PostContent.tsx to Vercel (`git push`)

### ⚠️ DO NOT Touch
- `src/app/api/data-deletion/route.ts` — Meta signed_request verification
- `src/lib/auth/session.ts` — AES-256-GCM session encryption
- Webhook secret in `.env.local` / Vercel — must match n8n workflow value
- `src/app/api/webhook/content/route.ts` — working correctly now

---

## Session: 2026-02-10 (n8n Workflow Fix — Cloudinary + fetch Error)

### What Was Done
- Ran Supabase migration: added `meta_title`, `meta_description`, `key_takeaway`, `faq_items` columns to `posts` table
- Fixed n8n workflow `Rs3zNLx8hSSTgw47` — "Generate Image" node: added `onError: continueRegularOutput` so pipeline continues if image generation fails
- Fixed n8n workflow `Rs3zNLx8hSSTgw47` — "Upload & Publish" node: replaced broken `fetch()` calls with `this.helpers.httpRequest()` (the n8n-native way)
- Upload & Publish now uploads images to Cloudinary (`dgpayiccs`, preset `aizavseki_unsigned`) instead of Supabase Storage
- Webhook payload now sends `image_urls` (Cloudinary URLs) instead of `image_base64` — webhook route already supports this path
- Graceful handling: if Gemini generates 0 images, pipeline continues and publishes without an image

### Last Known Good State
- **Build Status:** ✅ Passing (no code changes made)
- **Dev Server:** Not tested (no code changes)
- **Last Successful Command:** n8n workflow validation — 0 errors, 9 warnings (all generic/false-positive)
- **Git State:** master, no new changes (n8n-only session)

### What Changed (Files Modified)
- No local files changed — all changes were to n8n workflow via MCP
- **n8n workflow `Rs3zNLx8hSSTgw47`:** 2 node updates (Generate Image + Upload & Publish)
- **Supabase `posts` table:** 4 new columns added via SQL migration

### Active Decisions
- Using Cloudinary (`dgpayiccs`) with unsigned upload preset `aizavseki_unsigned` for image hosting (matches old workflow pattern)
- `this.helpers.httpRequest()` is the correct way to make HTTP calls in n8n Code nodes (not `fetch()`)
- Cloudinary URLs go directly into `image_urls` field — no base64 intermediary needed
- Generate Image uses `continueRegularOutput` (not `continueErrorOutput`) so it passes through to Upload & Publish even on failure

### Known Issues
- n8n validation warnings about "$helpers" and "Invalid $ usage" are false positives — `$('node')` and `this.helpers` are valid Code node patterns
- n8n credentials still need user configuration (Google Gemini + Anthropic API keys)
- Workflow not yet activated — needs manual test first

### Next Steps (Priority Order)
1. Configure n8n credentials: Google Gemini API key + Anthropic API key
2. Manual test of n8n workflow (trigger single execution)
3. Activate workflow for daily 8AM schedule
4. Verify end-to-end: article appears on aizavseki.eu/blog with Cloudinary image

### ⚠️ DO NOT Touch
- `src/app/api/data-deletion/route.ts` — Meta signed_request verification (tested, critical)
- `src/lib/auth/session.ts` — AES-256-GCM session encryption
- Webhook secret in `.env.local` — must match n8n workflow's hardcoded value
- `src/app/api/webhook/content/route.ts` — supports both `image_urls` and `image_base64` paths, both are needed

---

## Session: 2026-02-10 (LLMO/GEO Content Pipeline)

### What Was Done
- Implemented full LLMO/GEO content pipeline for AI-optimized article generation
- Added 4 new database columns to posts: `meta_title`, `meta_description`, `key_takeaway`, `faq_items` (JSONB)
- Added `FaqItem` interface to types.ts, updated Post Row/Insert/Update types with new fields
- Upgraded PostContent component: markdown rendering via `react-markdown` + `remark-gfm`, replaced `<img>` with `next/image`
- Created FaqSection component: expandable accordion for FAQ items (client component with ChevronDown animation)
- Updated webhook endpoint: accepts new LLMO fields + base64 image upload to Supabase Storage
- Updated blog post page (`[slug]/page.tsx`):
  - Key takeaway highlighted box before content
  - FaqSection after content
  - `generateMetadata` uses `meta_title`/`meta_description` with fallbacks
  - Triple JSON-LD: Article + BreadcrumbList + FAQPage (conditional)
- Generated WEBHOOK_SECRET and set in `.env.local`
- Installed `react-markdown` and `remark-gfm` dependencies
- Created SQL migration file at `tasks/migrations/add_llmo_columns.sql`
- Created n8n workflow "AiZaVseki LLMO Content Pipeline v2" (ID: Rs3zNLx8hSSTgw47) with 10 nodes:
  1. Schedule Trigger (daily 8AM Europe/Sofia)
  2. Code (pillar rotation: AI_NEWS → AI_TOOLS → AI_TIPS → AI_BUSINESS → AI_FUN)
  3. Google Gemini (research with Google Search grounding)
  4. Basic LLM Chain + Claude Haiku 4.5 (LLMO content brief)
  5. Basic LLM Chain + Claude Sonnet 4.5 (full article writer in Bulgarian)
  6. Code (JSON validation)
  7. Google Gemini (image generation)
  8. Code (upload image + POST to webhook)

### Last Known Good State
- **Build Status:** ✅ Passing (`npm run build` — 25 routes, 0 errors, compiled in 1556ms)
- **Dev Server:** Not tested this session (build-only verification)
- **Last Successful Command:** `npm run build`
- **Git State:** master, no new commit (awaiting user review)

### What Changed (Files Modified)
- `src/lib/supabase/types.ts` — Added `FaqItem` interface, 4 new fields to posts Row/Insert/Update
- `src/app/api/webhook/content/route.ts` — Added LLMO fields + base64 image upload to Supabase Storage
- `src/components/blog/PostContent.tsx` — Markdown rendering via react-markdown, next/image for slide images
- `src/components/blog/FaqSection.tsx` — NEW: Expandable FAQ accordion component
- `src/app/blog/[slug]/page.tsx` — Key takeaway box, FaqSection, triple JSON-LD, updated generateMetadata
- `.env.local` — Set WEBHOOK_SECRET
- `package.json` / `package-lock.json` — Added react-markdown, remark-gfm (97 packages)
- `tasks/migrations/add_llmo_columns.sql` — NEW: Database migration for 4 new columns

### Active Decisions
- Using standalone Google Gemini node (not chat model sub-node) for research with built-in Google Search grounding
- Using Basic LLM Chain + Anthropic Chat Model sub-nodes for Claude (Haiku brief + Sonnet writing)
- Image upload via base64 in webhook payload → Supabase Storage (avoids external service)
- FaqSection uses simple state toggle (no animation library needed, just CSS transition)
- Pillar rotation uses `dayOfYear % 5` for deterministic daily cycling

### Known Issues
- SQL migration (`tasks/migrations/add_llmo_columns.sql`) needs to be run manually in Supabase SQL Editor
- n8n credential IDs are empty — user must configure Google Gemini and Anthropic API credentials in n8n
- Supabase Storage bucket "images" must be created and set to public
- n8n workflow not yet activated (needs credentials + manual test first)
- middleware.ts deprecation warning still present (non-blocking)

### Next Steps (Priority Order)
1. Run `tasks/migrations/add_llmo_columns.sql` in Supabase SQL Editor
2. Create "images" storage bucket in Supabase (set public)
3. Configure n8n credentials (Google Gemini API key + Anthropic API key)
4. Manual test of n8n workflow
5. Activate n8n workflow for daily 8AM schedule
6. Test full pipeline end-to-end
7. Deploy updated app to Vercel

### ⚠️ DO NOT Touch
- `src/app/api/data-deletion/route.ts` — Meta signed_request verification (tested, critical)
- `src/lib/auth/session.ts` — AES-256-GCM session encryption
- Webhook secret in `.env.local` — must match n8n workflow's hardcoded value

---

## Session: 2026-02-09 (Facebook OAuth Admin Panel)

### What Was Done
- Implemented full Facebook OAuth admin panel for token management
- Created SQL migration (`supabase-migration-facebook-tokens.sql`) — `facebook_tokens` table with RLS, upsert on `page_id`, auto-update trigger
- Created `src/lib/facebook/oauth.ts` — Graph API v22.0 helpers (auth URL, token exchange, user info, paginated pages fetch)
- Created `src/lib/auth/session.ts` — AES-256-GCM encrypted session cookies using `ADMIN_SECRET`
- Created 5 API routes:
  - `/api/auth/login` — OAuth redirect initiator
  - `/api/auth/callback` — Full OAuth callback (code → short token → long token → verify admin → upsert pages → session cookie)
  - `/api/auth/token` — Bearer-auth endpoint for n8n to fetch active page token
  - `/api/auth/status` — Session-validated endpoint returning all pages with expiry info
  - `/api/auth/set-active` — Set which page's token is served to n8n
- Created `src/app/admin/layout.tsx` — metadata with `robots: noindex`
- Created `src/app/admin/page.tsx` — Client component with login state, pages list, set-active, token detail, status badges
- Updated `src/lib/supabase/types.ts` — Added `facebook_tokens` table types + `FacebookToken` export
- Updated `.env.local` — Added `META_APP_ID`, `ADMIN_SECRET`, `ADMIN_FACEBOOK_ID` placeholders

### Last Known Good State
- **Build Status:** ✅ Passing (`npm run build` — 25 routes, 0 errors)
- **Dev Server:** Not tested this session (build-only verification)
- **Last Successful Command:** `npm run build`
- **Git State:** master, 505adbd (no new commit — awaiting user review)

### What Changed (Files Modified)
- `supabase-migration-facebook-tokens.sql` — NEW: facebook_tokens table migration
- `src/lib/facebook/oauth.ts` — NEW: Facebook Graph API OAuth helpers
- `src/lib/auth/session.ts` — NEW: AES-256-GCM session encryption
- `src/app/api/auth/login/route.ts` — NEW: OAuth login redirect
- `src/app/api/auth/callback/route.ts` — NEW: OAuth callback handler
- `src/app/api/auth/token/route.ts` — NEW: n8n token endpoint
- `src/app/api/auth/status/route.ts` — NEW: Admin status endpoint
- `src/app/api/auth/set-active/route.ts` — NEW: Set active page endpoint
- `src/app/admin/layout.tsx` — NEW: Admin layout with noindex
- `src/app/admin/page.tsx` — NEW: Admin dashboard client component
- `src/lib/supabase/types.ts` — MODIFIED: Added facebook_tokens table types
- `.env.local` — MODIFIED: Added 3 new env vars

### Active Decisions
- AES-256-GCM for session cookies — zero new dependencies, uses Node crypto built-in
- Inline styled `<span>` badges in admin page — avoids coupling with pillar-specific Badge component
- Status colors: green (valid), amber (≤7 days), red (expired)
- Graph API v22.0 used throughout
- Paginated `/me/accounts` fetch to handle any number of pages
- UNIQUE constraint on `page_id` enables upsert on re-auth

### Known Issues
- SQL migration needs to be run manually in Supabase SQL Editor
- `META_APP_ID`, `ADMIN_SECRET`, `ADMIN_FACEBOOK_ID` need to be filled in `.env.local`
- Facebook App needs redirect URI configured (both prod and localhost)
- middleware.ts deprecation warning still present (non-blocking)

### Next Steps (Priority Order)
1. Run `supabase-migration-facebook-tokens.sql` in Supabase SQL Editor
2. Fill in env vars: `META_APP_ID`, `META_APP_SECRET`, `ADMIN_SECRET`, `ADMIN_FACEBOOK_ID`
3. Add OAuth redirect URIs in Facebook App settings
4. Test the full OAuth flow end-to-end
5. Deploy to Vercel
6. Configure custom domain (aizavseki.eu)
7. Submit Meta app for review

### ⚠️ DO NOT Touch
- `src/app/api/data-deletion/route.ts` — Meta signed_request verification (tested, critical)
- `src/lib/supabase/types.ts` — Manual types now include facebook_tokens (careful with modifications)

---

## Session: 2026-02-09 (Supabase + Testing + Git Commit)

### What Was Done
- Supabase project created manually by user (ogdeziynjtxglhbuctgb)
- Updated .env.local with real Supabase credentials (URL, anon key, service role key)
- Database migration run successfully (5 tables, RLS policies, indexes)
- Dev server tested — all 8 pages return HTTP 200
- All 4 API endpoints tested end-to-end:
  - Newsletter signup: working (upsert with re-subscribe)
  - Contact form: working (inserts to contact_submissions)
  - Data deletion: working (returns confirmation code)
  - Webhook: working (rejects without Bearer token)
- Initial git commit created: `2d9d8ad` on master (64 files, 4878 insertions)

### Last Known Good State
- **Build Status:** ✅ Passing (`npm run build` — 19 routes, 0 errors)
- **Dev Server:** ✅ Tested and working (all pages + APIs)
- **Last Successful Command:** `git commit` — 2d9d8ad
- **Git State:** master, 2d9d8ad "feat: initial AiZaVseki website build"

### What Changed (Files Modified)
- `.env.local` — updated with real Supabase credentials
- `supabase-migration.sql` — run in Supabase SQL Editor (5 tables created)
- All 64 files committed to git

### Active Decisions
- Kept Tailwind v4 (default with Next.js 16) instead of downgrading to v3
- Using explicit type assertions for Supabase queries (generic types don't resolve properly with manual Database interface)
- Dark mode only — no next-themes
- All Bulgarian text centralized in constants.ts

### Known Issues
- middleware.ts deprecation warning: "middleware" convention is deprecated in Next.js 16, should use "proxy" — non-blocking
- No OG image (public/og-image.png) yet
- META_APP_SECRET and WEBHOOK_SECRET still empty in .env.local

### Next Steps (Priority Order)
1. Deploy to Vercel
2. Configure custom domain (aizavseki.eu)
3. Create OG image (1200x630)
4. Submit Meta app for review with legal page URLs

### ⚠️ DO NOT Touch
- src/app/api/data-deletion/route.ts — Meta signed_request verification logic is critical and tested
- src/lib/supabase/types.ts — Manual types with explicit Json type workaround for Supabase generics

---

## Session: 2026-02-09 (Initial Build)

### What Was Done
- Initialized Next.js 16.1.6 project with TypeScript, Tailwind v4, App Router, src directory
- Installed dependencies: framer-motion, @supabase/supabase-js, @supabase/ssr, lucide-react, react-intersection-observer, clsx, tailwind-merge
- Created complete design system (globals.css with CSS variables, glassmorphism, gradients, custom scrollbar)
- Created 10 UI components (Button, Card, Input, Badge, Skeleton, ScrollReveal, GlowText, TypewriterText, CountUp, ParticleBackground)
- Created 3 layout components (Navbar, Footer, PageTransition)
- Created Supabase integration layer (client.ts, server.ts, types.ts, middleware.ts)
- Created all 8 home page sections (Hero, Mission, Pillars, LatestPosts, Stats, HowItWorks, NewsletterCTA, SocialProof)
- Created blog system (PostCard, PostGrid, PillarFilter, PostContent, ShareButtons, blog listing, blog detail)
- Created all core pages (About, Newsletter, Contact, Resources)
- Created Meta-critical legal pages (Privacy Policy, Terms of Service, Data Deletion + Status)
- Created all 4 API routes (data-deletion, newsletter, contact, webhook/content)
- Created SEO files (sitemap.ts, robots.ts, not-found.tsx, loading.tsx)
- Updated next.config.ts with Cloudinary and Supabase image domains

### Last Known Good State
- **Build Status:** ✅ Passing (`npm run build` — 19 routes, 0 errors)
- **Dev Server:** Not tested yet
- **Last Successful Command:** `npm run build`
- **Git State:** initialized, remote added (origin → github.com/perofrfrfr/aizavseki), no commits yet

### What Changed (Files Modified)
- All files are new (greenfield build)
- ~50+ files created across src/app, src/components, src/lib, src/hooks

### Active Decisions
- Kept Tailwind v4 (default with Next.js 16) instead of downgrading to v3
- Using explicit type assertions for Supabase queries (generic types don't resolve properly with manual Database interface)
- Dark mode only — no next-themes
- All Bulgarian text centralized in constants.ts

### Known Issues
- Supabase project not yet created (user hit free tier limit, handling manually)
- .env.local has placeholder values for Supabase credentials
- middleware.ts deprecation warning: "middleware" convention is deprecated in Next.js 16, should use "proxy" — non-blocking
- No git commit yet
- No OG image (public/og-image.png) yet

### Next Steps (Priority Order)
1. Create Supabase project + run database migration
2. Update .env.local with real Supabase credentials
3. Test dev server with real Supabase connection
4. Create initial git commit
5. Deploy to Vercel
6. Configure custom domain (aizavseki.eu)
7. Submit Meta app for review

### ⚠️ DO NOT Touch
- src/app/api/data-deletion/route.ts — Meta signed_request verification logic is critical and tested
- src/lib/supabase/types.ts — Manual types with explicit Json type workaround for Supabase generics
