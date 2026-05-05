import { NextResponse } from "next/server";
import { z } from "zod";
import { callStructuredOpenAI } from "@/lib/openai/client";
import { fallbackDiagnosis } from "@/lib/openai/fallbacks";
import { prompts } from "@/lib/openai/prompts";
import { diagnosisSchema } from "@/lib/openai/schemas";

const inputSchema = z.object({
  rawProblem: z.string().min(20),
  projectType: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проблема слишком короткая. Опишите, что вы пытаетесь улучшить и что при этом ломается." },
      { status: 400 }
    );
  }

  const result = await callStructuredOpenAI({
    schema: diagnosisSchema,
    system: prompts.diagnose,
    user: parsed.data,
    fallback: fallbackDiagnosis(parsed.data.rawProblem)
  });

  return NextResponse.json(result);
}
