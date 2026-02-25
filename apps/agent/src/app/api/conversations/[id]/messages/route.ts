import { NextRequest, NextResponse } from "next/server";
import type { MessageRow } from "@/lib/agent/types";
import { getAuthenticatedContext } from "@/lib/api/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

function mapMessage(message: MessageRow) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    meta: message.meta_json ?? {},
    createdAt: message.created_at,
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const { id } = await params;
  const conversationId = id.trim();
  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 });
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit") || "120");
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.floor(limitParam), 1), 300)
    : 120;

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (conversationError) {
    return NextResponse.json({ error: conversationError.message }, { status: 500 });
  }

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    messages: (data || []).map((row) => mapMessage(row as MessageRow)),
  });
}

