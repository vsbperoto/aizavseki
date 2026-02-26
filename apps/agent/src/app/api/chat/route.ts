import { after, NextRequest, NextResponse } from "next/server";
import {
  buildConversationSummary,
  buildSystemPrompt,
  clampText,
  extractEntityNames,
  extractFacts,
  extractRelations,
  getMemoryPolicy,
  getPersona,
} from "@/lib/agent/memory";
import type {
  AgentProfileRow,
  ConversationRow,
  MemoryEntityRow,
  MemoryFactRow,
  MemoryRelationRow,
  MemorySummaryRow,
  MessageRow,
} from "@/lib/agent/types";
import { getAuthenticatedContext } from "@/lib/api/auth";

type ChatRequestBody = {
  conversationId?: string;
  message?: string;
};

type OpenAiLikeChoice = {
  message?: {
    content?: string;
  };
};

type OpenAiLikeResponse = {
  choices?: OpenAiLikeChoice[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  error?: {
    message?: string;
  };
};

type MemoryContext = {
  globalSummary: string | null;
  conversationSummary: string | null;
  facts: string[];
  relations: string[];
  relatedEntityIds: Set<string>;
};

const inflightByUser = new Map<string, number>();
const MAX_CONCURRENT_REQUESTS_PER_USER = 2;

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function getConversationId(raw: unknown) {
  return typeof raw === "string" ? raw.trim() : "";
}

function getMessageText(raw: unknown) {
  return typeof raw === "string" ? raw.trim() : "";
}

function mapMessage(message: MessageRow) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.created_at,
  };
}

function mapConversation(conversation: ConversationRow) {
  return {
    id: conversation.id,
    title: conversation.title,
    status: conversation.status,
    messageCount: conversation.message_count || 0,
    updatedAt: conversation.updated_at,
  };
}

function isFactValid(validUntil: string | null) {
  if (!validUntil) {
    return true;
  }
  return new Date(validUntil).getTime() > Date.now();
}

async function withConcurrencyLimit<T>(userId: string, task: () => Promise<T>) {
  const active = inflightByUser.get(userId) || 0;
  if (active >= MAX_CONCURRENT_REQUESTS_PER_USER) {
    throw new Error("Too many active requests. Please wait for the current response.");
  }

  inflightByUser.set(userId, active + 1);
  try {
    return await task();
  } finally {
    const next = (inflightByUser.get(userId) || 1) - 1;
    if (next <= 0) {
      inflightByUser.delete(userId);
    } else {
      inflightByUser.set(userId, next);
    }
  }
}

