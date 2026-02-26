import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaIntent } from "@/lib/agent/router";
import type { MediaAssetRow, MediaJobRow, MediaJobStatus } from "./types";
import {
  createVideoGenerationViaGateway,
  generateImageViaGateway,
  getVideoGenerationStatusViaGateway,
} from "./provider";

type JsonObject = Record<string, unknown>;

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function isMissingMediaTable(error: unknown) {
  const message =
    typeof error === "string"
      ? error
      : asRecord(error).message
        ? String(asRecord(error).message)
        : "";

  return (
    message.includes("relation") &&
    (message.includes("media_jobs") || message.includes("media_assets")) &&
    message.includes("does not exist")
  );
}

export function isMissingMediaSchemaError(error: unknown) {
  return isMissingMediaTable(error);
}

export async function createMediaJob(
  supabase: SupabaseClient,
  args: {
    userId: string;
    conversationId: string;
    sourceMessageId: string | null;
    kind: "image" | "video";
    modelAlias: string;
    promptText: string;
    status: MediaJobStatus;
    inputJson?: JsonObject;
    providerJobId?: string | null;
    progress?: number;
    errorText?: string | null;
    resultJson?: JsonObject;
  },
) {
  const nowIso = new Date().toISOString();
  const insertPayload = {
    user_id: args.userId,
    conversation_id: args.conversationId,
    source_message_id: args.sourceMessageId,
    kind: args.kind,
    model_alias: args.modelAlias,
    provider_job_id: args.providerJobId || null,
    status: args.status,
    progress: args.progress ?? 0,
    prompt_text: args.promptText,
    input_json: args.inputJson || {},
    error_text: args.errorText || null,
    result_json: args.resultJson || {},
    started_at: ["running", "succeeded", "failed"].includes(args.status) ? nowIso : null,
    finished_at: ["succeeded", "failed", "cancelled"].includes(args.status) ? nowIso : null,
  };

  const { data, error } = await supabase
    .from("media_jobs")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as MediaJobRow;
}

