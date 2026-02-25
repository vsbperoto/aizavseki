import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedContext } from "@/lib/api/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const { id } = await params;
  const conversationId = id.trim();
  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

