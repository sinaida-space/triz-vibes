import type { ValidationChecklist } from "./types";

export function scoreValidation(input: ValidationChecklist) {
  let score = 0;
  if (input.usesExistingResource) score += 2;
  if (input.improvesTarget) score += 2;
  if (input.protectsWorseningParameter) score += 2;
  if (input.repeatable) score += 2;
  if (input.avoidsChaoticIteration) score += 1;
  if (!input.createsNewProblem) score += 1;

  return {
    score,
    contradictionResolved: score >= 8,
    compromiseDetected: score < 7
  };
}
