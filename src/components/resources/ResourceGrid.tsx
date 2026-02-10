import { ResourceCard } from "./ResourceCard";

interface ResourceGridProps {
  resources: {
    id: string;
    slug: string;
    title: string;
    content_type: string;
    category: string;
    key_takeaway: string | null;
    word_count: number;
    quality_score: number | null;
    views: number;
    published_at: string;
  }[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  searchQuery?: string;
}

export function ResourceGrid({ resources, totalCount, currentPage, perPage, searchQuery }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-brand-gray text-lg">
          {searchQuery
            ? `\u041D\u044F\u043C\u0430 \u0440\u0435\u0437\u0443\u043B\u0442\u0430\u0442\u0438 \u0437\u0430 \u201E${searchQuery}\u201C`
            : "\u041D\u044F\u043C\u0430 \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438."}
        </p>
      </div>
    );
  }

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalCount);

  return (
    <div>
      <p className="text-sm text-brand-gray/60 mb-6">
        {searchQuery
          ? `${totalCount} \u0440\u0435\u0437\u0443\u043B\u0442\u0430\u0442\u0430 \u0437\u0430 \u201E${searchQuery}\u201C`
          : `\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u0438 ${start}\u2013${end} \u043E\u0442 ${totalCount} \u0440\u0435\u0441\u0443\u0440\u0441\u0430`}
      </p>
      <div id="resources-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
