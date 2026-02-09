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
