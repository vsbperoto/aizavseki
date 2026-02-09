import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/auth/session";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("fb_admin_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const session = validateAdminSession(sessionCookie);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await request.json();
  const pageId = body.page_id;
  if (!pageId || typeof pageId !== "string") {
    return NextResponse.json({ error: "Missing page_id" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Deactivate all pages
  await supabase
    .from("facebook_tokens")
    .update({ is_active: false })
    .neq("page_id", "");

  // Activate the selected page
  const { data, error } = await supabase
    .from("facebook_tokens")
    .update({ is_active: true })
    .eq("page_id", pageId)
    .select("page_id, page_name, is_active")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
