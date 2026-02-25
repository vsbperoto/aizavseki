import { NextRequest, NextResponse } from "next/server";
import type { AgentProfileRow, ConversationRow } from "@/lib/agent/types";
import { clampText } from "@/lib/agent/memory";
import { getAuthenticatedContext } from "@/lib/api/auth";

type CreateConversationBody = {
  title?: string;
  agentProfileId?: string;
};

function mapConversation(conversation: ConversationRow) {
  return {
    id: conversation.id,
    agentProfileId: conversation.agent_profile_id,
    title: conversation.title,
    status: conversation.status,
    messageCount: conversation.message_count || 0,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
}

export async function GET() {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    conversations: (data || []).map((row) => mapConversation(row as ConversationRow)),
  });
}

export async function POST(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  try {
    const body = (await request.json()) as CreateConversationBody;
    const requestedTitle = typeof body.title === "string" ? body.title.trim() : "";
    const title = requestedTitle ? clampText(requestedTitle, 72) : "New chat";

    let agentProfileId =
      typeof body.agentProfileId === "string" ? body.agentProfileId.trim() : "";

    if (!agentProfileId) {
      const { data: profile, error: profileError } = await supabase
        .from("agent_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }

      if (!profile) {
        return NextResponse.json(
          { error: "Agent setup is required before creating conversations." },
          { status: 400 },
        );
      }

      agentProfileId = (profile as AgentProfileRow).id;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        agent_profile_id: agentProfileId,
        title,
        status: "active",
        message_count: 0,
      })
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to create conversation." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      conversation: mapConversation(data as ConversationRow),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid conversation payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

