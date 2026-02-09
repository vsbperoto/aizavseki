"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-brand-dark/80 backdrop-blur-xl border-b border-brand-cyan/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Sparkles className="h-6 w-6 text-brand-cyan transition-transform group-hover:rotate-12" />
              <span className="font-display text-xl font-bold text-brand-white">
                Ai<span className="text-brand-cyan">Za</span>Vseki
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-brand-cyan bg-brand-cyan/10"
                      : "text-brand-gray hover:text-brand-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="ml-3 rounded-full bg-gradient-to-r from-brand-cyan to-accent-purple px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                Абонирай се
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-lg p-2 text-brand-gray hover:text-brand-white md:hidden"
              aria-label={isMobileOpen ? "Затвори менюто" : "Отвори менюто"}
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-2xl font-heading font-semibold transition-colors",
                      pathname === link.href
                        ? "text-brand-cyan"
                        : "text-brand-gray hover:text-brand-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.1 }}
              >
                <Link
                  href="/newsletter"
                  className="mt-4 rounded-full bg-gradient-to-r from-brand-cyan to-accent-purple px-8 py-3 text-lg font-semibold text-white"
                >
                  Абонирай се
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
