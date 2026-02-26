import { NextRequest, NextResponse } from "next/server";
import { detectMediaIntent } from "@/lib/agent/router";
import type { MediaModelAlias } from "@/lib/agent/capabilities";
import { getAuthenticatedContext } from "@/lib/api/auth";
import {
  createVideoJobAndDispatch,
  mapMediaAsset,
  mapMediaJob,
  runImageGenerationAndPersist,
} from "@/lib/media/service";

type GenerateMediaBody = {
  conversationId?: string;
  kind?: "image" | "video";
  prompt?: string;
  modelAlias?: MediaModelAlias;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function resolveImageAlias(explicitAlias: MediaModelAlias | undefined, prompt: string) {
  if (explicitAlias === "nano-banana" || explicitAlias === "nano-banana-pro") {
    return explicitAlias;
  }

  const normalized = prompt.toLowerCase();
  const highQualityHints = [
    "pro",
    "premium",
    "high quality",
    "високо качество",
    "фотореал",
    "детайл",
  ];
  return highQualityHints.some((hint) => normalized.includes(hint))
    ? "nano-banana-pro"
    : "nano-banana";
}

export async function POST(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  try {
    const body = (await request.json()) as GenerateMediaBody;
    const conversationId = asString(body.conversationId);
    const prompt = asString(body.prompt);
    const explicitKind = body.kind;
    const explicitAlias = body.modelAlias;

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId is required." }, { status: 400 });
    }
    if (!prompt) {
      return NextResponse.json({ error: "prompt is required." }, { status: 400 });
    }

    const autoIntent = detectMediaIntent(prompt);
    const kind = explicitKind || autoIntent?.kind;
    if (!kind) {
      return NextResponse.json(
        { error: "Unable to resolve media kind from prompt. Pass kind explicitly." },
        { status: 400 },
      );
    }

    if (kind === "image") {
      const modelAlias = resolveImageAlias(explicitAlias, prompt);
      const { result, job, asset } = await runImageGenerationAndPersist(supabase, {
        userId: user.id,
        conversationId,
        sourceMessageId: null,
        intent: {
          kind,
          modelAlias,
          prompt,
        },
      });

      return NextResponse.json({
        kind: "image",
        status: "succeeded",
        modelAlias,
        url: result.url,
        asset: asset ? mapMediaAsset(asset) : null,
        job: job ? mapMediaJob(job) : null,
      });
    }

    const modelAlias = explicitAlias === "veo-3.1" ? "veo-3.1" : "veo-3.1";
    const { createResult, job, asset } = await createVideoJobAndDispatch(supabase, {
      userId: user.id,
      conversationId,
      sourceMessageId: null,
      intent: {
        kind,
        modelAlias,
        prompt,
      },
    });

    return NextResponse.json({
      kind: "video",
      status: createResult.status,
      modelAlias,
      providerJobId: createResult.providerJobId,
      url: createResult.url,
      job: job ? mapMediaJob(job) : null,
      asset: asset ? mapMediaAsset(asset) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid media generation payload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

