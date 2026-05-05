import type { ProjectStatus } from "@/lib/triz/types";
import type { ProjectSession } from "@/lib/triz/types";

export const statusOrder: ProjectStatus[] = [
  "draft",
  "diagnosed",
  "contradiction_confirmed",
  "principles_recommended",
  "principle_selected",
  "ifr_generated",
  "action_plan_created",
  "validated",
  "exported"
];

export function canAdvance(from: ProjectStatus, to: ProjectStatus) {
  return statusOrder.indexOf(to) <= statusOrder.indexOf(from) + 1;
}

export function maxStatus(current: ProjectStatus, next: ProjectStatus): ProjectStatus {
  return statusOrder.indexOf(next) > statusOrder.indexOf(current) ? next : current;
}

export const stepRoutes = [
  { key: "diagnosed", label: "01 Диагноз", href: "diagnosis" },
  { key: "contradiction_confirmed", label: "02 Противоречие", href: "contradiction" },
  { key: "principle_selected", label: "03 Приёмы", href: "principles" },
  { key: "ifr_generated", label: "04 ИКР", href: "ifr" },
  { key: "action_plan_created", label: "05 План", href: "action-plan" },
  { key: "validated", label: "06 Проверка", href: "validation" },
  { key: "exported", label: "07 Карта", href: "map" }
] as const;

export function statusIndex(status: ProjectStatus) {
  return statusOrder.indexOf(status);
}

export function isStepUnlocked(project: ProjectSession, href: string) {
  switch (href) {
    case "diagnosis":
      return Boolean(project.diagnosis);
    case "contradiction":
      return Boolean(project.contradiction);
    case "principles":
      return Boolean(project.recommendedPrinciples?.length);
    case "ifr":
      return Boolean(project.selectedPrinciple);
    case "action-plan":
      return Boolean(project.ifr);
    case "validation":
      return Boolean(project.actionPlan);
    case "map":
      return Boolean(project.validation);
    default:
      return false;
  }
}
