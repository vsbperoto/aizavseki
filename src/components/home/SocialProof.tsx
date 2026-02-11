import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Instagram } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Ambient blob (pink/purple to match Instagram) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-accent-pink/5 blur-[120px] animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 ring-1 ring-accent-pink/20 mb-6 animate-pulse [animation-duration:3s]">
            <Instagram className="h-8 w-8 text-accent-pink" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
            {"\u041F\u043E\u0441\u043B\u0435\u0434\u0432\u0430\u0439 \u043D\u0438 \u0432 Instagram"}
          </h2>
          <p className="mt-4 text-brand-gray text-lg">
            {"\u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u043E AI \u0441\u044A\u0434\u044A\u0440\u0436\u0430\u043D\u0438\u0435, \u0430\u0434\u0430\u043F\u0442\u0438\u0440\u0430\u043D\u043E \u0437\u0430 \u0442\u0435\u0431"}
          </p>
          <a
            href={SITE_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            <Instagram className="h-5 w-5" />
            @aizavseki
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
