import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const VALID_CONTENT_TYPES = ["definition", "howto", "comparison"];
const VALID_CATEGORIES = [
  "AI_BASICS", "AI_TOOLS", "AI_TIPS", "AI_BUSINESS",
  "AI_CREATIVE", "AI_DEVELOPMENT", "AI_ETHICS", "AI_TRENDS",
];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.WEBHOOK_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      content_type,
      category,
      content,
      meta_title,
      meta_description,
      key_takeaway,
      faq_items,
      target_keyword,
      secondary_keywords,
      image_url,
      image_alt_text,
      quality_score,
      related_resources,
    } = body;

    if (!title || !content_type || !category || !content) {
      return NextResponse.json(
        { error: "title, content_type, category, and content are required" },
        { status: 400 }
      );
    }

    if (!VALID_CONTENT_TYPES.includes(content_type)) {
      return NextResponse.json(
        { error: `content_type must be one of: ${VALID_CONTENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `category must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const supabase = await createServiceClient();

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from("resources")
      .select("id")
      .eq("slug", slug)
      .single();

    const finalSlug = existing
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    // Auto-calculate word count if not provided
    const wordCount = body.word_count
      ? Number(body.word_count)
      : content.split(/\s+/).filter(Boolean).length;

    const { error } = await supabase.from("resources").insert({
      slug: finalSlug,
      title,
      content_type,
      category,
      content,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      key_takeaway: key_takeaway || null,
      faq_items: faq_items || [],
      target_keyword: target_keyword || null,
      secondary_keywords: secondary_keywords || null,
      image_url: image_url || null,
      image_alt_text: image_alt_text || null,
      word_count: wordCount,
      quality_score: quality_score != null ? Number(quality_score) : null,
      related_resources: related_resources || null,
    });

    if (error) {
      console.error("Resource insert error:", error);
      return NextResponse.json(
        { error: "Failed to insert resource" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug: finalSlug });
  } catch (error) {
    console.error("Resource webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
