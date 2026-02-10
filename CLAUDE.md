# AiZaVseki (АИ За Всеки) — Project Context

## Overview
AI education platform for Bulgarian audiences. Next.js 16 app with automated content pipeline.
- **Live**: https://aizavseki.eu
- **Admin**: https://aizavseki.eu/admin
- **Repo**: github.com/perofrfrfr/aizavseki
- **Hosting**: Vercel
- **Database**: Supabase (`ogdeziynjtxglhbuctgb`)

## Tech Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Supabase (auth, DB, storage)
- Framer Motion (animations)
- Facebook/Instagram OAuth + Graph API
- n8n (automated content workflow at perotodigital.duckdns.org)

## Architecture

### Content Pipeline (Automated via n8n)
1. Daily at 09:00 Sofia time
2. Grok searches X/Twitter for Bulgarian AI trends
3. Gemini generates bilingual content (BG) with Search Grounding
4. Gemini Pro Image creates branded visuals
5. Cloudinary hosts images
6. Posts to Instagram + Facebook via Graph API
7. Syncs to website via POST /api/webhook/content

### OAuth Flow (Meta App Review: PENDING)
1. Admin visits /admin → "Sign in with Facebook"
2. Meta redirects to /api/auth/callback
3. Callback stores long-lived tokens in Supabase `facebook_tokens` table
4. Admin selects active Page from dashboard
5. n8n calls GET /api/auth/token with Bearer {ADMIN_SECRET}
6. Returns { page_access_token, page_id, page_name, expires_at }

### Key API Routes
- `GET  /api/auth/login` — Initiates Facebook OAuth
- `GET  /api/auth/callback` — OAuth callback, stores tokens
- `GET  /api/auth/token` — Returns active page token (for n8n)
- `POST /api/auth/set-active` — Sets active Facebook Page
- `GET  /api/auth/status` — Check auth status
- `POST /api/webhook/content` — Receives content from n8n
- `POST /api/contact` — Contact form
- `POST /api/newsletter` — Newsletter signup
- `POST /api/data-deletion` — GDPR data deletion

## Credentials (in .env.local)
- `META_APP_ID` / `META_APP_SECRET` — Facebook app credentials
- `ADMIN_SECRET` — Bearer token for n8n → /api/auth/token
- `ADMIN_FACEBOOK_ID` — Allowed admin Facebook user
- `WEBHOOK_SECRET` — HMAC for /api/webhook/content
- Supabase URL + keys (anon + service role)

## MCP Servers Available
- **supabase**: Full DB access via `mcp__supabase__execute_sql`
- **n8n-mcp**: Workflow management at perotodigital.duckdns.org

## Database Tables (Supabase)
- `posts` — Blog content (title, slug, content_bg, pillar, image_url, etc.)
- `facebook_tokens` — OAuth tokens (user_id, page_id, page_access_token, expires_at, is_active)
- `newsletter_subscribers` — Email subscriptions
- `contact_submissions` — Contact form entries
- `data_deletion_requests` — GDPR deletion tracking

## Current Status
- ✅ Website live with all pages
- ✅ Admin panel built
- ✅ Meta App Review submitted (waiting 1-5 business days)
- ⚠️ OAuth flow blocked until Meta approves
- ⚠️ n8n workflow needs /api/auth/token integration (currently uses hardcoded token)

## Commands
```bash
npm run dev      # Local development
npm run build    # Production build
npm run lint     # ESLint
git push         # Auto-deploys to Vercel
```

## Important Notes
- All content is in Bulgarian (BG)
- Meta permissions needed: pages_read_engagement, pages_manage_posts, instagram_basic, instagram_content_publish
- The n8n instance runs on a local server exposed via DuckDNS
- Cloudinary is used for image CDN (configured in n8n, not in Next.js)
