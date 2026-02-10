import { cn } from "@/lib/utils";
import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    const errorId = useId();

    return (
      <div className="w-full">
        <input
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-xl bg-brand-navy/80 border px-4 py-3 text-brand-white placeholder:text-brand-gray/60",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50 focus-visible:border-brand-cyan",
            error
              ? "border-red-500/50"
              : "border-brand-cyan/10 hover:border-brand-cyan/30",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
