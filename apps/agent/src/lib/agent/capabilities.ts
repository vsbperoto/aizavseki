export type MediaKind = "image" | "video";
export type MediaModelAlias = "nano-banana" | "nano-banana-pro" | "veo-3.1";

type GatewayModelConfig = {
  alias: MediaModelAlias;
  kind: MediaKind;
  envName: string;
  fallback: string;
};

const GATEWAY_MODEL_CONFIGS: GatewayModelConfig[] = [
  {
    alias: "nano-banana",
    kind: "image",
    envName: "OPENCLAW_IMAGE_MODEL_STANDARD",
    fallback: "google/gemini-2.5-flash-image-preview",
  },
  {
    alias: "nano-banana-pro",
    kind: "image",
    envName: "OPENCLAW_IMAGE_MODEL_PRO",
    fallback: "google/gemini-3-pro-image-preview",
  },
  {
    alias: "veo-3.1",
    kind: "video",
    envName: "OPENCLAW_VIDEO_MODEL",
    fallback: "google/veo-3.1",
  },
];

export function resolveGatewayModel(alias: MediaModelAlias) {
  const config = GATEWAY_MODEL_CONFIGS.find((item) => item.alias === alias);
  if (!config) {
    throw new Error(`Unsupported media model alias: ${alias}`);
  }

  const configured = process.env[config.envName]?.trim();
  const gatewayModel = configured && configured.length > 0 ? configured : config.fallback;

  return {
    alias: config.alias,
    kind: config.kind,
    gatewayModel,
  };
}

export function getCapabilityPromptBlock() {
  return [
    "Execution capabilities:",
    "- You CAN generate images directly for the user.",
    "- You CAN generate videos directly for the user.",
    "- Available image models: nano-banana (fast), nano-banana-pro (high quality).",
    "- Available video model: veo-3.1 (asynchronous generation).",
    "- When the user asks for creation, execute generation instead of refusing.",
    "- For image requests: produce at least one usable output URL.",
    "- For video requests: start a generation job and return the job id + status.",
  ].join("\n");
}

