import { NextRequest, NextResponse } from "next/server";
import { asRecord, getMemoryPolicy, getPersona } from "@/lib/agent/memory";
import type { AgentProfileRow } from "@/lib/agent/types";
import { getAuthenticatedContext } from "@/lib/api/auth";

type SetupRequestBody = {
  agentName?: string;
  tone?: string;
  niche?: string;
  audience?: string;
  channels?: string[];
  outputStyle?: string;
  signatureStyle?: string;
  constraints?: string;
  goals?: string;
};

function asString(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 12);
}

function mapProfile(profile: AgentProfileRow) {
  return {
    id: profile.id,
    userId: profile.user_id,
    agentName: profile.agent_name,
    persona: getPersona(profile.persona_json),
    goals: asRecord(profile.goals_json),
    styleGuide: asRecord(profile.style_guide_json),
    memoryPolicy: getMemoryPolicy(profile.memory_policy_json),
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export async function GET() {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  const { data, error } = await supabase
    .from("agent_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    profile: data ? mapProfile(data as AgentProfileRow) : null,
  });
}

export async function POST(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  try {
    const body = (await request.json()) as SetupRequestBody;

    const agentName = asString(body.agentName, "My Content Creator");
    const tone = asString(body.tone, "clear and practical");
    const niche = asString(body.niche, "content creation");
    const audience = asString(body.audience, "small business owners");
    const channels = asStringArray(body.channels);
    const outputStyle = asString(body.outputStyle, "concise and actionable");
    const signatureStyle = asString(body.signatureStyle, "hook + value + CTA");
    const constraints = asString(body.constraints, "");
    const goals = asString(body.goals, "");

    const memoryPolicy = {
      summaryWindowMessages: 12,
      globalSummaryCadence: 3,
      maxInjectedFacts: 8,
      maxInjectedRelations: 6,
    };

    const { data, error } = await supabase
      .from("agent_profiles")
      .upsert(
        {
          user_id: user.id,
          agent_name: agentName,
          persona_json: {
            tone,
            niche,
            audience,
            channels,
            outputStyle,
            signatureStyle,
            constraints,
            goals,
          },
          goals_json: {
            primary: goals,
          },
          style_guide_json: {
            outputStyle,
            signatureStyle,
          },
          memory_policy_json: memoryPolicy,
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to save setup." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      profile: mapProfile(data as AgentProfileRow),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid setup payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

