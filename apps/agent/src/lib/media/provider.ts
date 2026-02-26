import { resolveGatewayModel } from "@/lib/agent/capabilities";
import type { MediaIntent } from "@/lib/agent/router";
import type {
  ImageGenerationResult,
  VideoGenerationCreateResult,
  VideoGenerationStatusResult,
  MediaJobStatus,
} from "./types";

type GatewayCallResult = {
  path: string;
  status: number;
  payload: unknown;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function getGatewayContext() {
  const baseUrl = getRequiredEnv("OPENCLAW_GATEWAY_BASE_URL").replace(/\/+$/, "");
  const token = getRequiredEnv("OPENCLAW_GATEWAY_TOKEN");
  const agentId = process.env.OPENCLAW_AGENT_ID?.trim() || "main";
  return { baseUrl, token, agentId };
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mapProviderStatus(rawStatus: string): MediaJobStatus {
  const normalized = rawStatus.toLowerCase();
  if (["queued", "pending", "created"].includes(normalized)) {
    return "queued";
  }
  if (["running", "processing", "in_progress"].includes(normalized)) {
    return "running";
  }
  if (["succeeded", "completed", "done", "success"].includes(normalized)) {
    return "succeeded";
  }
  if (["failed", "error"].includes(normalized)) {
    return "failed";
  }
  if (["cancelled", "canceled"].includes(normalized)) {
    return "cancelled";
  }
  return "running";
}

function extractUrlCandidate(payload: unknown) {
  const root = asRecord(payload);

  const directUrl =
    asString(root.url) ||
    asString(root.output_url) ||
    asString(root.video_url) ||
    asString(root.image_url);
  if (directUrl) {
    return directUrl;
  }

  const dataArray = Array.isArray(root.data) ? root.data : [];
  const firstData = asRecord(dataArray[0]);
  const nestedUrl =
    asString(firstData.url) ||
    asString(firstData.output_url) ||
    asString(firstData.image_url) ||
    asString(firstData.video_url);
  if (nestedUrl) {
    return nestedUrl;
  }

  const resultArray = Array.isArray(root.results) ? root.results : [];
  const firstResult = asRecord(resultArray[0]);
  const resultUrl = asString(firstResult.url) || asString(firstResult.output_url);
  if (resultUrl) {
    return resultUrl;
  }

  return "";
}

function extractMimeTypeCandidate(payload: unknown) {
  const root = asRecord(payload);
  const direct = asString(root.mime_type) || asString(root.mimeType);
  if (direct) {
    return direct;
  }

  const dataArray = Array.isArray(root.data) ? root.data : [];
  const firstData = asRecord(dataArray[0]);
  return asString(firstData.mime_type) || asString(firstData.mimeType) || null;
}

async function tryGatewayJson(paths: string[], body: Record<string, unknown>) {
  const { baseUrl, token, agentId } = getGatewayContext();
  let lastError = "Gateway request failed.";

  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-openclaw-agent-id": agentId,
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type") || "";
    let payload: unknown = {};
    try {
      payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      if ([404, 405].includes(response.status)) {
        lastError = `Endpoint not available: ${path}`;
        continue;
      }

      const payloadRecord = asRecord(payload);
      const errRecord = asRecord(payloadRecord.error);
      const errMessage =
        asString(errRecord.message) || asString(payloadRecord.message) || response.statusText;
      throw new Error(errMessage || `Gateway error (${response.status})`);
    }

    return {
      path,
      status: response.status,
      payload,
    } satisfies GatewayCallResult;
  }

  throw new Error(lastError);
}

async function tryGatewayGet(paths: string[]) {
  const { baseUrl, token, agentId } = getGatewayContext();
  let lastError = "Gateway status endpoint unavailable.";

  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-openclaw-agent-id": agentId,
      },
    });

    const contentType = response.headers.get("content-type") || "";
    let payload: unknown = {};
    try {
      payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      if ([404, 405].includes(response.status)) {
        lastError = `Status endpoint not available: ${path}`;
        continue;
      }

      const payloadRecord = asRecord(payload);
      const errRecord = asRecord(payloadRecord.error);
      const errMessage =
        asString(errRecord.message) || asString(payloadRecord.message) || response.statusText;
      throw new Error(errMessage || `Gateway status error (${response.status})`);
    }

    return {
      path,
      status: response.status,
      payload,
    };
  }

  throw new Error(lastError);
}

