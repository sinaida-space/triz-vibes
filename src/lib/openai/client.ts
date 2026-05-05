import { z } from "zod";

type JsonRecord = Record<string, unknown>;

function extractResponseText(data: JsonRecord) {
  if (typeof data.output_text === "string") return data.output_text;
  const output = Array.isArray(data.output) ? data.output : [];
  for (const item of output) {
    const content = typeof item === "object" && item && "content" in item ? (item as JsonRecord).content : undefined;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (typeof part === "object" && part && "text" in part && typeof (part as JsonRecord).text === "string") {
        return (part as JsonRecord).text as string;
      }
    }
  }
  return "";
}

export async function callStructuredOpenAI<T>({
  schema,
  system,
  user,
  fallback
}: {
  schema: z.ZodType<T>;
  system: string;
  user: unknown;
  fallback: T;
}): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallback;

  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const payload = {
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(user) }
    ],
    text: {
      format: {
        type: "json_object"
      }
    }
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          attempt === 0
            ? payload
            : {
                ...payload,
                input: [
                  payload.input[0],
                  {
                    role: "user",
                    content: `${JSON.stringify(user)}\n\nПовтори ответ строго валидным JSON без Markdown и без пояснений.`
                  }
                ]
              }
        )
      });

      if (!response.ok) continue;
      const data = (await response.json()) as JsonRecord;
      const text = extractResponseText(data);
      const parsed = JSON.parse(text);
      const result = schema.safeParse(parsed);
      if (result.success) return result.data;
    } catch {
      // Controlled fallback below keeps the state machine usable.
    }
  }

  return fallback;
}
