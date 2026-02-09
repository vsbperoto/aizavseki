import { cn } from "@/lib/utils";
import { PILLARS, type PillarKey } from "@/lib/constants";

interface BadgeProps {
  pillar: PillarKey;
  className?: string;
}

export function Badge({ pillar, className }: BadgeProps) {
  const config = PILLARS[pillar];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-heading",
        className
      )}
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      {config.label}
    </span>
  );
}
