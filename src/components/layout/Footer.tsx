import Link from "next/link";
import { Sparkles, Instagram, Facebook } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-brand-cyan/10 bg-brand-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-brand-cyan" />
              <span className="font-display text-lg font-bold text-brand-white">
                Ai<span className="text-brand-cyan">Za</span>Vseki
              </span>
            </Link>
            <p className="text-sm text-brand-gray leading-relaxed max-w-xs">
              {SITE_CONFIG.description}. AI новини, инструменти и съвети на български.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-brand-cyan/10 hover:text-brand-cyan"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-brand-cyan/10 hover:text-brand-cyan"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-brand-gray-light">
              Ресурси
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray transition-colors hover:text-brand-cyan"
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
              Компания
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray transition-colors hover:text-brand-cyan"
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
              Правна информация
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray transition-colors hover:text-brand-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-brand-cyan/10 pt-8 text-center">
          <p className="text-sm text-brand-gray">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Всички права запазени.
          </p>
        </div>
      </div>
    </footer>
  );
}
