import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlowTextProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export function GlowText({
  as: Tag = "span",
  className,
  children,
  ...props
}: GlowTextProps) {
  return (
    <Tag
      className={cn("text-glow-cyan text-brand-cyan", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
