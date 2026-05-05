"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import { getPrinciple } from "@/lib/triz/principles";
import type { ActionPlan } from "@/lib/triz/types";

export default function ActionPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const updateProject = useProjectStore((state) => state.updateProject);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canGenerate = Boolean(project?.selectedPrincipleId && project?.ifr && project?.contradiction);

  async function generate() {
    if (!project?.selectedPrincipleId || !project.ifr || !project.contradiction) {
      setError("Для плана нужны выбранный приём, ИКР и подтверждённое противоречие.");
      return;
    }
    setLoading(true);
    setError("");
    const principle = getPrinciple(project.selectedPrincipleId);
    try {
      const response = await fetch("/api/ai/generate-action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawProblem: project.rawProblem,
          contradictionFormula: project.contradiction.formula,
          selectedPrinciple: {
            id: principle.id,
            title: principle.title,
            shortDefinition: principle.shortDefinition
          },
          ifr: project.ifr.primary,
          projectType: project.projectType
        })
      });
      if (!response.ok) throw new Error("plan failed");
      const result = await response.json();
      const actionPlan: ActionPlan = {
        ...result,
        steps: result.steps.map((step: { id: string; title: string; description: string }) => ({ ...step, completed: false }))
      };
      updateProject(params.id, { status: "action_plan_created", actionPlan }, "action_plan_created");
    } catch {
      setError("Модуль плана недоступен. Проверьте ИКР и выбранный приём.");
    } finally {
      setLoading(false);
    }
  }

  function toggleStep(id: string) {
    if (!project?.actionPlan) return;
    updateProject(params.id, {
      actionPlan: {
        ...project.actionPlan,
        steps: project.actionPlan.steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
      }
    });
  }

  return (
    <AppShell mode="action-plan">
      <div className="space-y-6">
        <PaperCard eyebrow="05 План" title="Перевести ИКР в действия" stamp="Работа">
          <p className="text-sm leading-7 text-ink-muted">
            План должен быть проверяемым: не набор вдохновляющих тезисов, а последовательность действий, критерии и запреты.
          </p>
          {error ? <p className="mt-4 border border-stamp/35 bg-stamp/10 p-3 text-sm text-stamp">{error}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <MechanicalButton onClick={generate} disabled={loading || !canGenerate}>
              {loading ? "Собирается план..." : project?.actionPlan ? "Пересобрать план" : "Собрать план"}
            </MechanicalButton>
            <MechanicalButton
              variant="secondary"
              disabled={!project?.actionPlan}
              onClick={() => router.push(`/app/project/${params.id}/validation`)}
            >
              Перейти к проверке <ArrowRight size={16} />
            </MechanicalButton>
          </div>
        </PaperCard>

        {project?.actionPlan ? (
          <PaperCard title={project.actionPlan.summary} stamp="План">
            <div className="space-y-3">
              {project.actionPlan.steps.map((step, index) => (
                <label key={step.id} className="flex cursor-pointer gap-4 border border-black/15 bg-paper p-4">
                  <input type="checkbox" checked={step.completed} onChange={() => toggleStep(step.id)} className="mt-1 h-4 w-4 accent-stamp" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.12em] text-stamp">Шаг {index + 1}</span>
                    <span className="mt-1 block text-lg">{step.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-ink-muted">{step.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {project.actionPlan.promptDirection ? (
              <div className="mt-6 border border-black/15 bg-card-yellow/25 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Prompt direction</p>
                <p className="mt-2 text-sm leading-6">{project.actionPlan.promptDirection}</p>
              </div>
            ) : null}
          </PaperCard>
        ) : null}
      </div>
    </AppShell>
  );
}
