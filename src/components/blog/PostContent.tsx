import type { PostContent as PostContentType } from "@/lib/supabase/types";

interface PostContentProps {
  content: PostContentType;
  imageUrls?: string[] | null;
}

export function PostContent({ content, imageUrls }: PostContentProps) {
  const { slide_titles = [], slide_texts = [] } = content;

  return (
    <div className="prose prose-invert max-w-none">
      {slide_titles.map((title, index) => (
        <div key={index} className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
            {title}
          </h2>

          {slide_texts[index] && (
            <p className="text-brand-gray-light leading-relaxed text-lg">
              {slide_texts[index]}
            </p>
          )}

          {imageUrls?.[index] && (
            <div className="mt-4 overflow-hidden rounded-xl">
              <img
                src={imageUrls[index]}
                alt={title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}

      {/* If there's a caption without slides, render as paragraph */}
      {slide_titles.length === 0 && slide_texts.length === 0 && (
        <p className="text-brand-gray-light leading-relaxed text-lg">
          Съдържанието скоро ще бъде добавено.
        </p>
      )}
    </div>
  );
}
