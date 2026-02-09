import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-brand-navy/80 border px-4 py-3 text-brand-white placeholder:text-brand-gray/60",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan",
            error
              ? "border-red-500/50"
              : "border-brand-cyan/10 hover:border-brand-cyan/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
