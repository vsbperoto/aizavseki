import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aizavseki.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/resources",
    "/newsletter",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/data-deletion",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, published_at")
      .order("published_at", { ascending: false });

    const posts = (data || []) as { slug: string; published_at: string }[];

    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // Supabase not configured
  }

  return [...staticEntries, ...blogEntries];
}
