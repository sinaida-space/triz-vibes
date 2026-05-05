"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import { creativeParameterLabels, creativeParameters, problemTypeLabels } from "@/lib/triz/parameters";
import type { ContradictionResult, CreativeParameter } from "@/lib/triz/types";

export default function DiagnosisPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const updateProject = useProjectStore((state) => state.updateProject);
  const [improving, setImproving] = useState<CreativeParameter>(project?.improvingParameter ?? "uniqueness");
  const [worsening, setWorsening] = useState<CreativeParameter>(project?.worseningParameter ?? "series_unity");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function formulate() {
    if (!project) return;
    setLoading(true);
    setError("");
    updateProject(params.id, { improvingParameter: improving, worseningParameter: worsening });
    try {
      const response = await fetch("/api/ai/formulate-contradiction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawProblem: project.rawProblem, improvingParameter: improving, worseningParameter: worsening })
      });
      if (!response.ok) throw new Error("contradiction failed");
      const contradiction = (await response.json()) as ContradictionResult;
      updateProject(
        params.id,
        {
          status: "contradiction_confirmed",
          contradiction,
          contradictionFormula: contradiction.formula,
          improvingParameter: improving,
          worseningParameter: worsening
        },
        "contradiction_confirmed"
      );
      router.push(`/app/project/${params.id}/contradiction`);
    } catch {
      setError("Модуль формулировки недоступен. Попробуйте ещё раз или измените параметры.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell mode="diagnosis">
      <div className="space-y-6">
        <PaperCard eyebrow="01 Диагноз" title="Что система обнаружила" stamp="Диагноз">
          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm leading-7">{project?.diagnosis?.diagnosedProblem ?? "Диагноз пока не сохранён."}</p>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                {project?.diagnosis?.reasoningSummary ??
                  "Вы можете продолжить вручную: выберите улучшаемый и ухудшаемый параметры."}
              </p>
            </div>
            <div className="border border-black/15 bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Тип проблемы</p>
              <p className="mt-3 font-display text-2xl">
                {project?.diagnosis?.problemType ? problemTypeLabels[project.diagnosis.problemType] : "Техническое противоречие"}
              </p>
            </div>
          </div>
        </PaperCard>

        <PaperCard title="Подтвердите параметры" stamp="Действие">
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-ink-muted">Что вы хотите улучшить?</span>
              <select className="typed-field" value={improving} onChange={(event) => setImproving(event.target.value as CreativeParameter)}>
                {creativeParameters.map((parameter) => (
                  <option key={parameter} value={parameter}>
                    {creativeParameterLabels[parameter]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-ink-muted">Что при этом ухудшается?</span>
              <select className="typed-field" value={worsening} onChange={(event) => setWorsening(event.target.value as CreativeParameter)}>
                {creativeParameters.map((parameter) => (
                  <option key={parameter} value={parameter}>
                    {creativeParameterLabels[parameter]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error ? <p className="mt-4 border border-stamp/35 bg-stamp/10 p-3 text-sm text-stamp">{error}</p> : null}
          <MechanicalButton className="mt-6" onClick={formulate} disabled={loading || improving === worsening}>
            {loading ? "Формулируется противоречие..." : "Сформулировать противоречие"} <ArrowRight size={16} />
          </MechanicalButton>
        </PaperCard>
      </div>
    </AppShell>
  );
}
