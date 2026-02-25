"use client";

import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_CONFIG.url}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const buttons = [
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Facebook",
    },
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Twitter",
    },
    {
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "LinkedIn",
    },
  ];

  return (
    <div className="rounded-xl border border-brand-white/5 bg-brand-navy/30 backdrop-blur-sm p-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-brand-gray mr-1">
          {"\u0421\u043F\u043E\u0434\u0435\u043B\u0438:"}
        </span>
        {buttons.map((btn) => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2.5 text-brand-gray transition-all duration-200 hover:bg-brand-white/10 hover:text-brand-cyan hover:scale-110"
            aria-label={`\u0421\u043F\u043E\u0434\u0435\u043B\u0438 \u0432 ${btn.label}`}
          >
            <btn.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          onClick={copyLink}
          className="rounded-lg p-2.5 text-brand-gray transition-all duration-200 hover:bg-brand-white/10 hover:text-brand-cyan hover:scale-110"
          aria-label={"\u041A\u043E\u043F\u0438\u0440\u0430\u0439 \u043B\u0438\u043D\u043A"}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-4 w-4 text-accent-green" />
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Link2 className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
