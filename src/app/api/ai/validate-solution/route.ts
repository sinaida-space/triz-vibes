import { NextResponse } from "next/server";
import { z } from "zod";
import { callStructuredOpenAI } from "@/lib/openai/client";
import { fallbackValidation } from "@/lib/openai/fallbacks";
import { prompts } from "@/lib/openai/prompts";
import { validationSchema } from "@/lib/openai/schemas";
import { scoreValidation } from "@/lib/triz/validation";

const checklistSchema = z.object({
  usesExistingResource: z.boolean(),
  improvesTarget: z.boolean(),
  protectsWorseningParameter: z.boolean(),
  repeatable: z.boolean(),
  avoidsChaoticIteration: z.boolean(),
  createsNewProblem: z.boolean()
});

const inputSchema = z.object({
  contradictionFormula: z.string().min(10),
  ifr: z.string().min(10),
  actionPlan: z.array(z.string()).min(1),
  checklist: checklistSchema
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Для проверки нужен план действий и заполненный чеклист." }, { status: 400 });
  }

  const deterministicScore = scoreValidation(parsed.data.checklist);
  const result = await callStructuredOpenAI({
    schema: validationSchema,
    system: prompts.validate,
    user: { ...parsed.data, deterministicScore },
    fallback: fallbackValidation(parsed.data.checklist)
  });

  return NextResponse.json({
    ...result,
    score: deterministicScore.score,
    contradictionResolved: deterministicScore.contradictionResolved,
    compromiseDetected: deterministicScore.compromiseDetected
  });
}
