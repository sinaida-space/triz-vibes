"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import { getRecommendedPrincipleIds } from "@/lib/triz/matrix";
import { creativeParameterLabels } from "@/lib/triz/parameters";
import { buildPrincipleRecommendations } from "@/lib/triz/principles";

export default function ContradictionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const updateProject = useProjectStore((state) => state.updateProject);

  function recommend() {
    if (!project?.improvingParameter || !project.worseningParameter) return;
    const ids = getRecommendedPrincipleIds(project.improvingParameter, project.worseningParameter);
    const recommendedPrinciples = buildPrincipleRecommendations(ids, project.rawProblem);
    updateProject(
      params.id,
      { status: "principles_recommended", recommendedPrinciples },
      "principles_recommended"
    );
    router.push(`/app/project/${params.id}/principles`);
  }

  return (
    <AppShell mode="contradiction">
      <PaperCard eyebrow="02 Противоречие" title={project?.contradiction?.shortName ?? "Формула конфликта"} stamp="Подтверждено">
        <div className="space-y-5">
          <pre className="whitespace-pre-wrap border border-black/15 bg-paper p-5 font-body text-sm leading-7">
            {project?.contradiction?.formula ?? "Сначала сформулируйте противоречие на экране диагностики."}
          </pre>
          {project?.improvingParameter && project.worseningParameter ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-black/15 bg-card-yellow/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Улучшается</p>
                <p className="mt-2 text-xl">{creativeParameterLabels[project.improvingParameter]}</p>
              </div>
              <div className="border border-black/15 bg-card-yellow/30 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Ухудшается</p>
                <p className="mt-2 text-xl">{creativeParameterLabels[project.worseningParameter]}</p>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <MechanicalButton onClick={recommend} disabled={!project?.contradiction}>
              Подобрать приёмы <ArrowRight size={16} />
            </MechanicalButton>
            <Link href={`/app/project/${params.id}/diagnosis`}>
              <MechanicalButton variant="secondary">
                <RotateCcw size={16} /> Вернуться к параметрам
              </MechanicalButton>
            </Link>
          </div>
        </div>
      </PaperCard>
    </AppShell>
  );
}
