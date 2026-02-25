import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  chatId?: string;
  messages?: ChatMessage[];
};

type OpenAiLikeChoice = {
  message?: {
    content?: string;
  };
};

type OpenAiLikeResponse = {
  choices?: OpenAiLikeChoice[];
  error?: {
    message?: string;
  };
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function sanitizeMessages(messages: ChatMessage[]) {
  return messages
    .filter(
      (message) =>
        (message.role === "system" ||
          message.role === "user" ||
          message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const chatId = typeof body.chatId === "string" ? body.chatId.trim() : "";
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const messages = sanitizeMessages(incoming).slice(-20);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "At least one valid message is required." },
        { status: 400 },
      );
    }

    const gatewayBaseUrl = getRequiredEnv("OPENCLAW_GATEWAY_BASE_URL").replace(
      /\/+$/,
      "",
    );
    const gatewayToken = getRequiredEnv("OPENCLAW_GATEWAY_TOKEN");
    const agentId = process.env.OPENCLAW_AGENT_ID?.trim() || "main";
    const sessionUser = chatId || `agent-web-${Date.now()}`;

    const response = await fetch(
      `${gatewayBaseUrl}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gatewayToken}`,
          "x-openclaw-agent-id": agentId,
        },
        body: JSON.stringify({
          model: `openclaw:${agentId}`,
          user: sessionUser,
          stream: false,
          messages,
        }),
      },
    );

    const data = (await response.json()) as OpenAiLikeResponse;

    if (!response.ok) {
      const message =
        data?.error?.message || `OpenClaw request failed (${response.status}).`;
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json(
        { error: "OpenClaw returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

