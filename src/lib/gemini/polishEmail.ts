export type PolishMode = "fix-clean" | "professional" | "friendly" | "concise";

type Options = {
  endpoint?: string;
};

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

export async function polishEmail(text: string, mode: PolishMode, options?: Options) {
  const endpoint = options?.endpoint ?? "/api/polish";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      mode,
    }),
  });

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    throw new Error(
      `Polish request failed (${res.status}). ${
        details ? details.slice(0, 500) : ""
      }`.trim(),
    );
  }

  const data = (await res.json()) as { polished?: string };
  const output = (data.polished ?? "").trim();
  if (!output) throw new Error("Polish service returned an empty response.");
  return output;
}

