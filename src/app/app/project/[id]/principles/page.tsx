"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import { getRecommendedPrincipleIds } from "@/lib/triz/matrix";
import { buildPrincipleRecommendations } from "@/lib/triz/principles";

export default function PrinciplesPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const updateProject = useProjectStore((state) => state.updateProject);
  const recommendations =
    project?.recommendedPrinciples ??
    (project?.improvingParameter && project.worseningParameter
      ? buildPrincipleRecommendations(getRecommendedPrincipleIds(project.improvingParameter, project.worseningParameter), project.rawProblem)
      : []);

  function select(principleId: number) {
    const selectedPrinciple = recommendations.find((item) => item.principleId === principleId);
    if (!selectedPrinciple) return;
    updateProject(
      params.id,
      {
        status: "principle_selected",
        selectedPrincipleId: principleId,
        selectedPrinciple,
        recommendedPrinciples: recommendations
      },
      "principle_selected"
    );
    router.push(`/app/project/${params.id}/ifr`);
  }

  return (
    <AppShell mode="principles">
      <PaperCard eyebrow="03 Приёмы" title="Рекомендуемые приёмы матрицы" stamp="Матрица">
        <p className="mb-6 max-w-3xl text-sm leading-7 text-ink-muted">
          Выберите приём, который станет рабочим способом снять конфликт. Матрица подбирает номера детерминированно,
          объяснение привязано к вашему проекту.
        </p>
        <div className="grid gap-4">
          {recommendations.map((principle) => (
            <article key={principle.principleId} className="border border-black/15 bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-stamp">Приём {principle.principleId}</p>
                  <h3 className="mt-2 font-display text-3xl">{principle.title}</h3>
                </div>
                <MechanicalButton onClick={() => select(principle.principleId)}>
                  Выбрать приём <ArrowRight size={16} />
                </MechanicalButton>
              </div>
              <p className="mt-4 text-sm leading-7">{principle.reason}</p>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{principle.projectApplication}</p>
              <p className="mt-3 border-l-2 border-stamp pl-4 text-sm">{principle.miniAction}</p>
            </article>
          ))}
        </div>
      </PaperCard>
    </AppShell>
  );
}
