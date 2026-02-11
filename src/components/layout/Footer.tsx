import Link from "next/link";
import { Sparkles, Instagram, Facebook } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-brand-dark to-brand-navy/30">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="rounded-xl bg-brand-navy/20 p-4 -m-4 mb-0">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-brand-cyan" />
                <span className="font-display text-lg font-bold text-brand-white">
                  Ai<span className="text-brand-cyan">Za</span>Vseki
                </span>
              </Link>
              <p className="text-sm text-brand-gray leading-relaxed max-w-xs">
                {SITE_CONFIG.description}. AI {"\u043D\u043E\u0432\u0438\u043D\u0438, \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438 \u0438 \u0441\u044A\u0432\u0435\u0442\u0438 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438."}
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href={SITE_CONFIG.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-brand-gray transition-all hover:bg-brand-cyan/10 hover:text-brand-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={SITE_CONFIG.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-brand-gray transition-all hover:bg-brand-cyan/10 hover:text-brand-cyan hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-brand-gray-light">
              {"\u0420\u0435\u0441\u0443\u0440\u0441\u0438"}
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray transition-all hover:text-brand-cyan hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-brand-gray-light">
              {"\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F"}
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray transition-all hover:text-brand-cyan hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-brand-gray-light">
              {"\u041F\u0440\u0430\u0432\u043D\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F"}
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray transition-all hover:text-brand-cyan hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-brand-cyan/10 to-transparent mb-8" />
          <p className="text-sm text-brand-gray">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. {"\u0412\u0441\u0438\u0447\u043A\u0438 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u043F\u0430\u0437\u0435\u043D\u0438."}
          </p>
        </div>
      </div>
    </footer>
  );
}
