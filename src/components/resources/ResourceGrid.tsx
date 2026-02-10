import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/lib/supabase/types";

interface ResourceGridProps {
  resources: Resource[];
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-brand-gray text-lg">
          Няма намерени ресурси.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
