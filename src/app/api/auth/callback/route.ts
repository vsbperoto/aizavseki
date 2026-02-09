import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  getUserInfo,
  getAllPages,
} from "@/lib/facebook/oauth";
import { createAdminSession } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/server";

const ADMIN_URL = "/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    const reason = error || "no_code";
    return NextResponse.redirect(new URL(`${ADMIN_URL}?error=${reason}`, request.url));
  }

  try {
    // Exchange code → short-lived token → long-lived token
    const shortToken = await exchangeCodeForToken(code);
    const { token: longToken, expiresIn } = await exchangeForLongLivedToken(shortToken);

    // Verify admin identity
    const user = await getUserInfo(longToken);
    if (user.id !== process.env.ADMIN_FACEBOOK_ID) {
      return NextResponse.redirect(new URL(`${ADMIN_URL}?error=unauthorized`, request.url));
    }

    // Fetch all pages
    const pages = await getAllPages(longToken);
    if (pages.length === 0) {
      return NextResponse.redirect(new URL(`${ADMIN_URL}?error=no_pages`, request.url));
    }

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Upsert each page into facebook_tokens
    const supabase = await createServiceClient();
    for (const page of pages) {
      await supabase
        .from("facebook_tokens")
        .upsert(
          {
            user_id: user.id,
            user_name: user.name,
            page_id: page.id,
            page_name: page.name,
            page_access_token: page.access_token,
            user_access_token: longToken,
            token_type: "long_lived",
            scopes: "pages_manage_posts,pages_read_engagement",
            expires_at: expiresAt,
          },
          { onConflict: "page_id" }
        );
    }

    // Create encrypted session cookie
    const sessionValue = createAdminSession(user.id);
    const response = NextResponse.redirect(new URL(ADMIN_URL, request.url));
    response.cookies.set("fb_admin_session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 24 * 60 * 60, // 60 days in seconds
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.redirect(
      new URL(`${ADMIN_URL}?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
