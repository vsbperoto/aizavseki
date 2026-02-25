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
      meta_title,
      meta_description,
      key_takeaway,
      faq_items,
      image_alt_text,
      quality_score,
      word_count,
      target_keyword,
      internal_links_used,
      keywords,
    } = body;

    if (!title || !pillar || !content) {
      return NextResponse.json(
        { error: "title, pillar, and content are required" },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const supabase = await createServiceClient();

    // Handle base64 image upload to Supabase Storage
    let finalImageUrls = image_urls || null;
    if (body.image_base64) {
      const buffer = Buffer.from(body.image_base64, "base64");
      const filename = `posts/${slug}-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filename, buffer, {
          contentType: body.image_content_type || "image/png",
          upsert: false,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filename);
        finalImageUrls = [urlData.publicUrl, ...(image_urls || [])];
      } else {
        console.error("Image upload error:", uploadError);
      }
    }

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
      image_urls: finalImageUrls,
      hook: hook || null,
      instagram_post_id: instagram_post_id || null,
      facebook_post_id: facebook_post_id || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      key_takeaway: key_takeaway || null,
      faq_items: faq_items || null,
      image_alt_text: image_alt_text || null,
      quality_score: quality_score != null ? Number(quality_score) : null,
      word_count: word_count != null ? Number(word_count) : null,
      target_keyword: target_keyword || null,
      internal_links_used: internal_links_used || null,
      keywords: Array.isArray(keywords) ? keywords : null,
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
