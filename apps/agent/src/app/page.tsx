"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Send, Sparkles, Trash2 } from "lucide-react";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
};

type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

type ChatApiResponse = {
  content?: string;
  error?: string;
};

const STORAGE_KEY = "aizavseki-agent-sessions-v1";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDefaultSession(): ChatSession {
  const now = Date.now();
  return {
    id: createId(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

function clampText(input: string, max = 80) {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 3)}...`;
}

export default function AgentPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getDefaultSession();
        setSessions([initial]);
        setActiveSessionId(initial.id);
        return;
      }

      const parsed = JSON.parse(raw) as ChatSession[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const initial = getDefaultSession();
        setSessions([initial]);
        setActiveSessionId(initial.id);
        return;
      }

      const normalized = parsed
        .filter((session) => session && typeof session.id === "string")
        .map((session) => ({
          ...session,
          messages: Array.isArray(session.messages) ? session.messages : [],
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt);

      if (normalized.length === 0) {
        const initial = getDefaultSession();
        setSessions([initial]);
        setActiveSessionId(initial.id);
        return;
      }

      setSessions(normalized);
      setActiveSessionId(normalized[0].id);
    } catch {
      const initial = getDefaultSession();
      setSessions([initial]);
      setActiveSessionId(initial.id);
    }
  }, []);

  useEffect(() => {
    if (sessions.length === 0) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeSessionId, sessions, isSending]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [sessions, activeSessionId],
  );

  function updateActiveSession(updater: (session: ChatSession) => ChatSession) {
    setSessions((current) =>
      current
        .map((session) =>
          session.id === activeSessionId ? updater(session) : session,
        )
        .sort((a, b) => b.updatedAt - a.updatedAt),
    );
  }

  function createNewChat() {
    const next = getDefaultSession();
    setSessions((current) => [next, ...current]);
    setActiveSessionId(next.id);
    setError(null);
  }

  function deleteSession(sessionId: string) {
    setSessions((current) => {
      const remaining = current.filter((session) => session.id !== sessionId);
      if (remaining.length > 0) {
        return remaining;
      }
      return [getDefaultSession()];
    });

    setActiveSessionId((currentActive) => {
      if (currentActive !== sessionId) {
        return currentActive;
      }
      const remaining = sessions.filter((session) => session.id !== sessionId);
      if (remaining.length > 0) {
        return remaining[0].id;
      }
      return "";
    });
  }

  async function sendMessage() {
    const trimmed = draft.trim();
    if (!trimmed || !activeSession || isSending) {
      return;
    }

    setDraft("");
    setError(null);
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    updateActiveSession((session) => {
      const nextMessages = [...session.messages, userMessage];
      return {
        ...session,
        messages: nextMessages,
        title:
          session.messages.length === 0 ? clampText(trimmed, 40) : session.title,
        updatedAt: Date.now(),
      };
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: activeSession.id,
          messages: [...activeSession.messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const payload = (await response.json()) as ChatApiResponse;
      if (!response.ok || !payload.content) {
        throw new Error(payload.error || "Failed to get a response.");
      }

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: payload.content,
        createdAt: Date.now(),
      };

      updateActiveSession((session) => ({
        ...session,
        messages: [...session.messages, assistantMessage],
        updatedAt: Date.now(),
      }));
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Request failed.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="flex h-screen bg-brand-dark text-brand-white overflow-hidden">
      <aside className="w-72 border-r border-brand-white/5 hidden md:flex flex-col bg-brand-dark/50 backdrop-blur-md z-10">
        <div className="p-4 border-b border-brand-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-medium text-brand-cyan flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Assistant
            </h2>
          </div>
          <button
            type="button"
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-2 text-sm font-medium text-brand-cyan hover:bg-brand-cyan/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group rounded-xl border px-3 py-2 transition-colors ${
                session.id === activeSessionId
                  ? "border-brand-cyan/40 bg-brand-cyan/10"
                  : "border-brand-white/10 bg-brand-navy/20 hover:bg-brand-navy/40"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveSessionId(session.id)}
                className="w-full text-left"
              >
                <p className="text-sm font-medium text-brand-white truncate">
                  {session.title || "Untitled chat"}
                </p>
                <p className="text-xs text-brand-gray/70 mt-1">
                  {session.messages.length} messages
                </p>
              </button>
              <button
                type="button"
                onClick={() => deleteSession(session.id)}
                className="mt-2 hidden group-hover:flex items-center gap-1 text-xs text-brand-gray/70 hover:text-red-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(2,191,223,0.15),rgba(0,0,0,0))] pointer-events-none" />

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10"
        >
          {!activeSession || activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-cyan/20 to-brand-cyan/5 border border-brand-cyan/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                <Sparkles className="w-8 h-8 text-brand-cyan" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-brand-white via-brand-white to-brand-cyan/60">
                How can I help you today?
              </h1>
              <p className="text-brand-gray/80 text-lg">
                Ask anything to start a live conversation with your OpenClaw
                agent.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4 pb-4">
              {activeSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 border ${
                    message.role === "user"
                      ? "ml-auto max-w-[85%] bg-brand-cyan/15 border-brand-cyan/30"
                      : "mr-auto max-w-[90%] bg-brand-navy/60 border-brand-white/10"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              ))}

              {isSending && (
                <div className="mr-auto max-w-[90%] rounded-2xl px-4 py-3 border bg-brand-navy/60 border-brand-white/10">
                  <p className="text-sm text-brand-gray/80">
                    Assistant is thinking...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 w-full max-w-4xl mx-auto relative z-20 shrink-0">
          {error && (
            <div className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="relative flex items-end bg-brand-navy/60 border border-brand-white/10 rounded-2xl shadow-2xl p-2 backdrop-blur-xl focus-within:ring-1 focus-within:ring-brand-cyan/50 focus-within:border-brand-cyan/50 transition-all">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              disabled={isSending || !activeSession}
              className="flex-1 bg-transparent border-none text-brand-white placeholder-brand-gray/50 resize-none max-h-40 min-h-[44px] px-4 py-3 focus:outline-none focus:ring-0 disabled:opacity-60"
              placeholder="Message your agent..."
              rows={1}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isSending || !draft.trim() || !activeSession}
              className="absolute right-3 bottom-2.5 bg-brand-cyan text-brand-dark rounded-xl p-2.5 hover:bg-brand-cyan/80 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <p className="text-xs text-brand-gray/40 text-center mt-3 font-medium">
            AI can make mistakes. Verified by OpenClaw Engine.
          </p>
        </div>
      </main>
    </div>
  );
}
