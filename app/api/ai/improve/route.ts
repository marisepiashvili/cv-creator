import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

/**
 * AI-1: text improvement. Returns 1–3 alternative phrasings (simpler / shorter / more specific).
 * - The API key stays on the server.
 * - Only the text being improved is sent; emails, phone numbers and URLs are stripped first.
 * - 20 requests per session (cookie) and per IP, kept in memory (swap for Redis/KV in production).
 * - Logs never contain the text itself.
 */

export const runtime = "nodejs";

const LIMIT = 20;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_CHARS = 2000;
const MODEL = process.env.AI_MODEL || "claude-opus-5-5";

const usage = new Map<string, { count: number; resetAt: number }>();

function bump(key: string): number {
  const now = Date.now();
  const entry = usage.get(key);
  if (!entry || entry.resetAt < now) {
    usage.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

function peek(key: string): number {
  const entry = usage.get(key);
  return entry && entry.resetAt >= Date.now() ? entry.count : 0;
}

function scrubPII(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]")
    .replace(/https?:\/\/\S+|www\.\S+/gi, "[link]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[phone]");
}

const Body = z.object({
  text: z.string().trim().min(1),
  field: z.enum(["summary", "experience"]),
  lang: z.enum(["ka", "en"]),
});

const Output = z.object({
  variants: z
    .array(
      z.object({
        kind: z.enum(["simpler", "shorter", "specific"]),
        text: z.string(),
      }),
    )
    .min(1)
    .max(3),
});

const SYSTEM = `You edit text for CVs (résumés). You receive one field from a person's CV and return up to three improved versions of it.

Rules that always apply:
- Use only facts present in the original. Never add experience, employers, achievements, numbers, percentages, dates, tools or skills that the person did not write. If the original is vague, make the wording clearer and more active, but do not invent specifics; "specific" means more precise verbs and structure, not new facts.
- Write in the same language as the original (Georgian or English, as indicated). Keep Georgian natural and grammatical; do not transliterate.
- Keep placeholders such as [email], [phone] and [link] out of the result.
- For an experience description, return one achievement or responsibility per line, starting each line with a past-tense action verb (or the natural Georgian equivalent), without bullet characters.
- For a profile summary, return 2–3 plain sentences, first person implied, no headings.
- Return the kinds "simpler", "shorter" and "specific", each at most once. Skip a kind if it would be identical to the original or to another version.`;

export async function POST(req: NextRequest) {
  const cookieSid = req.cookies.get("cv_sid")?.value;
  const sid = cookieSid ?? randomUUID();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const respond = (body: unknown, status = 200) => {
    const res = NextResponse.json(body, { status });
    if (!cookieSid) {
      res.cookies.set("cv_sid", sid, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: WINDOW_MS / 1000 });
    }
    return res;
  };

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return respond({ error: "generic", used: peek(`s:${sid}`) }, 400);
  const { text, field, lang } = parsed.data;
  if (text.length > MAX_CHARS) return respond({ error: "tooLong", used: peek(`s:${sid}`) }, 413);

  if (peek(`s:${sid}`) >= LIMIT || peek(`i:${ip}`) >= LIMIT * 3) {
    return respond({ error: "limit", used: LIMIT }, 429);
  }

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return respond({ error: "config", used: peek(`s:${sid}`) }, 503);
  }

  const used = bump(`s:${sid}`);
  bump(`i:${ip}`);

  const client = new Anthropic({ timeout: 60_000 });
  const fieldName = field === "summary" ? "profile summary" : "experience description (one line per point)";
  const language = lang === "ka" ? "Georgian" : "English";

  try {
    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(Output) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Field: ${fieldName}\nLanguage: ${language}\n\n<original>\n${scrubPII(text)}\n</original>`,
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      console.warn("[ai/improve] no usable output", { stop: response.stop_reason, field, lang });
      return respond({ error: "generic", used }, 502);
    }

    const seen = new Set<string>();
    const variants = response.parsed_output.variants
      .map((v) => ({ kind: v.kind, text: v.text.trim() }))
      .filter((v) => v.text && v.text !== text.trim() && !seen.has(v.kind) && seen.add(v.kind));

    console.info("[ai/improve] ok", { field, lang, variants: variants.length, in: response.usage.input_tokens, out: response.usage.output_tokens });
    return respond({ variants, used });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      console.warn("[ai/improve] upstream rate limited");
    } else if (err instanceof Anthropic.APIError) {
      console.error("[ai/improve] api error", err.status);
    } else {
      console.error("[ai/improve] unexpected error", err instanceof Error ? err.name : "unknown");
    }
    return respond({ error: "generic", used }, 502);
  }
}
