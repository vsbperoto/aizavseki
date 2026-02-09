import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { PillarsShowcase } from "@/components/home/PillarsShowcase";
import { LatestPosts } from "@/components/home/LatestPosts";
import { StatsCounter } from "@/components/home/StatsCounter";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { SocialProof } from "@/components/home/SocialProof";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/supabase/types";

export default async function Home() {
  let posts: Post[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(6);

    posts = (data || []) as Post[];
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <>
      <HeroSection />
      <MissionSection />
      <PillarsShowcase />
      <LatestPosts posts={posts} />
      <StatsCounter />
      <HowItWorks />
      <NewsletterCTA />
      <SocialProof />
    </>
  );
}
