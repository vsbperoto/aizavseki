import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AI_BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Bingbot", "ChatGPT-User"];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host");

  // Multi-tenant rewrite: If the user visits the agent subdomain, route them to our custom UI
  if (
    hostname === "agent.aizavseki.eu" &&
    !url.pathname.startsWith("/agent") &&
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/_next")
  ) {
    url.pathname = `/agent${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Log AI bot visits
  const ua = request.headers.get("user-agent") || "";
  const matchedBot = AI_BOTS.find((bot) => ua.includes(bot));
  if (matchedBot) {
    console.log(`[AI Bot] ${matchedBot} visited ${request.nextUrl.pathname}`);
  }

  let supabaseResponse = NextResponse.next({ request });

  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
