import { creativeParameterLabels } from "./parameters";
import type { CreativeParameter, ProjectMap, ProjectSession } from "./types";

export function formatContradiction(input: {
  improvingParameter: CreativeParameter;
  worseningParameter: CreativeParameter;
}) {
  const improvingLabel = creativeParameterLabels[input.improvingParameter].toLowerCase();
  const worseningLabel = creativeParameterLabels[input.worseningParameter].toLowerCase();

  return [
    `Если вы усиливаете ${improvingLabel}, проект становится сильнее в одном аспекте, но ${worseningLabel} ухудшается.`,
    `Если вы защищаете ${worseningLabel}, проблема уменьшается, но ${improvingLabel} остаётся слабым.`
  ].join("\n\n");
}

export function buildProjectMap(project: ProjectSession): ProjectMap {
  const selected = project.selectedPrinciple?.title ?? "Приём не выбран";
  return {
    title: project.title,
    rawProblem: project.rawProblem,
    diagnosis: project.diagnosis?.diagnosedProblem ?? project.diagnosedProblem ?? "Диагноз не сохранён",
    contradiction: project.contradiction?.formula ?? project.contradictionFormula ?? "Противоречие не сформулировано",
    selectedPrinciple: selected,
    ifr: project.ifr?.primary ?? "ИКР не сформулирован",
    actionPlan: project.actionPlan?.steps.map((step) => `${step.title}: ${step.description}`) ?? [],
    validationSummary: project.validation
      ? `${project.validation.score}/10. ${project.validation.nextMove}`
      : "Проверка не проведена",
    createdAt: project.createdAt
  };
}

export function mapToMarkdown(project: ProjectSession) {
  const map = buildProjectMap(project);
  return `# ${map.title}

## Исходная проблема
${map.rawProblem}

## Диагноз
${map.diagnosis}

## Противоречие
${map.contradiction}

## Выбранный приём
${map.selectedPrinciple}

## ИКР
${map.ifr}

## План действий
${map.actionPlan.map((step, index) => `${index + 1}. ${step}`).join("\n")}

## Проверка
${map.validationSummary}
`;
}
