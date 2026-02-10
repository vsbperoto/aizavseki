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
    <div className="max-w-none">
      {slide_titles.map((title, index) => (
        <div key={index} className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
            {title}
          </h2>

          {slide_texts[index] && (
            <div className="text-brand-gray-light leading-relaxed text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_a]:text-brand-cyan [&_a]:underline [&_strong]:font-bold [&_strong]:text-brand-white [&_p]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-cyan/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-brand-gray [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_th]:text-left [&_th]:text-brand-white [&_th]:font-semibold [&_th]:pb-2 [&_th]:pr-4 [&_th]:border-b [&_th]:border-brand-cyan/20 [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-brand-navy-light [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-white [&_h3]:mt-6 [&_h3]:mb-3">
              <Markdown remarkPlugins={[remarkGfm]}>
                {slide_texts[index]
                  .replace(/\\n/g, '\n')
                  .replace(/\\t/g, '\t')
                  .replace(/\\r/g, '')}
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
