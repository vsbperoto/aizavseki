import { NextRequest, NextResponse } from "next/server";
import type { MediaAssetRow } from "@/lib/media/types";
import { getAuthenticatedContext } from "@/lib/api/auth";
import {
  getMediaJob,
  mapMediaAsset,
  mapMediaJob,
  pollVideoJobAndPersist,
} from "@/lib/media/service";

type Params = {
  id: string;
};

export async function GET(_request: NextRequest, context: { params: Promise<Params> }) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const { id } = await context.params;
  const jobId = typeof id === "string" ? id.trim() : "";
  if (!jobId) {
    return NextResponse.json({ error: "Job id is required." }, { status: 400 });
  }

  try {
    const mediaJob = await getMediaJob(supabase, {
      jobId,
      userId: user.id,
    });

    if (!mediaJob) {
      return NextResponse.json({ error: "Media job not found." }, { status: 404 });
    }

    let updatedJob = mediaJob;
    if (
      mediaJob.kind === "video" &&
      mediaJob.provider_job_id &&
      (mediaJob.status === "queued" || mediaJob.status === "running")
    ) {
      updatedJob = await pollVideoJobAndPersist(supabase, {
        userId: user.id,
        job: mediaJob,
      });
    }

    const { data: assetRows, error: assetError } = await supabase
      .from("media_assets")
      .select("*")
      .eq("job_id", updatedJob.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (assetError) {
      return NextResponse.json({ error: assetError.message }, { status: 500 });
    }

    return NextResponse.json({
      job: mapMediaJob(updatedJob),
      assets: (assetRows || []).map((row) => mapMediaAsset(row as MediaAssetRow)),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error while checking media job.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

