"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";
import { ParticleField } from "@/components/animation/ParticleField";
import { ProgressRail } from "@/components/layout/ProgressRail";
import { useProjectStore } from "@/lib/state/project-store";
import { isStepUnlocked, statusIndex, stepRoutes } from "@/lib/state/transitions";
import { formatDate } from "@/lib/utils/dates";

export function AppShell({ children, mode = "ambient" }: { children: React.ReactNode; mode?: string }) {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useProjectStore.persist.onFinishHydration(() => setHydrated(true));
    queueMicrotask(() => setHydrated(useProjectStore.persist.hasHydrated()));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hydrated && !project) router.replace("/app");
  }, [hydrated, project, router]);

  if (!hydrated) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-16 md:px-8">
        <p className="text-sm uppercase tracking-[0.12em] text-ink-muted">Считывается локальное досье...</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-16 md:px-8">
        <p>Проект не найден.</p>
        <Link className="underline" href="/app">
          Вернуться к созданию проекта
        </Link>
      </main>
    );
  }

  const routeStep = [...stepRoutes].reverse().find((step) => pathname.endsWith(`/${step.href}`));
  const nextStep = stepRoutes.find((step) => statusIndex(step.key) > statusIndex(project.status)) ?? stepRoutes[stepRoutes.length - 1];
  const nextUnlocked = isStepUnlocked(project, nextStep.href);
  const currentStep =
    routeStep ?? [...stepRoutes].reverse().find((step) => statusIndex(project.status) >= statusIndex(step.key)) ?? stepRoutes[0];

  return (
    <main className="relative mx-auto min-h-[78vh] max-w-7xl px-4 py-8 md:px-8">
      <ParticleField mode={mode} />
      <div className="mb-6 grid gap-4 border border-black/15 bg-paper/75 p-4 shadow-[5px_5px_0_rgba(23,20,17,0.08)] md:grid-cols-[1fr_280px] md:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Текущее досье / {currentStep.label}</p>
          <h1 className="mt-2 max-w-4xl font-display text-5xl leading-[0.9] md:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">{project.rawProblem}</p>
        </div>
        <div className="border border-black/15 bg-card p-4">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-ink-muted">
            <Clock3 size={14} /> Следующее действие
          </p>
          {nextUnlocked ? (
            <Link
              href={`/app/project/${project.id}/${nextStep.href}`}
              className="mt-4 flex items-center justify-between gap-4 border-t border-black/15 pt-4 text-sm uppercase tracking-[0.08em] hover:text-stamp"
            >
              {nextStep.label}
              <ArrowRight size={16} />
            </Link>
          ) : (
            <p className="mt-4 border-t border-black/15 pt-4 text-sm uppercase tracking-[0.08em] text-ink">
              Выполните действие на текущем листе
            </p>
          )}
          <p className="mt-4 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted">Обновлено: {formatDate(project.updatedAt)}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="order-1 lg:order-2">{children}</div>
        <div className="order-2 lg:order-1">
          <ProgressRail project={project} />
        </div>
      </div>
    </main>
  );
}
