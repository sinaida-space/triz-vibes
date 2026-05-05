"use client";

import Link from "next/link";
import { Check, Circle, FileSearch } from "lucide-react";
import { isStepUnlocked, statusIndex, stepRoutes } from "@/lib/state/transitions";
import type { ProjectSession } from "@/lib/triz/types";
import { cn } from "@/lib/utils/cn";

export function ProgressRail({ project }: { project: ProjectSession }) {
  const current = statusIndex(project.status);
  return (
    <aside className="sticky top-24 h-fit border border-black/15 bg-card p-4 shadow-[6px_6px_0_rgba(23,20,17,0.08)]">
      <div className="mb-5 flex items-center gap-3 border-b border-black/15 pb-4">
        <FileSearch size={18} className="text-stamp" />
        <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Досье / ход работы</p>
      </div>
      <ol className="relative space-y-2 before:absolute before:left-[18px] before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-black/15">
        {stepRoutes.map((step) => {
          const done = current >= statusIndex(step.key);
          const unlocked = isStepUnlocked(project, step.href);
          const content = (
            <>
              <span className="flex h-6 w-6 items-center justify-center bg-card">
                {done ? <Check size={15} className="text-stamp" /> : <Circle size={14} />}
              </span>
              <span>{step.label}</span>
            </>
          );
          return (
            <li key={step.href}>
              {unlocked ? (
                <Link
                  href={`/app/project/${project.id}/${step.href}`}
                  className={cn(
                    "relative z-10 flex items-center gap-3 border border-transparent bg-card px-3 py-2 text-xs uppercase tracking-[0.08em] transition",
                    done ? "text-ink" : "text-ink-muted",
                    "hover:border-black/20 hover:bg-paper hover:translate-x-1"
                  )}
                >
                  {content}
                </Link>
              ) : (
                <span className="relative z-10 flex cursor-not-allowed items-center gap-3 border border-transparent bg-card px-3 py-2 text-xs uppercase tracking-[0.08em] text-ink-muted opacity-55">
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
