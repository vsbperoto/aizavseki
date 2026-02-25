"use client";

import { ResourceCard } from "./ResourceCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { Frown } from "lucide-react";

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

export function ResourceGrid({
  resources,
  searchQuery,
}: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 ring-4 ring-zinc-800/50">
          <Frown className="w-10 h-10 text-zinc-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {searchQuery
            ? `${"\u041D\u044F\u043C\u0430 \u0440\u0435\u0437\u0443\u043B\u0442\u0430\u0442\u0438 \u0437\u0430"} \u201E${searchQuery}\u201C`
            : "\u041D\u044F\u043C\u0430 \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"}
        </h3>
        <p className="text-zinc-400 max-w-md mx-auto">
          {"\u041E\u043F\u0438\u0442\u0430\u0439\u0442\u0435 \u0441 \u0434\u0440\u0443\u0433\u0438 \u043A\u043B\u044E\u0447\u043E\u0432\u0438 \u0434\u0443\u043C\u0438 \u0438\u043B\u0438 \u0438\u0437\u0447\u0438\u0441\u0442\u0435\u0442\u0435 \u0444\u0438\u043B\u0442\u0440\u0438\u0442\u0435."}
        </p>
      </motion.div>
    );
  }

  return (
    <div>

      <div
        id="resources-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
      >
        {resources.map((resource, index) => (
          <ScrollReveal
            key={resource.id}
            delay={Math.min(index * 0.05, 0.6)}
            className="h-full"
          >
            <ResourceCard resource={resource} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
