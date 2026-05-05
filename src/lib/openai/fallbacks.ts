import { creativeParameterLabels } from "@/lib/triz/parameters";
import { formatContradiction } from "@/lib/triz/formatters";
import { scoreValidation } from "@/lib/triz/validation";
import type { CreativeParameter, ValidationChecklist } from "@/lib/triz/types";
import type {
  ActionPlanOutput,
  ContradictionOutput,
  DiagnosisOutput,
  IFROutput,
  ValidationOutput
} from "./schemas";

export function fallbackDiagnosis(rawProblem: string): DiagnosisOutput {
  return {
    diagnosedProblem: `Проблема сформулирована как конфликт качества результата: ${rawProblem}`,
    problemType: "technical_contradiction",
    probableImprovingParameters: ["uniqueness", "conceptual_depth"],
    probableWorseningParameters: ["series_unity", "iteration_speed"],
    reasoningSummary:
      "Система обнаружила вероятный конфликт между усилением авторского качества и сохранением управляемой, повторяемой структуры."
  };
}

export function fallbackContradiction(input: {
  improvingParameter: CreativeParameter;
  worseningParameter: CreativeParameter;
}): ContradictionOutput {
  const improving = creativeParameterLabels[input.improvingParameter];
  const worsening = creativeParameterLabels[input.worseningParameter];
  return {
    shortName: `${improving} против ${worsening}`,
    formula: formatContradiction(input),
    improvingParameter: input.improvingParameter,
    worseningParameter: input.worseningParameter,
    technicalContradiction: `Нужно усилить параметр «${improving}», но это ухудшает параметр «${worsening}».`,
    physicalContradiction: `Проект должен быть одновременно более сильным по параметру «${improving}» и не терять «${worsening}».`
  };
}

export function fallbackIFR(selectedPrincipleTitle: string): IFROutput {
  return {
    primary:
      "Структура проекта сама удерживает авторское различие без увеличения хаотичных итераций и без разрушения цельности серии.",
    alternatives: [
      "Серия сама показывает различие работ через повторяемый закон трансформации.",
      "Ограничение само становится источником выразительности без дополнительного декора.",
      "Нежелательный сбой AI сам работает как управляемый авторский маркер."
    ],
    internalResources: ["исходный дефект", "повторяемый визуальный мотив", selectedPrincipleTitle, "правило отбора"],
    removedDependency: "зависимость от бесконечного перебора промптов"
  };
}

export function fallbackActionPlan(): ActionPlanOutput {
  return {
    summary: "Перевести конфликт из перебора вариантов в проверяемое правило трансформации.",
    steps: [
      {
        id: "step-1",
        title: "Выделить конфликт",
        description: "Записать, какой параметр усиливается и какой параметр при этом ухудшается."
      },
      {
        id: "step-2",
        title: "Назначить ресурс",
        description: "Выбрать уже существующий элемент проекта, который может удержать оба параметра."
      },
      {
        id: "step-3",
        title: "Сформулировать правило",
        description: "Описать короткий закон трансформации, повторяемый во всех вариантах."
      },
      {
        id: "step-4",
        title: "Собрать три теста",
        description: "Создать три варианта с одним неизменным правилом и одним изменяемым параметром."
      },
      {
        id: "step-5",
        title: "Проверить серию",
        description: "Оценить, усилился ли целевой параметр без потери ухудшаемого параметра."
      }
    ],
    promptDirection:
      "Используйте промпт как протокол: фиксированный закон трансформации + изменяемый параметр + критерий отбора.",
    testCriteria: [
      "Результат можно повторить в следующей работе",
      "Целевой параметр стал сильнее",
      "Ухудшаемый параметр не разрушен",
      "Появился критерий отбора, а не только вкус"
    ],
    antiActions: ["Не добавлять декоративные эпитеты без функции", "Не генерировать серию без общего закона"]
  };
}

export function fallbackValidation(checklist: ValidationChecklist): ValidationOutput {
  const score = scoreValidation(checklist);
  return {
    ...score,
    strengths: score.contradictionResolved
      ? ["Использован существующий ресурс", "Решение можно повторить как правило"]
      : ["Есть первичная структура решения"],
    weaknesses: score.compromiseDetected
      ? ["Часть конфликта остаётся не снятой", "Решение может зависеть от ручного вкусового отбора"]
      : ["Нужно проверить результат на новой серии"],
    nextMove: score.contradictionResolved
      ? "Зафиксируйте правило и примените его к следующему фрагменту проекта."
      : "Вернитесь к параметрам и уточните, какой ресурс может защищать ухудшаемый параметр."
  };
}