export async function generateImageViaGateway(intent: MediaIntent): Promise<ImageGenerationResult> {
  const model = resolveGatewayModel(intent.modelAlias);
  if (model.kind !== "image") {
    throw new Error("Image generation called with non-image model.");
  }

  const call = await tryGatewayJson(
    ["/v1/images/generations", "/v1/image/generations"],
    {
      model: model.gatewayModel,
      prompt: intent.prompt,
      n: 1,
      response_format: "url",
    },
  );

  const url = extractUrlCandidate(call.payload);
  if (!url) {
    throw new Error("Image generation completed without output URL.");
  }

  const payloadRecord = asRecord(call.payload);
  const dataArray = Array.isArray(payloadRecord.data) ? payloadRecord.data : [];
  const firstData = asRecord(dataArray[0]);
  const width = asNumber(firstData.width) ?? asNumber(payloadRecord.width);
  const height = asNumber(firstData.height) ?? asNumber(payloadRecord.height);
  const providerAssetId =
    asString(firstData.id) || asString(payloadRecord.id) || asString(payloadRecord.job_id) || null;

  return {
    url,
    mimeType: extractMimeTypeCandidate(call.payload),
    width,
    height,
    providerAssetId,
    raw: {
      path: call.path,
      payload: asRecord(call.payload),
    },
  };
}

export async function createVideoGenerationViaGateway(
  intent: MediaIntent,
): Promise<VideoGenerationCreateResult> {
  const model = resolveGatewayModel(intent.modelAlias);
  if (model.kind !== "video") {
    throw new Error("Video generation called with non-video model.");
  }

  const call = await tryGatewayJson(
    ["/v1/videos/generations", "/v1/video/generations"],
    {
      model: model.gatewayModel,
      prompt: intent.prompt,
    },
  );

  const payloadRecord = asRecord(call.payload);
  const dataArray = Array.isArray(payloadRecord.data) ? payloadRecord.data : [];
  const firstData = asRecord(dataArray[0]);
  const statusRaw =
    asString(payloadRecord.status) || asString(firstData.status) || "queued";
  const status = mapProviderStatus(statusRaw);
  const providerJobId =
    asString(payloadRecord.id) ||
    asString(payloadRecord.job_id) ||
    asString(firstData.id) ||
    null;

  return {
    providerJobId,
    status,
    progress: asNumber(payloadRecord.progress) ?? 0,
    url: extractUrlCandidate(call.payload) || null,
    thumbnailUrl: asString(payloadRecord.thumbnail_url) || null,
    durationSec: asNumber(payloadRecord.duration_sec),
    mimeType: extractMimeTypeCandidate(call.payload),
    raw: {
      path: call.path,
      payload: payloadRecord,
    },
  };
}

export async function getVideoGenerationStatusViaGateway(
  providerJobId: string,
): Promise<VideoGenerationStatusResult> {
  const call = await tryGatewayGet([
    `/v1/videos/generations/${providerJobId}`,
    `/v1/video/generations/${providerJobId}`,
  ]);

  const payloadRecord = asRecord(call.payload);
  const statusRaw = asString(payloadRecord.status) || "running";
  const status = mapProviderStatus(statusRaw);

  return {
    status,
    progress: asNumber(payloadRecord.progress) ?? 0,
    url: extractUrlCandidate(call.payload) || null,
    thumbnailUrl: asString(payloadRecord.thumbnail_url) || null,
    durationSec: asNumber(payloadRecord.duration_sec),
    mimeType: extractMimeTypeCandidate(call.payload),
    errorText: asString(payloadRecord.error_text) || asString(asRecord(payloadRecord.error).message) || null,
    raw: {
      path: call.path,
      payload: payloadRecord,
    },
  };
}
