"use client";

import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
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
      color: "#1877F2",
    },
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Twitter",
      color: "#1DA1F2",
    },
    {
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "LinkedIn",
      color: "#0A66C2",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-brand-gray mr-1">Сподели:</span>
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-white/5"
          style={{ "--hover-color": btn.color } as React.CSSProperties}
          aria-label={`Сподели в ${btn.label}`}
        >
          <btn.icon className="h-4 w-4 hover:text-brand-cyan" />
        </a>
      ))}
      <button
        onClick={copyLink}
        className="rounded-lg p-2 text-brand-gray transition-colors hover:bg-white/5 hover:text-brand-cyan"
        aria-label="Копирай линк"
      >
        {copied ? (
          <Check className="h-4 w-4 text-accent-green" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
