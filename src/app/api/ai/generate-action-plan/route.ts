import { NextResponse } from "next/server";
import { z } from "zod";
import { callStructuredOpenAI } from "@/lib/openai/client";
import { fallbackActionPlan } from "@/lib/openai/fallbacks";
import { prompts } from "@/lib/openai/prompts";
import { actionPlanSchema } from "@/lib/openai/schemas";

const inputSchema = z.object({
  rawProblem: z.string().min(10),
  contradictionFormula: z.string().min(10),
  selectedPrinciple: z.object({
    id: z.number(),
    title: z.string(),
    shortDefinition: z.string()
  }),
  ifr: z.string().min(10),
  projectType: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Для плана нужен ИКР и выбранный приём." }, { status: 400 });
  }

  const result = await callStructuredOpenAI({
    schema: actionPlanSchema,
    system: prompts.actionPlan,
    user: parsed.data,
    fallback: fallbackActionPlan()
  });

  return NextResponse.json({
    ...result,
    steps: result.steps.map((step, index) => ({ ...step, id: step.id || `step-${index + 1}` }))
  });
}
