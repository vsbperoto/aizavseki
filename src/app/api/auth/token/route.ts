import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { FacebookToken } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("facebook_tokens")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No active token found" }, { status: 404 });
  }

  const token = data as FacebookToken;

  // Check expiry
  if (new Date(token.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Token expired", expires_at: token.expires_at },
      { status: 410 }
    );
  }

  return NextResponse.json({
    page_access_token: token.page_access_token,
    page_id: token.page_id,
    page_name: token.page_name,
    expires_at: token.expires_at,
  });
}
