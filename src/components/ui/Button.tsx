"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-heading font-semibold rounded-full transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:ring-offset-2 focus:ring-offset-brand-dark",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && [
            "bg-gradient-to-r from-brand-cyan to-accent-purple text-white",
            "hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]",
            "active:scale-95",
          ],
          variant === "secondary" && [
            "border border-brand-cyan/30 text-brand-cyan bg-transparent",
            "hover:bg-brand-cyan/10 hover:border-brand-cyan/60",
            "active:scale-95",
          ],
          variant === "ghost" && [
            "text-brand-gray hover:text-brand-white bg-transparent",
            "hover:bg-white/5",
          ],
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