export async function updateMediaJob(
  supabase: SupabaseClient,
  args: {
    jobId: string;
    userId: string;
    status?: MediaJobStatus;
    progress?: number;
    providerJobId?: string | null;
    errorText?: string | null;
    resultJson?: JsonObject;
  },
) {
  const patch: Record<string, unknown> = {};
  if (args.status) {
    patch.status = args.status;
  }
  if (typeof args.progress === "number") {
    patch.progress = args.progress;
  }
  if (typeof args.providerJobId !== "undefined") {
    patch.provider_job_id = args.providerJobId;
  }
  if (typeof args.errorText !== "undefined") {
    patch.error_text = args.errorText;
  }
  if (typeof args.resultJson !== "undefined") {
    patch.result_json = args.resultJson;
  }

  if (args.status && ["running", "succeeded", "failed"].includes(args.status)) {
    patch.started_at = patch.started_at || new Date().toISOString();
  }
  if (args.status && ["succeeded", "failed", "cancelled"].includes(args.status)) {
    patch.finished_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("media_jobs")
    .update(patch)
    .eq("id", args.jobId)
    .eq("user_id", args.userId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as MediaJobRow;
}

export async function getMediaJob(
  supabase: SupabaseClient,
  args: {
    jobId: string;
    userId: string;
  },
) {
  const { data, error } = await supabase
    .from("media_jobs")
    .select("*")
    .eq("id", args.jobId)
    .eq("user_id", args.userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? (data as MediaJobRow) : null;
}

export async function createMediaAsset(
  supabase: SupabaseClient,
  args: {
    userId: string;
    conversationId: string;
    jobId: string | null;
    kind: "image" | "video";
    modelAlias: string;
    promptText: string;
    publicUrl: string;
    thumbnailUrl?: string | null;
    mimeType?: string | null;
    width?: number | null;
    height?: number | null;
    durationSec?: number | null;
    providerAssetId?: string | null;
    storageProvider?: string;
    storageKey?: string | null;
    metaJson?: JsonObject;
  },
) {
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      user_id: args.userId,
      conversation_id: args.conversationId,
      job_id: args.jobId,
      kind: args.kind,
      model_alias: args.modelAlias,
      provider_asset_id: args.providerAssetId || null,
      storage_provider: args.storageProvider || "external",
      storage_key: args.storageKey || null,
      public_url: args.publicUrl,
      thumbnail_url: args.thumbnailUrl || null,
      mime_type: args.mimeType || null,
      width: args.width || null,
      height: args.height || null,
      duration_sec: args.durationSec || null,
      prompt_text: args.promptText,
      meta_json: args.metaJson || {},
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as MediaAssetRow;
}

export function mapMediaJob(job: MediaJobRow) {
  return {
    id: job.id,
    kind: job.kind,
    modelAlias: job.model_alias,
    status: job.status,
    progress: job.progress,
    promptText: job.prompt_text,
    providerJobId: job.provider_job_id,
    errorText: job.error_text,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
    startedAt: job.started_at,
    finishedAt: job.finished_at,
    result: job.result_json || {},
  };
}

export function mapMediaAsset(asset: MediaAssetRow) {
  return {
    id: asset.id,
    kind: asset.kind,
    modelAlias: asset.model_alias,
    url: asset.public_url,
    thumbnailUrl: asset.thumbnail_url,
    mimeType: asset.mime_type,
    width: asset.width,
    height: asset.height,
    durationSec: asset.duration_sec,
    promptText: asset.prompt_text,
    createdAt: asset.created_at,
  };
}

export function buildImageAssistantMessage(args: {
  modelAlias: string;
  assetUrl: string;
}) {
  return [
    `✅ Готово. Генерирах изображение с модел **${args.modelAlias}**.`,
    `URL: ${args.assetUrl}`,
    "Мога да направя и варианти с различни стилове/композиции.",
  ].join("\n");
}

export function buildVideoQueuedAssistantMessage(args: {
  modelAlias: string;
  jobId: string;
  status: MediaJobStatus;
}) {
  return [
    `🎬 Стартирах видео генерация с **${args.modelAlias}**.`,
    `Job ID: ${args.jobId}`,
    `Status: ${args.status}`,
    `Провери статуса през /api/media/jobs/${args.jobId}.`,
  ].join("\n");
}

export function buildVideoReadyAssistantMessage(args: {
  modelAlias: string;
  jobId: string;
  assetUrl: string;
}) {
  return [
    `🎬 Видеото е готово с **${args.modelAlias}**.`,
    `Job ID: ${args.jobId}`,
    `URL: ${args.assetUrl}`,
  ].join("\n");
}

export async function runImageGenerationAndPersist(
  supabase: SupabaseClient,
  args: {
    userId: string;
    conversationId: string;
    sourceMessageId: string | null;
    intent: MediaIntent;
  },
) {
  const result = await generateImageViaGateway(args.intent);
  let job: MediaJobRow | null = null;
  let asset: MediaAssetRow | null = null;

  try {
    job = await createMediaJob(supabase, {
      userId: args.userId,
      conversationId: args.conversationId,
      sourceMessageId: args.sourceMessageId,
      kind: "image",
      modelAlias: args.intent.modelAlias,
      promptText: args.intent.prompt,
      status: "succeeded",
      progress: 100,
      resultJson: result.raw,
    });

    asset = await createMediaAsset(supabase, {
      userId: args.userId,
      conversationId: args.conversationId,
      jobId: job.id,
      kind: "image",
      modelAlias: args.intent.modelAlias,
      promptText: args.intent.prompt,
      publicUrl: result.url,
      mimeType: result.mimeType,
      width: result.width,
      height: result.height,
      providerAssetId: result.providerAssetId,
      metaJson: result.raw,
    });
  } catch (error) {
    if (!isMissingMediaTable(error)) {
      throw error;
    }
  }

  return { result, job, asset };
}

export async function createVideoJobAndDispatch(
  supabase: SupabaseClient,
  args: {
    userId: string;
    conversationId: string;
    sourceMessageId: string | null;
    intent: MediaIntent;
  },
) {
  const createResult = await createVideoGenerationViaGateway(args.intent);
  let job: MediaJobRow | null = null;
  let asset: MediaAssetRow | null = null;

  try {
    const jobStatus =
      createResult.status === "succeeded" && createResult.url ? "succeeded" : createResult.status;

    job = await createMediaJob(supabase, {
      userId: args.userId,
      conversationId: args.conversationId,
      sourceMessageId: args.sourceMessageId,
      kind: "video",
      modelAlias: args.intent.modelAlias,
      promptText: args.intent.prompt,
      status: jobStatus,
      providerJobId: createResult.providerJobId,
      progress: createResult.progress,
      resultJson: createResult.raw,
    });

    if (createResult.url) {
      asset = await createMediaAsset(supabase, {
        userId: args.userId,
        conversationId: args.conversationId,
        jobId: job.id,
        kind: "video",
        modelAlias: args.intent.modelAlias,
        promptText: args.intent.prompt,
        publicUrl: createResult.url,
        thumbnailUrl: createResult.thumbnailUrl,
        durationSec: createResult.durationSec,
        mimeType: createResult.mimeType,
        providerAssetId: null,
        metaJson: createResult.raw,
      });
    }
  } catch (error) {
    if (!isMissingMediaTable(error)) {
      throw error;
    }
  }

  return { createResult, job, asset };
}

export async function pollVideoJobAndPersist(
  supabase: SupabaseClient,
  args: {
    userId: string;
    job: MediaJobRow;
  },
) {
  if (!args.job.provider_job_id) {
    return args.job;
  }

  const statusResult = await getVideoGenerationStatusViaGateway(args.job.provider_job_id);
  const nextStatus = statusResult.status;

  let updatedJob = args.job;
  try {
    updatedJob = await updateMediaJob(supabase, {
      userId: args.userId,
      jobId: args.job.id,
      status: nextStatus,
      progress: statusResult.progress,
      errorText: statusResult.errorText,
      resultJson: statusResult.raw,
    });

    if (statusResult.url && nextStatus === "succeeded") {
      const { data: existingAsset, error: assetQueryError } = await supabase
        .from("media_assets")
        .select("*")
        .eq("job_id", args.job.id)
        .eq("user_id", args.userId)
        .limit(1)
        .maybeSingle();

      if (assetQueryError) {
        throw assetQueryError;
      }

      if (!existingAsset) {
        await createMediaAsset(supabase, {
          userId: args.userId,
          conversationId: args.job.conversation_id,
          jobId: args.job.id,
          kind: "video",
          modelAlias: args.job.model_alias,
          promptText: args.job.prompt_text,
          publicUrl: statusResult.url,
          thumbnailUrl: statusResult.thumbnailUrl,
          durationSec: statusResult.durationSec,
          mimeType: statusResult.mimeType,
          metaJson: statusResult.raw,
        });
      }
    }
  } catch (error) {
    if (!isMissingMediaTable(error)) {
      throw error;
    }
  }

  return updatedJob;
}

