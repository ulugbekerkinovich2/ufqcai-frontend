import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";
import { useI18n } from "@/lib/i18n";

const MAP: Record<string, { cls: string; dot: string }> = {
  None: { cls: "bg-risk-none-bg text-risk-none-fg", dot: "bg-risk-none-dot" },
  Low: { cls: "bg-risk-low-bg text-risk-low-fg", dot: "bg-risk-low-dot" },
  Medium: { cls: "bg-risk-medium-bg text-risk-medium-fg", dot: "bg-risk-medium-dot" },
  High: { cls: "bg-risk-high-bg text-risk-high-fg", dot: "bg-risk-high-dot" },
};

export function RiskBadge({ level, size = "md" }: { level?: RiskLevel | string; size?: "sm" | "md" }) {
  const { t } = useI18n();
  const key = (level || "None") as string;
  const info = MAP[key] || MAP.None;
  return (
    <span className={cn("chip", info.cls, size === "sm" && "text-[11px] py-0")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", info.dot)} />
      {t(`risk.${key}`)}
    </span>
  );
}
