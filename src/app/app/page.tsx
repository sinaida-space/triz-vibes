"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { useProjectStore } from "@/lib/state/project-store";
import { projectTypeLabels } from "@/lib/triz/parameters";
import type { DiagnosisResult, ProjectType } from "@/lib/triz/types";

const projectTypes = Object.entries(projectTypeLabels) as [ProjectType, string][];

function deriveTitle(problem: string) {
  const firstSentence = problem.split(/[.!?。]/)[0]?.trim() || problem.trim();
  const compact = firstSentence.replace(/[“”"]/g, "");
  if (compact.length <= 54) return compact || "Новое досье";
  return `${compact.slice(0, 51).trim()}...`;
}

export default function AppStartPage() {
  const router = useRouter();
  const { projects, createProject, updateProject, deleteProject } = useProjectStore();
  const [title, setTitle] = useState("");
  const [rawProblem, setRawProblem] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("image");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const submittedTitle = String(form.get("title") ?? "").trim();
    const submittedProblem = String(form.get("rawProblem") ?? "").trim();
    const submittedType = String(form.get("projectType") ?? projectType) as ProjectType;
    setError("");
    if (submittedProblem.length < 20) {
      setError("Проблема слишком короткая. Опишите, что вы пытаетесь улучшить и что при этом ломается.");
      return;
    }

    setLoading(true);
    const id = createProject({
      title: submittedTitle || deriveTitle(submittedProblem),
      rawProblem: submittedProblem,
      projectType: submittedType
    });

    try {
      const response = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawProblem: submittedProblem, projectType: submittedType })
      });
      if (!response.ok) throw new Error("diagnose failed");
      const diagnosis = (await response.json()) as DiagnosisResult;
      updateProject(
        id,
        {
          status: "diagnosed",
          diagnosis,
          diagnosedProblem: diagnosis.diagnosedProblem,
          problemType: diagnosis.problemType,
          improvingParameter: diagnosis.probableImprovingParameters[0],
          worseningParameter: diagnosis.probableWorseningParameters[0]
        },
        "diagnosis_generated"
      );
      router.push(`/app/project/${id}/diagnosis`);
    } catch {
      setError("Модуль анализа недоступен. Проект создан; продолжите вручную на экране диагностики.");
      router.push(`/app/project/${id}/diagnosis`);
    } finally {
      setLoading(false);
    }
  }

  function removeProject(id: string) {
    if (!window.confirm("Удалить локальное досье без восстановления?")) return;
    deleteProject(id);
  }

  return (
    <main className="mx-auto grid min-h-[78vh] max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-8">
      <PaperCard eyebrow="Новый разбор" title="Опишите творческий блок" stamp="Черновик">
        <form className="space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-ink-muted">Название проекта</span>
            <input name="title" className="typed-field" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-ink-muted">Что не работает?</span>
            <textarea
              className="typed-field min-h-44 resize-y"
              name="rawProblem"
              value={rawProblem}
              onChange={(event) => setRawProblem(event.target.value)}
              placeholder="Например: “Серия AI-портретов красивая, но выглядит одинаково и без авторского голоса.”"
              aria-describedby={error ? "problem-error" : undefined}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-ink-muted">Тип проекта</span>
            <select
              name="projectType"
              className="typed-field"
              value={projectType}
              onChange={(event) => setProjectType(event.target.value as ProjectType)}
            >
              {projectTypes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {error ? (
            <p id="problem-error" className="border border-stamp/35 bg-stamp/10 p-3 text-sm text-stamp">
              {error}
            </p>
          ) : null}
          <MechanicalButton disabled={loading}>
            {loading ? "Система считывает конфликт..." : "Разобрать проблему"} <ArrowRight size={16} />
          </MechanicalButton>
        </form>
      </PaperCard>

      <section id="projects" className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Локальные проекты</p>
          <h2 className="mt-2 font-display text-4xl">Сохранённые досье</h2>
        </div>
        {projects.length === 0 ? (
          <div className="border border-black/15 bg-card p-5 text-sm leading-6 text-ink-muted">
            Нет проекта. Создайте первый разбор и превратите неясную проблему в карту решения.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border border-black/15 bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-stamp">{project.status}</p>
                  <h3 className="mt-2 font-display text-2xl">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{project.rawProblem}</p>
                </div>
                <button aria-label="Удалить проект" className="text-stamp" onClick={() => removeProject(project.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
              <button
                className="mt-4 text-xs uppercase tracking-[0.12em] underline"
                onClick={() => router.push(`/app/project/${project.id}`)}
              >
                Открыть досье
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
