# AiZaVseki — Task List

## Completed
- [x] Project initialization (Next.js 16, TypeScript, Tailwind v4)
- [x] Design system (CSS variables, glassmorphism, gradients)
- [x] UI components (Button, Card, Input, Badge, Skeleton, ScrollReveal, etc.)
- [x] Layout components (Navbar, Footer, PageTransition)
- [x] Supabase client integration (client.ts, server.ts, types.ts, middleware.ts)
- [x] Home page with all 8 sections
- [x] Blog system (listing, detail, filters, content renderer)
- [x] Core pages (About, Newsletter, Contact, Resources)
- [x] Legal pages (Privacy Policy, Terms of Service, Data Deletion)
- [x] API routes (data-deletion, newsletter, contact, webhook/content)
- [x] SEO (sitemap, robots, 404, loading)
- [x] Production build passing (0 errors)
- [x] Create Supabase project + configure credentials
- [x] Run database migration (5 tables + RLS)
- [x] Update .env.local with real Supabase credentials
- [x] Test dev server with live Supabase
- [x] Initial git commit (2d9d8ad)
- [x] Facebook OAuth admin panel — SQL migration, types, OAuth helpers, session encryption, 5 API routes, admin dashboard
- [x] LLMO/GEO Content Pipeline — types, webhook upgrade, PostContent markdown, FaqSection, key_takeaway box, triple JSON-LD, react-markdown
- [x] n8n workflow created (AiZaVseki LLMO Content Pipeline v2 — ID: Rs3zNLx8hSSTgw47)

## Pending
- [x] Run `tasks/migrations/add_llmo_columns.sql` in Supabase (4 new post columns) — done via MCP
- [x] Fix n8n workflow: replace `fetch()` with `this.helpers.httpRequest()` + Cloudinary upload
- [x] Fix n8n workflow: add `continueOnFail` on Generate Image node
- [ ] ~~Create "images" storage bucket in Supabase~~ — No longer needed (using Cloudinary instead)
- [ ] Configure n8n credentials: Google Gemini API key + Anthropic API key
- [ ] Manual test of n8n LLMO workflow (Rs3zNLx8hSSTgw47)
- [ ] Activate n8n workflow for daily 8AM schedule
- [ ] Run `supabase-migration-facebook-tokens.sql` in Supabase SQL Editor
- [ ] Fill env vars: META_APP_ID, META_APP_SECRET, ADMIN_SECRET, ADMIN_FACEBOOK_ID
- [ ] Add OAuth redirect URIs in Facebook App settings
- [ ] Test full OAuth flow end-to-end
- [ ] Create OG image (1200x630)
- [ ] Deploy to Vercel
- [ ] Configure custom domain (aizavseki.eu)
- [ ] Submit Meta app for review with legal page URLs
