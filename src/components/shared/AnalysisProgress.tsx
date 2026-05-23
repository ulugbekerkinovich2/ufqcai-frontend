import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, FileSearch, BookOpen, Brain, ListChecks } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { api } from "@/api/client";

interface Step {
  key: string;
  label: string;
  hint: string;
  icon: any;
}

function fmtTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function AnalysisProgress({ startedAt }: { startedAt?: string }) {
  const { t } = useI18n();
  const [elapsed, setElapsed] = useState(0);

  const etaQ = useQuery({
    queryKey: ["analysis-eta"],
    queryFn: async () => (await api.get<{ avg_seconds: number; min_seconds: number; max_seconds: number; samples: number }>("/analyses/eta")).data,
    staleTime: 5 * 60 * 1000,
  });

  const avg = etaQ.data?.avg_seconds ?? 90;
  const samples = etaQ.data?.samples ?? 0;

  useEffect(() => {
    const start = startedAt ? new Date(startedAt).getTime() : Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const steps: Step[] = [
    { key: "parse", label: t("progress.parse"), hint: t("progress.parse_hint"), icon: FileSearch },
    { key: "rag", label: t("progress.rag"), hint: t("progress.rag_hint"), icon: BookOpen },
    { key: "ai", label: t("progress.ai"), hint: t("progress.ai_hint"), icon: Brain },
    { key: "save", label: t("progress.save"), hint: t("progress.save_hint"), icon: ListChecks },
  ];

  const ratio = elapsed / Math.max(avg, 30);
  let active = 0;
  if (ratio >= 0.05) active = 1;
  if (ratio >= 0.15) active = 2;
  if (ratio >= 0.95) active = 3;

  const remaining = Math.max(0, avg - elapsed);
  const overrun = elapsed > avg;
  const progressPct = Math.min(99, Math.round((elapsed / Math.max(avg, 30)) * 100));

  return (
    <div className="card p-10 animate-fade-in">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent-50 to-accent-100 grid place-items-center mx-auto relative">
            <Loader2 size={28} className="animate-spin text-accent" strokeWidth={1.75} />
            <span className="absolute inset-0 rounded-full ring-2 ring-accent/40 animate-ping" />
          </div>
        </div>
        <h2 className="font-serif text-2xl mt-5 text-ink">{t("analysis.running")}</h2>
        <div className="mt-2 inline-flex items-center gap-2 text-[13px] text-ink-muted flex-wrap justify-center">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
          {t("progress.elapsed")}: <span className="font-mono tabular-nums text-ink">{fmtTime(elapsed)}</span>
          <span className="text-ink-subtle">·</span>
          {overrun ? (
            <span className="text-ink-subtle">{t("progress.almost_done")}</span>
          ) : (
            <span className="text-ink-subtle">
              {t("progress.eta")}: <span className="font-mono tabular-nums text-ink-muted">{fmtTime(remaining)}</span>
              {samples > 0 && (
                <span className="text-[11px] ml-1.5 text-ink-subtle">({t("progress.based_on")} {samples})</span>
              )}
            </span>
          )}
        </div>

        <div className="mt-4 max-w-md mx-auto">
          <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-3">
        {steps.map((s, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <div
              key={s.key}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl transition-all ${
                current ? "bg-accent-50/60 ring-1 ring-accent/30" :
                done ? "bg-surface-sunken/50" :
                "opacity-50"
              }`}
            >
              <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${
                done ? "bg-accent text-white" :
                current ? "bg-accent-50 text-accent" :
                "bg-surface-sunken text-ink-subtle"
              }`}>
                {done ? <CheckCircle2 size={17} /> :
                 current ? <s.icon size={16} className="animate-pulse-soft" /> :
                 <s.icon size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[14.5px] font-medium ${current ? "text-accent-700" : done ? "text-ink" : "text-ink-muted"}`}>
                  {s.label}
                  {current && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11.5px] font-normal text-accent">
                      <Loader2 size={11} className="animate-spin" /> {t("common.loading")}
                    </span>
                  )}
                </div>
                <div className="text-[12.5px] text-ink-muted mt-0.5">{s.hint}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[12px] text-ink-subtle mt-8 max-w-md mx-auto">
        {t("progress.note")}
      </div>
    </div>
  );
}
