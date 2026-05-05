"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectStore } from "@/lib/state/project-store";
import type { IFRResult, Resource } from "@/lib/triz/types";

const defaultResources: Resource[] = [
  { id: "defect", label: "исходный дефект", type: "negative", selected: true },
  { id: "series-rule", label: "повторяемое правило серии", type: "semantic", selected: true },
  { id: "visual-motif", label: "визуальный мотив", type: "visual", selected: false },
  { id: "audience-reading", label: "ожидание зрителя", type: "audience", selected: false },
  { id: "prompt-log", label: "история генераций", type: "data", selected: false }
];

export default function IFRPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useProjectStore((state) => state.getProject(params.id));
  const updateProject = useProjectStore((state) => state.updateProject);
  const [resources, setResources] = useState<Resource[]>(project?.resources ?? defaultResources);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleResource(id: string) {
    setResources((current) => current.map((resource) => (resource.id === id ? { ...resource, selected: !resource.selected } : resource)));
  }

  async function generate() {
    if (!project?.selectedPrinciple || !project.contradiction) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/generate-ifr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawProblem: project.rawProblem,
          contradictionFormula: project.contradiction.formula,
          selectedPrincipleTitle: project.selectedPrinciple.title,
          resources: resources.filter((resource) => resource.selected).map((resource) => resource.label)
        })
      });
      if (!response.ok) throw new Error("ifr failed");
      const ifr = (await response.json()) as IFRResult;
      updateProject(params.id, { status: "ifr_generated", ifr, resources }, "ifr_generated");
      router.push(`/app/project/${params.id}/action-plan`);
    } catch {
      setError("Модуль ИКР недоступен. Проверьте выбранный приём и попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell mode="ifr">
      <div className="space-y-6">
        <PaperCard eyebrow="04 ИКР" title="Выберите внутренние ресурсы" stamp="Ресурсы">
          <div className="grid gap-3 md:grid-cols-2">
            {resources.map((resource) => (
              <label key={resource.id} className="flex cursor-pointer items-start gap-3 border border-black/15 bg-paper p-4">
                <input
                  type="checkbox"
                  checked={resource.selected}
                  onChange={() => toggleResource(resource.id)}
                  className="mt-1 h-4 w-4 accent-stamp"
                />
                <span>
                  <span className="block text-sm">{resource.label}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-ink-muted">{resource.type}</span>
                </span>
              </label>
            ))}
          </div>
          {error ? <p className="mt-4 border border-stamp/35 bg-stamp/10 p-3 text-sm text-stamp">{error}</p> : null}
          <MechanicalButton className="mt-6" onClick={generate} disabled={loading || !project?.selectedPrinciple}>
            {loading ? "Формулируется ИКР..." : "Сформулировать и принять ИКР"} <ArrowRight size={16} />
          </MechanicalButton>
        </PaperCard>

        {project?.ifr ? (
          <PaperCard title="Текущий ИКР" stamp="Принято">
            <p className="text-lg leading-8">{project.ifr.primary}</p>
          </PaperCard>
        ) : null}
      </div>
    </AppShell>
  );
}