async function loadMemoryContext(
  supabase: Awaited<ReturnType<typeof getAuthenticatedContext>>["supabase"],
  userId: string,
  conversationId: string,
  latestUserInput: string,
  maxFacts: number,
  maxRelations: number,
): Promise<MemoryContext> {
  const queryEntityNames = extractEntityNames(latestUserInput, 8);
  const [summaryResult, entityResult, factResult, relationResult] = await Promise.all([
    supabase
      .from("memory_summaries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("memory_entities")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(80),
    supabase
      .from("memory_facts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(120),
    supabase
      .from("memory_relations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(120),
  ]);

  if (summaryResult.error) {
    throw new Error(summaryResult.error.message);
  }
  if (entityResult.error) {
    throw new Error(entityResult.error.message);
  }
  if (factResult.error) {
    throw new Error(factResult.error.message);
  }
  if (relationResult.error) {
    throw new Error(relationResult.error.message);
  }

  const summaries = (summaryResult.data || []) as MemorySummaryRow[];
  const entities = (entityResult.data || []) as MemoryEntityRow[];
  const facts = ((factResult.data || []) as MemoryFactRow[]).filter((fact) =>
    isFactValid(fact.valid_until),
  );
  const relations = (relationResult.data || []) as MemoryRelationRow[];

  const entityScore = new Map<string, number>();
  for (const entity of entities) {
    let score = 0;
    const canonical = entity.canonical_name.toLowerCase();
    if (latestUserInput.toLowerCase().includes(canonical)) {
      score += 4;
    }
    for (const queryName of queryEntityNames) {
      if (canonical.includes(queryName.toLowerCase())) {
        score += 3;
      }
    }
    score += 1;
    entityScore.set(entity.id, score);
  }

  const topEntities = [...entities]
    .sort((left, right) => (entityScore.get(right.id) || 0) - (entityScore.get(left.id) || 0))
    .slice(0, 10);

  const topEntityIds = new Set(topEntities.map((entity) => entity.id));
  const nameById = new Map(topEntities.map((entity) => [entity.id, entity.canonical_name]));

  const selectedFacts = facts
    .filter((fact) => !fact.entity_id || topEntityIds.has(fact.entity_id))
    .slice(0, maxFacts)
    .map((fact) => {
      if (!fact.entity_id) {
        return fact.fact_text;
      }
      const entityName = nameById.get(fact.entity_id) || "entity";
      return `${entityName}: ${fact.fact_text}`;
    });

  const selectedRelations = relations
    .filter(
      (relation) =>
        topEntityIds.has(relation.source_entity_id) || topEntityIds.has(relation.target_entity_id),
    )
    .slice(0, maxRelations)
    .map((relation) => {
      const source = nameById.get(relation.source_entity_id) || relation.source_entity_id;
      const target = nameById.get(relation.target_entity_id) || relation.target_entity_id;
      return `${source} ${relation.relation_type} ${target}`;
    });

  const conversationSummary =
    summaries.find((summary) => summary.conversation_id === conversationId)?.summary_text || null;
  const globalSummary =
    summaries.find((summary) => summary.conversation_id === null)?.summary_text || null;

  return {
    globalSummary,
    conversationSummary,
    facts: selectedFacts,
    relations: selectedRelations,
    relatedEntityIds: topEntityIds,
  };
}

async function upsertEntities(
  supabase: Awaited<ReturnType<typeof getAuthenticatedContext>>["supabase"],
  userId: string,
  entityNames: string[],
) {
  const entityIdByName = new Map<string, string>();

  const uniqueNames = [...new Set(entityNames)];
  if (uniqueNames.length === 0) {
    return entityIdByName;
  }

  const { data, error } = await supabase
    .from("memory_entities")
    .upsert(
      uniqueNames.map((name) => ({
        user_id: userId,
        canonical_name: name,
        entity_type: "concept",
        attributes_json: {},
      })),
      { onConflict: "user_id,canonical_name" },
    )
    .select("*");

  if (error || !data) {
    throw new Error(error?.message || "Failed to upsert entity.");
  }

  for (const entity of data as MemoryEntityRow[]) {
    entityIdByName.set(entity.canonical_name, entity.id);
  }

  return entityIdByName;
}

async function persistMemory(
  supabase: Awaited<ReturnType<typeof getAuthenticatedContext>>["supabase"],
  args: {
    userId: string;
    conversationId: string;
    userText: string;
    assistantText: string;
    assistantMessageId: string;
  },
) {
  const names = extractEntityNames(`${args.userText}\n${args.assistantText}`);
  if (names.length === 0) {
    return {
      entityCount: 0,
      factCount: 0,
      relationCount: 0,
    };
  }

  const entityMap = await upsertEntities(supabase, args.userId, names);
  const facts = extractFacts(args.assistantText, 8);
  const relations = extractRelations(args.assistantText, names);
  const nowIso = new Date().toISOString();

  let factCount = 0;
  let relationCount = 0;

  const factRows = facts.map((fact) => {
    const matchingEntityName = names.find((name) =>
      fact.toLowerCase().includes(name.toLowerCase()),
    );
    const entityId = matchingEntityName ? entityMap.get(matchingEntityName) || null : null;

    return {
      user_id: args.userId,
      entity_id: entityId,
      fact_text: fact,
      confidence: 0.72,
      valid_from: nowIso,
      valid_until: null,
      source_message_id: args.assistantMessageId,
    };
  });

  if (factRows.length > 0) {
    const { error } = await supabase.from("memory_facts").insert(factRows);
    if (!error) {
      factCount = factRows.length;
    }
  }

  for (const relation of relations) {
    const sourceId = entityMap.get(relation.source);
    const targetId = entityMap.get(relation.target);
    if (!sourceId || !targetId || sourceId === targetId) {
      continue;
    }

    await supabase
      .from("memory_relations")
      .update({ valid_until: nowIso })
      .eq("user_id", args.userId)
      .eq("source_entity_id", sourceId)
      .eq("relation_type", relation.relationType)
      .is("valid_until", null)
      .neq("target_entity_id", targetId);

    const { error } = await supabase.from("memory_relations").insert({
      user_id: args.userId,
      source_entity_id: sourceId,
      relation_type: relation.relationType,
      target_entity_id: targetId,
      confidence: 0.68,
      valid_from: nowIso,
      valid_until: null,
      evidence_message_id: args.assistantMessageId,
    });

    if (!error) {
      relationCount += 1;
    }
  }

  return {
    entityCount: entityMap.size,
    factCount,
    relationCount,
  };
}

async function refreshSummariesIfNeeded(
  supabase: Awaited<ReturnType<typeof getAuthenticatedContext>>["supabase"],
  args: {
    userId: string;
    conversationId: string;
    totalMessageCount: number;
    summaryWindowMessages: number;
    globalSummaryCadence: number;
  },
) {
  if (args.totalMessageCount % args.summaryWindowMessages !== 0) {
    return;
  }

  const { data: messageRows, error: messageError } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", args.userId)
    .eq("conversation_id", args.conversationId)
    .order("created_at", { ascending: true })
    .limit(args.summaryWindowMessages);

  if (messageError || !messageRows || messageRows.length === 0) {
    return;
  }

  const messages = messageRows as MessageRow[];
  const summaryText = buildConversationSummary(messages);

  await supabase.from("memory_summaries").insert({
    user_id: args.userId,
    conversation_id: args.conversationId,
    summary_text: summaryText,
    window_start_message_id: messages[0].id,
    window_end_message_id: messages[messages.length - 1].id,
  });

  const shouldRefreshGlobal =
    Math.floor(args.totalMessageCount / args.summaryWindowMessages) % args.globalSummaryCadence ===
    0;

  if (!shouldRefreshGlobal) {
    return;
  }

  const { data: summaries, error: summariesError } = await supabase
    .from("memory_summaries")
    .select("*")
    .eq("user_id", args.userId)
    .eq("conversation_id", args.conversationId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (summariesError || !summaries || summaries.length === 0) {
    return;
  }

  const mergedSummary = summaries
    .map((summary) => (summary as MemorySummaryRow).summary_text)
    .join("\n\n");

  await supabase.from("memory_summaries").insert({
    user_id: args.userId,
    conversation_id: null,
    summary_text: clampText(mergedSummary, 1800),
    window_start_message_id: null,
    window_end_message_id: null,
  });
}

export async function POST(request: NextRequest) {
  const { supabase, user, errorResponse } = await getAuthenticatedContext();
  if (errorResponse || !user) {
    return errorResponse;
  }

  let conversationId = "";
  let messageText = "";

  try {
    const body = (await request.json()) as ChatRequestBody;
    conversationId = getConversationId(body.conversationId);
    messageText = getMessageText(body.message);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required." }, { status: 400 });
  }
  if (!messageText) {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  try {
    return await withConcurrencyLimit(user.id, async () => {
      const { data: conversationData, error: conversationError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (conversationError) {
        return NextResponse.json({ error: conversationError.message }, { status: 500 });
      }

      if (!conversationData) {
        return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
      }

      const conversation = conversationData as ConversationRow;

      const { data: profileData, error: profileError } = await supabase
        .from("agent_profiles")
        .select("*")
        .eq("id", conversation.agent_profile_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }

      if (!profileData) {
        return NextResponse.json(
          { error: "Agent setup not found. Please complete setup first." },
          { status: 400 },
        );
      }

      const profile = profileData as AgentProfileRow;
      const memoryPolicy = getMemoryPolicy(profile.memory_policy_json);
      const persona = getPersona(profile.persona_json);

      const { data: insertedUserMessage, error: insertUserError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation.id,
          user_id: user.id,
          role: "user",
          content: messageText,
          meta_json: {},
        })
        .select("*")
        .single();

      if (insertUserError || !insertedUserMessage) {
        return NextResponse.json(
          { error: insertUserError?.message || "Failed to store user message." },
          { status: 500 },
        );
      }

      const userMessage = insertedUserMessage as MessageRow;
      const provisionalMessageCount = (conversation.message_count || 0) + 1;
      const title =
        provisionalMessageCount === 1 ? clampText(messageText, 48) : conversation.title;

      await supabase
        .from("conversations")
        .update({
          title,
          message_count: provisionalMessageCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversation.id)
        .eq("user_id", user.id);

      const [historyResult, memoryContext] = await Promise.all([
        supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(26),
        loadMemoryContext(
          supabase,
          user.id,
          conversation.id,
          messageText,
          memoryPolicy.maxInjectedFacts,
          memoryPolicy.maxInjectedRelations,
        ),
      ]);

      if (historyResult.error) {
        return NextResponse.json({ error: historyResult.error.message }, { status: 500 });
      }

      const history = ((historyResult.data || []) as MessageRow[])
        .reverse()
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map((message) => ({
          role: message.role as "user" | "assistant",
          content: message.content,
        }));

      const systemPrompt = buildSystemPrompt({
        agentName: profile.agent_name,
        persona,
        globalSummary: memoryContext.globalSummary,
        conversationSummary: memoryContext.conversationSummary,
        memoryFacts: memoryContext.facts,
        memoryRelations: memoryContext.relations,
      });

      const gatewayBaseUrl = getRequiredEnv("OPENCLAW_GATEWAY_BASE_URL").replace(/\/+$/, "");
      const gatewayToken = getRequiredEnv("OPENCLAW_GATEWAY_TOKEN");
      const agentId = process.env.OPENCLAW_AGENT_ID?.trim() || "main";

      const gatewayResponse = await fetch(`${gatewayBaseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gatewayToken}`,
          "x-openclaw-agent-id": agentId,
        },
        body: JSON.stringify({
          model: `openclaw:${agentId}`,
          user: `user:${user.id}:conversation:${conversation.id}`,
          stream: false,
          messages: [{ role: "system", content: systemPrompt }, ...history],
        }),
      });

      const responseData = (await gatewayResponse.json()) as OpenAiLikeResponse;
      if (!gatewayResponse.ok) {
        const message =
          responseData?.error?.message || `OpenClaw request failed (${gatewayResponse.status}).`;
        return NextResponse.json({ error: message }, { status: gatewayResponse.status });
      }

      const assistantContent = responseData?.choices?.[0]?.message?.content?.trim();
      if (!assistantContent) {
        return NextResponse.json(
          { error: "OpenClaw returned an empty response." },
          { status: 502 },
        );
      }

      const { data: assistantData, error: assistantInsertError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation.id,
          user_id: user.id,
          role: "assistant",
          content: assistantContent,
          meta_json: {
            model: `openclaw:${agentId}`,
            promptTokens: responseData.usage?.prompt_tokens || null,
            completionTokens: responseData.usage?.completion_tokens || null,
          },
        })
        .select("*")
        .single();

      if (assistantInsertError || !assistantData) {
        return NextResponse.json(
          { error: assistantInsertError?.message || "Failed to store assistant response." },
          { status: 500 },
        );
      }

      const assistantMessage = assistantData as MessageRow;
      const finalMessageCount = provisionalMessageCount + 1;

      const { data: updatedConversationData, error: updateConversationError } = await supabase
        .from("conversations")
        .update({
          title,
          message_count: finalMessageCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversation.id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (updateConversationError || !updatedConversationData) {
        return NextResponse.json(
          {
            error:
              updateConversationError?.message || "Failed to update conversation state.",
          },
          { status: 500 },
        );
      }

      const updatedConversation = updatedConversationData as ConversationRow;
      after(async () => {
        try {
          await persistMemory(supabase, {
            userId: user.id,
            conversationId: conversation.id,
            userText: messageText,
            assistantText: assistantContent,
            assistantMessageId: assistantMessage.id,
          });

          await refreshSummariesIfNeeded(supabase, {
            userId: user.id,
            conversationId: conversation.id,
            totalMessageCount: finalMessageCount,
            summaryWindowMessages: memoryPolicy.summaryWindowMessages,
            globalSummaryCadence: memoryPolicy.globalSummaryCadence,
          });
        } catch (memoryError) {
          console.error("Memory update failed:", memoryError);
        }

        const { error: usageError } = await supabase.from("usage_events").insert({
          user_id: user.id,
          conversation_id: conversation.id,
          event_type: "chat",
          model: `openclaw:${agentId}`,
          input_units: responseData.usage?.prompt_tokens || 0,
          output_units: responseData.usage?.completion_tokens || 0,
          estimated_cost_usd: 0,
        });

        if (usageError) {
          console.error("Usage event logging failed:", usageError);
        }
      });

      return NextResponse.json({
        conversation: mapConversation(updatedConversation),
        userMessage: mapMessage(userMessage),
        assistantMessage: mapMessage(assistantMessage),
        memory: {
          entityCount: 0,
          factCount: 0,
          relationCount: 0,
        },
      });
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error while sending message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
