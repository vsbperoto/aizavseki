import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  // Verify Bearer token
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.WEBHOOK_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      pillar,
      content,
      caption,
      hashtags,
      image_urls,
      hook,
      instagram_post_id,
      facebook_post_id,
    } = body;

    if (!title || !pillar || !content) {
      return NextResponse.json(
        { error: "title, pillar, and content are required" },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const supabase = await createServiceClient();

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .single();

    const finalSlug = existing
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    const { error } = await supabase.from("posts").insert({
      slug: finalSlug,
      title,
      pillar,
      content,
      caption: caption || null,
      hashtags: hashtags || null,
      image_urls: image_urls || null,
      hook: hook || null,
      instagram_post_id: instagram_post_id || null,
      facebook_post_id: facebook_post_id || null,
    });

    if (error) {
      console.error("Webhook content insert error:", error);
      return NextResponse.json(
        { error: "Failed to insert post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug: finalSlug });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
