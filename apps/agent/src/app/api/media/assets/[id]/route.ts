import { NextRequest, NextResponse } from "next/server";
import type { MediaAssetRow } from "@/lib/media/types";
import { getAuthenticatedContext } from "@/lib/api/auth";
import { mapMediaAsset } from "@/lib/media/service";

type Params = {
  id: string;
};

export async function GET(_request: NextRequest, context: { params: Promise<Params> }) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const { id } = await context.params;
  const assetId = typeof id === "string" ? id.trim() : "";
  if (!assetId) {
    return NextResponse.json({ error: "Asset id is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", assetId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  return NextResponse.json({
    asset: mapMediaAsset(data as MediaAssetRow),
  });
}

