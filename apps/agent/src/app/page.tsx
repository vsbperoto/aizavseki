"use client";

import { useEffect, useRef, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { Loader2, LogOut, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AgentProfile = {
  id: string;
  agentName: string;
  persona: {
    tone: string;
    niche: string;
    audience: string;
    channels: string[];
    outputStyle: string;
    signatureStyle: string;
    constraints: string;
    goals: string;
  };
};

type Conversation = {
  id: string;
  title: string;
  messageCount: number;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  createdAt: string;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function apiFetch<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || "Заявката се провали.");
  }
  return payload as T;
}

export default function AgentPage() {
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [supabaseEndpoint, setSupabaseEndpoint] = useState<string>("");
  const [configError, setConfigError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupName, setSetupName] = useState("Моят AI Създател");
  const [setupTone, setSetupTone] = useState("ясен и практичен");
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, isBusy]);

  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
      setSupabaseEndpoint(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "");
    } catch {
      setConfigError(
        "Липсват Supabase променливи за средата. Добави NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY във Vercel и пусни нов deploy.",
      );
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const client = supabase;

    let isMounted = true;
    async function bootstrap() {
      const {
        data: { user: currentUser },
      } = await client.auth.getUser();
      if (!isMounted) {
        return;
      }
      setUser(currentUser || null);
      setIsLoading(false);
    }
    void bootstrap();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }
      setUser(session?.user || null);
      setError(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!user) {
        setProfile(null);
        setConversations([]);
        setActiveConversationId("");
        setMessages([]);
        return;
      }

      setIsLoading(true);
      try {
        const [setupData, conversationData] = await Promise.all([
          apiFetch<{ profile: AgentProfile | null }>("/api/agent/setup"),
          apiFetch<{ conversations: Conversation[] }>("/api/conversations"),
        ]);

        if (cancelled) {
          return;
        }

        setProfile(setupData.profile);
        setSetupName(setupData.profile?.agentName || "Моят AI Създател");
        setSetupTone(setupData.profile?.persona.tone || "ясен и практичен");
        setConversations(conversationData.conversations || []);

        const firstConversation = conversationData.conversations?.[0];
        if (firstConversation) {
          setActiveConversationId(firstConversation.id);
          const messageData = await apiFetch<{ messages: Message[] }>(
            `/api/conversations/${firstConversation.id}/messages`,
          );
          if (!cancelled) {
            setMessages(messageData.messages || []);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Грешка при зареждане на данните.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function signIn() {
    if (!supabase) {
      setError("Липсва Supabase конфигурация.");
      return;
    }

    setError(null);
    setIsBusy(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message);
      }
    } catch {
      setError(
        `Мрежова грешка при вход към ${supabaseEndpoint || "Supabase"}. Провери дали е стар кеш.`,
      );
    }
    setIsBusy(false);
  }

  async function signUp() {
    if (!supabase) {
      setError("Липсва Supabase конфигурация.");
      return;
    }

    setError(null);
    setIsBusy(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      }
    } catch {
      setError(
        `Мрежова грешка при регистрация към ${supabaseEndpoint || "Supabase"}. Провери дали е стар кеш.`,
      );
    }
    setIsBusy(false);
  }

  async function signOut() {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  }

  async function saveSetup() {
    setError(null);
    setIsBusy(true);
    try {
      const payload = await apiFetch<{ profile: AgentProfile }>("/api/agent/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: setupName,
          tone: setupTone,
          niche: "съдържание и маркетинг",
          audience: "предприемачи и малък бизнес",
          channels: ["Instagram", "TikTok", "YouTube Shorts"],
          outputStyle: "кратко и приложимо",
          signatureStyle: "кука + стойност + CTA",
          constraints: "",
          goals: "Ежедневни идеи, сценарии и формати с конверсии",
        }),
      });
      setProfile(payload.profile);
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : "Грешка при запазване.");
    } finally {
      setIsBusy(false);
    }
  }

  async function newConversation() {
    setError(null);
    const payload = await apiFetch<{ conversation: Conversation }>("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Нов чат" }),
    });
    setConversations((current) => [payload.conversation, ...current]);
    setActiveConversationId(payload.conversation.id);
    setMessages([]);
  }

  async function selectConversation(conversationId: string) {
    setActiveConversationId(conversationId);
    const payload = await apiFetch<{ messages: Message[] }>(
      `/api/conversations/${conversationId}/messages`,
    );
    setMessages(payload.messages || []);
  }

  async function deleteConversation(conversationId: string) {
    await apiFetch<{ ok: boolean }>(`/api/conversations/${conversationId}`, {
      method: "DELETE",
    });
    const remaining = conversations.filter((conversation) => conversation.id !== conversationId);
    setConversations(remaining);
    if (activeConversationId === conversationId) {
      setActiveConversationId(remaining[0]?.id || "");
      if (remaining[0]?.id) {
        await selectConversation(remaining[0].id);
      } else {
        setMessages([]);
      }
    }
  }

  async function sendMessage() {
    const trimmed = draft.trim();
    if (!trimmed || isBusy || !profile) {
      return;
    }

    let conversationId = activeConversationId;
    if (!conversationId) {
      const payload = await apiFetch<{ conversation: Conversation }>("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Нов чат" }),
      });
      conversationId = payload.conversation.id;
      setConversations((current) => [payload.conversation, ...current]);
      setActiveConversationId(conversationId);
    }

    const optimisticUserMessage: Message = {
      id: `tmp-${createId()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setDraft("");
    setIsBusy(true);
    setMessages((current) => [...current, optimisticUserMessage]);

    try {
      const payload = await apiFetch<{
        conversation: Conversation;
        userMessage: Message;
        assistantMessage: Message;
      }>("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: trimmed }),
      });

      setMessages((current) => [
        ...current.filter((message) => message.id !== optimisticUserMessage.id),
        payload.userMessage,
        payload.assistantMessage,
      ]);
      setConversations((current) => [
        payload.conversation,
        ...current.filter((conversation) => conversation.id !== payload.conversation.id),
      ]);
    } catch (chatError) {
      setMessages((current) =>
        current.filter((message) => message.id !== optimisticUserMessage.id),
      );
      setError(chatError instanceof Error ? chatError.message : "Грешка при изпращане.");
    } finally {
      setIsBusy(false);
    }
  }

  if (configError) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-dark text-brand-white p-6">
        <div className="w-full max-w-xl rounded-xl border border-red-400/30 bg-brand-navy/60 p-6 space-y-3">
          <p className="text-sm text-red-300">{configError}</p>
          <p className="text-xs text-brand-gray/70">
            Нужни променливи: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-dark text-brand-white">
        <Loader2 className="w-5 h-5 text-brand-cyan animate-spin" />
      </div>
    );
  }

  if (!user) {
    let endpointLabel = supabaseEndpoint;
    try {
      endpointLabel = supabaseEndpoint ? new URL(supabaseEndpoint).host : "";
    } catch {
      endpointLabel = supabaseEndpoint;
    }

    return (
      <div className="h-screen flex items-center justify-center bg-brand-dark text-brand-white p-6">
        <div className="w-full max-w-sm rounded-xl border border-brand-white/10 bg-brand-navy/60 p-6 space-y-3">
          {error && <p className="text-sm text-red-300">{error}</p>}
          {endpointLabel && (
            <p className="text-[11px] text-brand-gray/70">Свързан към: {endpointLabel}</p>
          )}
          <input
            className="w-full rounded-lg border border-brand-white/10 bg-brand-dark/60 px-3 py-2"
            placeholder="Имейл"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="w-full rounded-lg border border-brand-white/10 bg-brand-dark/60 px-3 py-2"
            placeholder="Парола"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => void signIn()}
              className="flex-1 rounded-lg bg-brand-cyan text-brand-dark py-2 text-sm font-semibold"
            >
              Вход
            </button>
            <button
              onClick={() => void signUp()}
              className="flex-1 rounded-lg border border-brand-cyan/40 text-brand-cyan py-2 text-sm font-semibold"
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-dark text-brand-white p-6">
        <div className="w-full max-w-xl rounded-xl border border-brand-white/10 bg-brand-navy/60 p-6 space-y-3">
          {error && <p className="text-sm text-red-300">{error}</p>}
          <input
            className="w-full rounded-lg border border-brand-white/10 bg-brand-dark/60 px-3 py-2"
            value={setupName}
            onChange={(event) => setSetupName(event.target.value)}
            placeholder="Име на агента"
          />
          <input
            className="w-full rounded-lg border border-brand-white/10 bg-brand-dark/60 px-3 py-2"
            value={setupTone}
            onChange={(event) => setSetupTone(event.target.value)}
            placeholder="Тон на комуникация"
          />
          <div className="flex gap-2">
            <button
              onClick={() => void saveSetup()}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-cyan text-brand-dark py-2 px-4 text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              Запази настройките
            </button>
            <button
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-white/20 py-2 px-4 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Изход
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-brand-dark text-brand-white overflow-hidden">
      <aside className="w-72 border-r border-brand-white/10 hidden md:flex flex-col bg-brand-navy/30">
        <div className="p-4 border-b border-brand-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-brand-cyan">{profile.agentName}</p>
            <button onClick={() => void signOut()} className="text-xs text-brand-gray/70">
              Изход
            </button>
          </div>
          <button
            onClick={() => void newConversation()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-brand-cyan/40 bg-brand-cyan/10 py-2 text-sm text-brand-cyan"
          >
            <Plus className="w-4 h-4" />
            Нов чат
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="rounded-lg border border-brand-white/10 p-2">
              <button
                className="w-full text-left"
                onClick={() => void selectConversation(conversation.id)}
              >
                <p className="text-sm truncate">{conversation.title}</p>
                <p className="text-xs text-brand-gray/70">{conversation.messageCount} съобщения</p>
              </button>
              <button
                onClick={() => void deleteConversation(conversation.id)}
                className="mt-1 inline-flex items-center gap-1 text-xs text-brand-gray/70 hover:text-red-300"
              >
                <Trash2 className="w-3 h-3" />
                Изтрий
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <Sparkles className="w-10 h-10 mx-auto text-brand-cyan mb-4" />
                <p className="text-brand-gray/80">
                  Започни разговор с твоя персонализиран AI агент.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl border px-4 py-3 ${
                  message.role === "user"
                    ? "ml-auto max-w-[85%] bg-brand-cyan/15 border-brand-cyan/30"
                    : "mr-auto max-w-[90%] bg-brand-navy/50 border-brand-white/10"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {isBusy && (
              <div className="mr-auto max-w-[90%] rounded-xl border border-brand-white/10 px-4 py-3 bg-brand-navy/50">
                <p className="text-sm text-brand-gray/70">Агентът мисли...</p>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 md:p-6 max-w-4xl w-full mx-auto">
          {error && (
            <div className="mb-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          <div className="relative rounded-xl border border-brand-white/10 bg-brand-navy/60 p-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              className="w-full min-h-[46px] max-h-40 resize-none bg-transparent px-3 py-2 focus:outline-none"
              placeholder="Напиши съобщение..."
            />
            <button
              onClick={() => void sendMessage()}
              disabled={isBusy || !draft.trim()}
              className="absolute right-3 bottom-3 rounded-lg bg-brand-cyan p-2 text-brand-dark disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
