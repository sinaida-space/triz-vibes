"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";
import { AppShell } from "@/components/layout/AppShell";
import { stepRoutes } from "@/lib/state/transitions";
import { useProjectStore } from "@/lib/state/project-store";

export default function ProjectOverviewPage() {
  const params = useParams<{ id: string }>();
  const project = useProjectStore((state) => state.getProject(params.id));

  return (
    <AppShell>
      <PaperCard eyebrow="Рабочее пространство" title="Следующее действие" stamp={project?.status ?? "Досье"}>
        <div className="grid gap-4 md:grid-cols-2">
          {stepRoutes.map((step) => (
            <Link key={step.href} href={`/app/project/${params.id}/${step.href}`} className="border border-black/15 bg-paper p-5 transition hover:-translate-y-1 hover:shadow-paper">
              <p className="text-xs uppercase tracking-[0.12em] text-stamp">{step.label}</p>
              <p className="mt-4 text-sm leading-6 text-ink-muted">Открыть экран и зафиксировать следующий фрагмент карты.</p>
            </Link>
          ))}
        </div>
        <Link href={`/app/project/${params.id}/diagnosis`} className="mt-6 inline-flex">
          <MechanicalButton>
            Продолжить разбор <ArrowRight size={16} />
          </MechanicalButton>
        </Link>
      </PaperCard>
    </AppShell>
  );
}
