# Session Log

> Append-only. Newest sessions at the top. Never delete old entries.

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
