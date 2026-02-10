# Session Log

> Append-only. Newest sessions at the top. Never delete old entries.

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
1. Git commit and push all v3 changes (local code)
2. Configure Supabase service role key in n8n Code nodes
3. Configure xAI API key credential in n8n
4. Manual test Scout workflow → verify topics in Supabase
5. Manual test main pipeline v3 → verify article publishes
6. Activate both workflows
7. Deploy to Vercel

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
