import { NextResponse } from "next/server";
import { z } from "zod";
import { callStructuredOpenAI } from "@/lib/openai/client";
import { fallbackContradiction } from "@/lib/openai/fallbacks";
import { prompts } from "@/lib/openai/prompts";
import { contradictionSchema } from "@/lib/openai/schemas";
import { creativeParameters } from "@/lib/triz/parameters";
import type { CreativeParameter } from "@/lib/triz/types";

const parameterSchema = z.enum(creativeParameters as [CreativeParameter, ...CreativeParameter[]]);

const inputSchema = z.object({
  rawProblem: z.string().min(10),
  improvingParameter: parameterSchema,
  worseningParameter: parameterSchema
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Выберите улучшаемый и ухудшаемый параметры." }, { status: 400 });
  }

  const result = await callStructuredOpenAI({
    schema: contradictionSchema,
    system: prompts.contradiction,
    user: parsed.data,
    fallback: fallbackContradiction(parsed.data)
  });

  return NextResponse.json({
    ...result,
    improvingParameter: parsed.data.improvingParameter,
    worseningParameter: parsed.data.worseningParameter
  });
}
