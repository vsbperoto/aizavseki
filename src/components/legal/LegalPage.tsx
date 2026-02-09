import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-brand-dark py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyan/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад към начало</span>
        </Link>

        <div className="glass p-8 md:p-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
            {title}
          </h1>
          <p className="text-brand-gray text-sm mb-8">
            Последна актуализация: {lastUpdated}
          </p>

          <div className="prose prose-invert prose-cyan max-w-none">
            <div className="space-y-8 text-brand-gray leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
