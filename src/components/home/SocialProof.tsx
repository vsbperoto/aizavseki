import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Instagram } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <Instagram className="mx-auto h-10 w-10 text-brand-cyan mb-6" />
          <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
            Последвай ни в Instagram
          </h2>
          <p className="mt-4 text-brand-gray text-lg">
            Ежедневно AI съдържание, адаптирано за теб
          </p>
          <a
            href={SITE_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            <Instagram className="h-5 w-5" />
            @aizavseki
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
