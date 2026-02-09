import { PostCard } from "./PostCard";
import type { Post } from "@/lib/supabase/types";

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-brand-gray text-lg">
          Няма намерени публикации.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
