"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Copy, Printer, Trash2 } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import { buildProjectMap, mapToMarkdown } from "@/lib/triz/formatters";
import { formatDate } from "@/lib/utils/dates";

export default function ProjectMapPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const exportProject = useProjectStore((state) => state.exportProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  if (!project) {
    return (
      <AppShell>
        <div />
      </AppShell>
    );
  }

  if (!project.validation) {
    return (
      <AppShell mode="validation">
        <PaperCard eyebrow="07 Карта проекта" title="Карта ещё не закрыта" stamp="Нет допуска">
          <p className="max-w-2xl text-sm leading-7 text-ink-muted">
            Финальная карта открывается после проверки: система должна отличить устранение противоречия от аккуратного компромисса.
          </p>
          <MechanicalButton className="mt-6" onClick={() => router.push(`/app/project/${params.id}/validation`)}>
            Вернуться к проверке <ArrowRight size={16} />
          </MechanicalButton>
        </PaperCard>
      </AppShell>
    );
  }

  const map = buildProjectMap(project);

  async function copyMarkdown() {
    if (!project) return;
    await navigator.clipboard.writeText(mapToMarkdown(project));
    exportProject(project.id);
  }

  function remove() {
    if (!window.confirm("Удалить локальное досье без восстановления?")) return;
    deleteProject(params.id);
    router.push("/app");
  }

  return (
    <AppShell mode="validation">
      <PaperCard eyebrow="07 Карта проекта" title={map.title} stamp="Экспорт">
        <div className="space-y-6">
          <div className="border border-black/15 bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Исходная проблема</p>
            <p className="mt-2 text-sm leading-7">{map.rawProblem}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <section className="border border-black/15 bg-paper p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-stamp">Диагноз</p>
              <p className="mt-2 text-sm leading-7">{map.diagnosis}</p>
            </section>
            <section className="border border-black/15 bg-paper p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-stamp">Выбранный приём</p>
              <p className="mt-2 text-sm leading-7">{map.selectedPrinciple}</p>
            </section>
          </div>
          <section className="border border-black/15 bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-stamp">Противоречие</p>
            <pre className="mt-2 whitespace-pre-wrap font-body text-sm leading-7">{map.contradiction}</pre>
          </section>
          <section className="border border-black/15 bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-stamp">ИКР</p>
            <p className="mt-2 text-sm leading-7">{map.ifr}</p>
          </section>
          <section className="border border-black/15 bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-stamp">План действий</p>
            <ol className="mt-3 space-y-3 text-sm leading-7">
              {map.actionPlan.map((step, index) => (
                <li key={step}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </section>
          <section className="border border-black/15 bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-stamp">Проверка</p>
            <p className="mt-2 text-sm leading-7">{map.validationSummary}</p>
          </section>
          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Создано: {formatDate(map.createdAt)}</p>
          <div className="flex flex-wrap gap-3 print:hidden">
            <MechanicalButton onClick={copyMarkdown}>
              <Copy size={16} /> Скопировать Markdown
            </MechanicalButton>
            <MechanicalButton variant="secondary" onClick={() => window.print()}>
              <Printer size={16} /> Печать
            </MechanicalButton>
            <MechanicalButton variant="danger" onClick={remove}>
              <Trash2 size={16} /> Удалить проект
            </MechanicalButton>
          </div>
        </div>
      </PaperCard>
    </AppShell>
  );
}
