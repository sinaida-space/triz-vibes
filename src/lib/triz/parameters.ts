import type { CreativeParameter, ProblemType, ProjectType } from "./types";

export const creativeParameters: CreativeParameter[] = [
  "atmosphere",
  "detail",
  "iteration_speed",
  "readability",
  "uniqueness",
  "ai_control",
  "series_unity",
  "emotional_power",
  "technical_stability",
  "conceptual_depth"
];

export const creativeParameterLabels: Record<CreativeParameter, string> = {
  atmosphere: "Атмосфера",
  detail: "Детализация",
  iteration_speed: "Скорость итерации",
  readability: "Читаемость",
  uniqueness: "Уникальность",
  ai_control: "Управляемость AI",
  series_unity: "Цельность серии",
  emotional_power: "Эмоциональная сила",
  technical_stability: "Техническая стабильность",
  conceptual_depth: "Концептуальная глубина"
};

export const problemTypeLabels: Record<ProblemType, string> = {
  technical_contradiction: "Техническое противоречие",
  physical_contradiction: "Физическое противоречие",
  weak_ifr: "Слабый ИКР",
  weak_system: "Слабая система",
  missing_field: "Недостающее поле",
  selection_chaos: "Хаос выбора"
};

export const projectTypeLabels: Record<ProjectType, string> = {
  image: "AI-изображение",
  series: "Серия",
  video: "Видео",
  installation: "Инсталляция",
  branding: "Брендинг",
  other: "Другое"
};
