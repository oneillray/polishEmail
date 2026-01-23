type PolishMode = "fix-clean" | "professional" | "friendly" | "concise";

function modeInstruction(mode: PolishMode): string {
  switch (mode) {
    case "fix-clean":
      return [
        "Only fix grammar, typos, spelling, and punctuation.",
        "Do NOT change tone, wording, formatting, or sentence structure unless strictly required for correctness.",
      ].join(" ");
    case "professional":
      return [
        "Rewrite to be formal, clear, and professional.",
        "Keep the same facts, intent, and structure unless minor restructuring improves clarity without changing meaning.",
      ].join(" ");
    case "friendly":
      return [
        "Rewrite to be warm, friendly, and conversational while staying professional.",
        "Keep the same facts and intent; do not add new information.",
      ].join(" ");
    case "concise":
      return [
        "Shorten the email while preserving all facts and requests.",
        "Remove redundancy; do not remove any specific data (names, dates, numbers, links).",
      ].join(" ");
  }
}

function systemInstruction(): string {
  return [
    "You are a professional email editor.",
    "Your job is to improve the user's email according to the requested mode while preserving meaning.",
    "",
    "Hard constraints (must follow):",
    "- Do NOT introduce new facts, claims, commitments, or details that are not present in the original.",
    "- Do NOT remove or alter specific data such as names, dates, times, addresses, phone numbers, amounts, IDs, and URLs.",
    "- Preserve URLs EXACTLY (do not rewrite, shorten, or reformat links).",
    "- Preserve any tokens/placeholders EXACTLY (examples: {{first_name}}, [Company], <LINK>, {variable}).",
    "- If the email includes a subject line, keep it and edit only its wording (do not invent a subject).",
    "- Output must be plain text only (no markdown, no commentary, no quotes). Output ONLY the edited email.",
  ].join("\n");
}

function userPrompt(emailText: string, mode: PolishMode): string {
  return [
    `Mode: ${mode}`,
    `Mode instructions: ${modeInstruction(mode)}`,
    "",
    "Edit the email below following the constraints.",
    "",
    "EMAIL START",
    emailText,
    "EMAIL END",
  ].join("\n");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing GROQ_API_KEY server env var." }));
    return;
  }

  const text = typeof req.body?.text === "string" ? req.body.text : "";
  const mode = (req.body?.mode as PolishMode | undefined) ?? "professional";
  if (!text.trim()) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing text." }));
    return;
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "User-Agent": "polish-feature-vercel/1.0",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemInstruction() },
        { role: "user", content: userPrompt(text, mode) },
      ],
    }),
  });

  if (!groqRes.ok) {
    const details = await groqRes.text().catch(() => "");
    const requestId =
      groqRes.headers.get("x-request-id") ||
      groqRes.headers.get("x-groq-request-id") ||
      groqRes.headers.get("cf-ray") ||
      undefined;

    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `Groq request failed (${groqRes.status}).`,
        requestId,
        details: details.slice(0, 1000),
      }),
    );
    return;
  }

  const data = (await groqRes.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const output = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!output) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Groq returned an empty response." }));
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ polished: output }));
}

