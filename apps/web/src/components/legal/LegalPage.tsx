import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="relative min-h-screen py-16 px-4">
      {/* Ambient background (subtle for legal pages) */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/3 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/3 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-brand-cyan hover:text-brand-cyan-bright transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{"\u041D\u0430\u0437\u0430\u0434 \u043A\u044A\u043C \u043D\u0430\u0447\u0430\u043B\u043E"}</span>
        </Link>

        <ScrollReveal>
          <div className="glass p-8 md:p-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
              {title}
            </h1>
            <p className="text-brand-gray text-sm mb-8">
              {"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0430 \u0430\u043A\u0442\u0443\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F:"} {lastUpdated}
            </p>

            <div className="max-w-none space-y-8 text-brand-gray leading-relaxed [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-white [&_h2]:mb-4 [&_strong]:font-semibold [&_strong]:text-brand-white [&_a]:text-brand-cyan [&_a]:hover:text-brand-cyan-bright [&_a]:transition-colors [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-brand-gray [&_section]:border-l-2 [&_section]:border-brand-cyan/10 [&_section]:pl-6">
              {children}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
