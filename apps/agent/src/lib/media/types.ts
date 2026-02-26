import type { MediaKind, MediaModelAlias } from "@/lib/agent/capabilities";

export type MediaJobStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

export type MediaJobRow = {
  id: string;
  user_id: string;
  conversation_id: string;
  source_message_id: string | null;
  kind: MediaKind;
  model_alias: MediaModelAlias;
  provider_job_id: string | null;
  status: MediaJobStatus;
  progress: number;
  prompt_text: string;
  input_json: Record<string, unknown>;
  error_text: string | null;
  result_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export type MediaAssetRow = {
  id: string;
  user_id: string;
  conversation_id: string;
  job_id: string | null;
  kind: MediaKind;
  model_alias: MediaModelAlias;
  provider_asset_id: string | null;
  storage_provider: string;
  storage_key: string | null;
  public_url: string;
  thumbnail_url: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  duration_sec: number | null;
  prompt_text: string;
  meta_json: Record<string, unknown>;
  created_at: string;
};

export type ImageGenerationResult = {
  url: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  providerAssetId: string | null;
  raw: Record<string, unknown>;
};

export type VideoGenerationCreateResult = {
  providerJobId: string | null;
  status: MediaJobStatus;
  progress: number;
  url: string | null;
  thumbnailUrl: string | null;
  durationSec: number | null;
  mimeType: string | null;
  raw: Record<string, unknown>;
};

export type VideoGenerationStatusResult = {
  status: MediaJobStatus;
  progress: number;
  url: string | null;
  thumbnailUrl: string | null;
  durationSec: number | null;
  mimeType: string | null;
  errorText: string | null;
  raw: Record<string, unknown>;
};

