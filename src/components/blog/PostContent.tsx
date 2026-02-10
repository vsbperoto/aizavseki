import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PostContent as PostContentType } from "@/lib/supabase/types";

interface PostContentProps {
  content: PostContentType;
  imageUrls?: string[] | null;
  imageAltText?: string | null;
}

export function PostContent({ content, imageUrls, imageAltText }: PostContentProps) {
  const { slide_titles = [], slide_texts = [] } = content;

  return (
    <div className="prose prose-invert max-w-none">
      {slide_titles.map((title, index) => (
        <div key={index} className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
            {title}
          </h2>

          {slide_texts[index] && (
            <div className="text-brand-gray-light leading-relaxed text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-brand-cyan [&_a]:underline [&_strong]:font-bold [&_strong]:text-brand-white [&_p]:mb-4">
              <Markdown remarkPlugins={[remarkGfm]}>
                {slide_texts[index]}
              </Markdown>
            </div>
          )}

          {imageUrls?.[index] && (
            <div className="mt-4 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={imageUrls[index]}
                alt={imageAltText || title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}

      {slide_titles.length === 0 && slide_texts.length === 0 && (
        <p className="text-brand-gray-light leading-relaxed text-lg">
          Съдържанието скоро ще бъде добавено.
        </p>
      )}
    </div>
  );
}
