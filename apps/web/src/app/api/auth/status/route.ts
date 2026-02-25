import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/server";
import type { FacebookToken } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("fb_admin_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const session = validateAdminSession(sessionCookie);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("facebook_tokens")
    .select("*")
    .order("page_name");

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const tokens = (data || []) as FacebookToken[];
  const now = new Date();

  const pages = tokens.map((token) => {
    const expiresAt = new Date(token.expires_at);
    const daysUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      page_name: token.page_name,
      page_id: token.page_id,
      is_active: token.is_active,
      expires_at: token.expires_at,
      days_until_expiry: daysUntilExpiry,
      is_valid: expiresAt > now,
    };
  });

  return NextResponse.json({ pages });
}
