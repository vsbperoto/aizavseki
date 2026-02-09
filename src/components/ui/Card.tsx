import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
