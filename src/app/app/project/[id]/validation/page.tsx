"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import type { ValidationChecklist, ValidationResult } from "@/lib/triz/types";

const checklistItems: { key: keyof ValidationChecklist; label: string }[] = [
  { key: "usesExistingResource", label: "Использует существующий ресурс" },
  { key: "improvesTarget", label: "Усиливает целевой параметр" },
  { key: "protectsWorseningParameter", label: "Защищает ухудшаемый параметр" },
  { key: "repeatable", label: "Создаёт повторяемое правило" },
  { key: "avoidsChaoticIteration", label: "Уводит от хаотичного перебора" },
  { key: "createsNewProblem", label: "Создаёт крупную новую проблему" }
];

export default function ValidationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const updateProject = useProjectStore((state) => state.updateProject);
  const [checklist, setChecklist] = useState<ValidationChecklist>({
    usesExistingResource: true,
    improvesTarget: true,
    protectsWorseningParameter: false,
    repeatable: true,
    avoidsChaoticIteration: true,
    createsNewProblem: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canValidate = Boolean(project?.contradiction && project?.ifr && project?.actionPlan);

  function toggle(key: keyof ValidationChecklist) {
    setChecklist((current) => ({ ...current, [key]: !current[key] }));
  }

  async function validate() {
    if (!project?.contradiction || !project.ifr || !project.actionPlan) {
      setError("Проверка требует противоречие, ИКР и собранный план действий.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/validate-solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contradictionFormula: project.contradiction.formula,
          ifr: project.ifr.primary,
          actionPlan: project.actionPlan.steps.map((step) => `${step.title}: ${step.description}`),
          checklist
        })
      });
      if (!response.ok) throw new Error("validation failed");
      const validation = (await response.json()) as ValidationResult;
      updateProject(params.id, { status: "validated", validation }, "solution_validated");
    } catch {
      setError("Модуль проверки недоступен. Чеклист сохранён, повторите проверку позже.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell mode="validation">
      <div className="space-y-6">
        <PaperCard eyebrow="06 Проверка" title="Компромисс или устранение?" stamp="Контроль">
          {error ? <p className="mt-4 border border-stamp/35 bg-stamp/10 p-3 text-sm text-stamp">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <MechanicalButton onClick={validate} disabled={loading || !canValidate}>
              {loading ? "Проверка противоречия..." : "Проверить решение"}
            </MechanicalButton>
            <MechanicalButton variant="secondary" disabled={!project?.validation} onClick={() => router.push(`/app/project/${params.id}/map`)}>
              Открыть карту <ArrowRight size={16} />
            </MechanicalButton>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {checklistItems.map((item) => (
              <label key={item.key} className="flex cursor-pointer gap-3 border border-black/15 bg-paper p-4">
                <input type="checkbox" checked={checklist[item.key]} onChange={() => toggle(item.key)} className="mt-1 h-4 w-4 accent-stamp" />
                <span className="text-sm leading-6">{item.label}</span>
              </label>
            ))}
          </div>
        </PaperCard>

        {project?.validation ? (
          <PaperCard
            title={`${project.validation.score}/10`}
            stamp={project.validation.contradictionResolved ? "Проверено" : project.validation.compromiseDetected ? "Компромисс" : "Повтор"}
          >
            <p className="text-lg leading-8">{project.validation.nextMove}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Сильные места</p>
                <ul className="mt-3 space-y-2 text-sm leading-6">
                  {project.validation.strengths.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Слабые места</p>
                <ul className="mt-3 space-y-2 text-sm leading-6">
                  {project.validation.weaknesses.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </PaperCard>
        ) : null}
      </div>
    </AppShell>
  );
}
