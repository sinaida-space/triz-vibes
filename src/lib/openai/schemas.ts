import { z } from "zod";
import { creativeParameters } from "@/lib/triz/parameters";

const creativeParameterSchema = z.enum(creativeParameters as [string, ...string[]]);

export const diagnosisSchema = z.object({
  diagnosedProblem: z.string().min(10),
  problemType: z.enum([
    "technical_contradiction",
    "physical_contradiction",
    "weak_ifr",
    "weak_system",
    "missing_field",
    "selection_chaos"
  ]),
  probableImprovingParameters: z.array(creativeParameterSchema).min(1).max(4),
  probableWorseningParameters: z.array(creativeParameterSchema).min(1).max(4),
  reasoningSummary: z.string().min(10),
  userClarifyingQuestion: z.string().optional()
});

export const contradictionSchema = z.object({
  shortName: z.string().min(3),
  formula: z.string().min(20),
  improvingParameter: creativeParameterSchema.optional(),
  worseningParameter: creativeParameterSchema.optional(),
  technicalContradiction: z.string().min(20),
  physicalContradiction: z.string().optional()
});

export const ifrSchema = z.object({
  primary: z.string().min(20),
  alternatives: z.array(z.string()).min(3).max(3),
  internalResources: z.array(z.string()).min(2).max(8),
  removedDependency: z.string().min(5)
});

export const actionPlanSchema = z.object({
  summary: z.string().min(10),
  steps: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(3),
        description: z.string().min(10)
      })
    )
    .min(5)
    .max(7),
  promptDirection: z.string().optional(),
  testCriteria: z.array(z.string()).min(3).max(7),
  antiActions: z.array(z.string()).min(2).max(6)
});

export const validationSchema = z.object({
  score: z.number().min(0).max(10),
  contradictionResolved: z.boolean(),
  compromiseDetected: z.boolean(),
  strengths: z.array(z.string()).min(1).max(6),
  weaknesses: z.array(z.string()).min(1).max(6),
  nextMove: z.string().min(10)
});

export type DiagnosisOutput = z.infer<typeof diagnosisSchema>;
export type ContradictionOutput = z.infer<typeof contradictionSchema>;
export type IFROutput = z.infer<typeof ifrSchema>;
export type ActionPlanOutput = z.infer<typeof actionPlanSchema>;
export type ValidationOutput = z.infer<typeof validationSchema>;
