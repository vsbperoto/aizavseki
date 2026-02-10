import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aizavseki.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/resources",
    "/resources/rechnik",
    "/newsletter",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/data-deletion",
  ];

  const pillarPages = [
    "/blog/ai-novini",
    "/blog/ai-instrumenti",
    "/blog/ai-saveti",
    "/blog/ai-za-biznes",
    "/blog/ai-zabavlenia",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const pillarEntries: MetadataRoute.Sitemap = pillarPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
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

  let resourceEntries: MetadataRoute.Sitemap = [];
  try {
    const { createClient: createClient2 } = await import("@/lib/supabase/server");
    const supabase2 = await createClient2();
    const { data: resources } = await supabase2
      .from("resources")
      .select("slug, updated_at")
      .order("published_at", { ascending: false });

    const resourceList = (resources || []) as { slug: string; updated_at: string }[];

    resourceEntries = resourceList.map((r) => ({
      url: `${BASE_URL}/resources/${r.slug}`,
      lastModified: new Date(r.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase not configured
  }

  return [...staticEntries, ...pillarEntries, ...blogEntries, ...resourceEntries];
}
