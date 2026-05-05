import { NextResponse } from "next/server";
import { z } from "zod";
import { callStructuredOpenAI } from "@/lib/openai/client";
import { fallbackIFR } from "@/lib/openai/fallbacks";
import { prompts } from "@/lib/openai/prompts";
import { ifrSchema } from "@/lib/openai/schemas";

const inputSchema = z.object({
  rawProblem: z.string().min(10),
  contradictionFormula: z.string().min(10),
  selectedPrincipleTitle: z.string().min(2),
  resources: z.array(z.string()).optional()
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Для ИКР нужен выбранный приём и сформулированное противоречие." }, { status: 400 });
  }

  const result = await callStructuredOpenAI({
    schema: ifrSchema,
    system: prompts.ifr,
    user: parsed.data,
    fallback: fallbackIFR(parsed.data.selectedPrincipleTitle)
  });

  return NextResponse.json(result);
}
