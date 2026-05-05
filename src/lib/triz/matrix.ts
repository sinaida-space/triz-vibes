import type { CreativeParameter } from "./types";

export const contradictionMatrix: Partial<Record<`${CreativeParameter}:${CreativeParameter}`, number[]>> = {
  "detail:atmosphere": [3, 10, 35],
  "atmosphere:detail": [10, 3, 35],
  "detail:iteration_speed": [15, 2, 28],
  "iteration_speed:detail": [2, 15, 28],
  "detail:readability": [17, 32, 10],
  "readability:detail": [10, 17, 35],
  "uniqueness:series_unity": [3, 6, 13, 17],
  "series_unity:uniqueness": [3, 6, 13, 17],
  "ai_control:atmosphere": [6, 15, 28],
  "atmosphere:ai_control": [6, 28, 40],
  "readability:conceptual_depth": [13, 17, 3],
  "conceptual_depth:readability": [17, 32, 13],
  "emotional_power:technical_stability": [8, 15, 19],
  "technical_stability:emotional_power": [10, 11, 15],
  "iteration_speed:uniqueness": [6, 13, 28],
  "uniqueness:iteration_speed": [6, 13, 28]
};

export function getRecommendedPrincipleIds(improving: CreativeParameter, worsening: CreativeParameter) {
  return contradictionMatrix[`${improving}:${worsening}`] ?? [3, 6, 13, 17];
}
