import type { MediaKind, MediaModelAlias } from "./capabilities";

export type MediaIntent = {
  kind: MediaKind;
  modelAlias: MediaModelAlias;
  prompt: string;
};

const GENERATE_KEYWORDS = [
  "generate",
  "create",
  "make",
  "render",
  "produce",
  "генерирай",
  "създай",
  "направи",
  "изработи",
];

const IMAGE_KEYWORDS = [
  "image",
  "photo",
  "picture",
  "thumbnail",
  "poster",
  "banner",
  "изображение",
  "снимка",
  "картинка",
  "визия",
  "банер",
  "постер",
];

const VIDEO_KEYWORDS = [
  "video",
  "reel",
  "short",
  "shorts",
  "clip",
  "tiktok",
  "видео",
  "рийл",
  "клип",
  "шортс",
  "анимация",
];

const HIGH_QUALITY_HINTS = [
  "pro",
  "premium",
  "high quality",
  "hq",
  "photoreal",
  "ultra detail",
  "високо качество",
  "детайл",
  "фотореал",
  "реалистич",
];

function includesAny(normalized: string, keywords: string[]) {
  return keywords.some((keyword) => normalized.includes(keyword));
}

function normalizePrompt(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

function shouldTriggerGeneration(normalized: string) {
  if (includesAny(normalized, GENERATE_KEYWORDS)) {
    return true;
  }

  // Support short direct prompts like "video ad for bakery..."
  return includesAny(normalized, IMAGE_KEYWORDS) || includesAny(normalized, VIDEO_KEYWORDS);
}

export function detectMediaIntent(rawMessage: string): MediaIntent | null {
  const prompt = normalizePrompt(rawMessage);
  if (!prompt) {
    return null;
  }

  const normalized = prompt.toLowerCase();
  if (!shouldTriggerGeneration(normalized)) {
    return null;
  }

  const isVideo = includesAny(normalized, VIDEO_KEYWORDS);
  const isImage = includesAny(normalized, IMAGE_KEYWORDS);

  if (!isVideo && !isImage) {
    return null;
  }

  if (isVideo) {
    return {
      kind: "video",
      modelAlias: "veo-3.1",
      prompt,
    };
  }

  const usePro = includesAny(normalized, HIGH_QUALITY_HINTS);
  return {
    kind: "image",
    modelAlias: usePro ? "nano-banana-pro" : "nano-banana",
    prompt,
  };
}

