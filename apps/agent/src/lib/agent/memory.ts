import type { AgentMemoryPolicy, AgentPersona, MessageRow } from "./types";

export type ExtractedRelation = {
  source: string;
  relationType: string;
  target: string;
};

const ENTITY_STOPWORDS = new Set([
  "I",
  "The",
  "This",
  "That",
  "And",
  "But",
  "We",
  "Our",
  "You",
  "Your",
  "They",
  "Their",
  "It",
  "Its",
  "A",
  "An",
]);

export function clampText(input: string, max = 80) {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 3)}...`;
}

export function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

export function normalizeEntityName(raw: string) {
  return raw
    .replace(/[^\p{L}\p{N}\s\-_.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function extractEntityNames(text: string, max = 12) {
  const output = new Set<string>();
  const capitalized = text.match(
    /\b[A-Z][A-Za-z0-9_-]*(?:\s+[A-Z][A-Za-z0-9_-]*){0,2}\b/g,
  );

  for (const candidate of capitalized || []) {
    const normalized = normalizeEntityName(candidate);
    if (!normalized || ENTITY_STOPWORDS.has(normalized)) {
      continue;
    }
    if (normalized.length < 3) {
      continue;
    }
    output.add(normalized);
    if (output.size >= max) {
      break;
    }
  }

  const described = text.match(
    /\b(?:brand|product|channel|niche|audience|campaign|series)\s*(?:is|:)\s*([A-Za-z0-9][A-Za-z0-9\s._-]{1,60})/gi,
  );
  for (const candidate of described || []) {
    const normalized = normalizeEntityName(
      candidate.replace(
        /\b(?:brand|product|channel|niche|audience|campaign|series)\s*(?:is|:)\s*/i,
        "",
      ),
    );
    if (normalized.length >= 3) {
      output.add(normalized);
    }
    if (output.size >= max) {
      break;
    }
  }

  return [...output];
}

export function extractFacts(text: string, max = 8) {
  const sentences = text
    .split(/[\n.!?]+/)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 25 && sentence.length <= 240);

  return sentences.slice(0, max);
}

export function extractRelations(text: string, knownEntities: string[]) {
  const results: ExtractedRelation[] = [];
  const relationRegex =
    /\b([A-Z][A-Za-z0-9_-]*(?:\s+[A-Z][A-Za-z0-9_-]*){0,2})\s+(is|are|uses|targets|helps|supports|improves|for|with)\s+([A-Z][A-Za-z0-9_-]*(?:\s+[A-Z][A-Za-z0-9_-]*){0,2})/g;
  const knownLower = new Set(knownEntities.map((entity) => entity.toLowerCase()));

  let match: RegExpExecArray | null = relationRegex.exec(text);
  while (match) {
    const source = normalizeEntityName(match[1]);
    const relationType = match[2].toLowerCase();
    const target = normalizeEntityName(match[3]);

    if (
      source.length >= 3 &&
      target.length >= 3 &&
      source.toLowerCase() !== target.toLowerCase() &&
      (knownLower.has(source.toLowerCase()) || knownLower.has(target.toLowerCase()))
    ) {
      results.push({ source, relationType, target });
    }

    match = relationRegex.exec(text);
  }

  return results.slice(0, 12);
}

export function buildConversationSummary(messages: Pick<MessageRow, "role" | "content">[]) {
  const recent = messages.slice(-12);
  const userLines = recent
    .filter((message) => message.role === "user")
    .map((message) => clampText(message.content, 140))
    .slice(-4);
  const assistantLines = recent
    .filter((message) => message.role === "assistant")
    .map((message) => clampText(message.content, 140))
    .slice(-4);

  const lines: string[] = [
    "Conversation snapshot:",
    userLines.length > 0 ? `- User focus: ${userLines.join(" | ")}` : "- User focus: n/a",
    assistantLines.length > 0
      ? `- Assistant outputs: ${assistantLines.join(" | ")}`
      : "- Assistant outputs: n/a",
  ];

  return lines.join("\n");
}

export function getMemoryPolicy(raw: unknown): AgentMemoryPolicy {
  const source = asRecord(raw);
  return {
    summaryWindowMessages: asPositiveInt(source.summaryWindowMessages, 12),
    globalSummaryCadence: asPositiveInt(source.globalSummaryCadence, 3),
    maxInjectedFacts: asPositiveInt(source.maxInjectedFacts, 8),
    maxInjectedRelations: asPositiveInt(source.maxInjectedRelations, 6),
  };
}

export function getPersona(raw: unknown): AgentPersona {
  const source = asRecord(raw);
  const channels = Array.isArray(source.channels)
    ? source.channels.filter((item): item is string => typeof item === "string")
    : [];

  return {
    tone: asString(source.tone, "clear and practical"),
    niche: asString(source.niche, "content creation"),
    audience: asString(source.audience, "business owners and creators"),
    channels,
    outputStyle: asString(source.outputStyle, "concise and actionable"),
    signatureStyle: asString(source.signatureStyle, "structured content plans"),
    constraints: asString(source.constraints, ""),
    goals: asString(source.goals, ""),
  };
}

type PromptContext = {
  agentName: string;
  persona: AgentPersona;
  conversationSummary: string | null;
  globalSummary: string | null;
  memoryFacts: string[];
  memoryRelations: string[];
};

export function buildSystemPrompt(context: PromptContext) {
  const channels = context.persona.channels.length
    ? context.persona.channels.join(", ")
    : "not specified";
  const constraints = context.persona.constraints || "none provided";
  const goals = context.persona.goals || "none provided";

  const lines = [
    `You are ${context.agentName}, a specialized content creator agent.`,
    "Follow the user's persona and memory context strictly.",
    "",
    "Persona:",
    `- Tone: ${context.persona.tone}`,
    `- Niche: ${context.persona.niche}`,
    `- Audience: ${context.persona.audience}`,
    `- Channels: ${channels}`,
    `- Output style: ${context.persona.outputStyle}`,
    `- Signature style: ${context.persona.signatureStyle}`,
    `- Constraints: ${constraints}`,
    `- Goals: ${goals}`,
    "",
    context.globalSummary
      ? `Global memory summary:\n${context.globalSummary}`
      : "Global memory summary: none yet.",
    "",
    context.conversationSummary
      ? `Conversation summary:\n${context.conversationSummary}`
      : "Conversation summary: none yet.",
    "",
    context.memoryFacts.length
      ? `Relevant memory facts:\n${context.memoryFacts.map((fact) => `- ${fact}`).join("\n")}`
      : "Relevant memory facts: none.",
    "",
    context.memoryRelations.length
      ? `Relevant memory relations:\n${context.memoryRelations
          .map((relation) => `- ${relation}`)
          .join("\n")}`
      : "Relevant memory relations: none.",
    "",
    "Response policy:",
    "- Be explicit and useful for content execution.",
    "- Ask one clarifying question only when absolutely necessary.",
    "- If assumptions are needed, list them in short bullet points.",
    "- Keep outputs ready to use (captions, scripts, outlines, hooks, variants).",
  ];

  return lines.join("\n");
}

function asString(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function asPositiveInt(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  const normalized = Math.floor(value);
  return normalized > 0 ? normalized : fallback;
}

