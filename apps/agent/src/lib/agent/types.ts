export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export type AgentPersona = {
  tone: string;
  niche: string;
  audience: string;
  channels: string[];
  outputStyle: string;
  signatureStyle: string;
  constraints: string;
  goals: string;
};

export type AgentMemoryPolicy = {
  summaryWindowMessages: number;
  globalSummaryCadence: number;
  maxInjectedFacts: number;
  maxInjectedRelations: number;
};

export type AgentProfileRow = {
  id: string;
  user_id: string;
  agent_name: string;
  persona_json: JsonValue;
  goals_json: JsonValue;
  style_guide_json: JsonValue;
  memory_policy_json: JsonValue;
  created_at: string;
  updated_at: string;
};

export type ConversationRow = {
  id: string;
  user_id: string;
  agent_profile_id: string;
  title: string;
  status: "active" | "archived";
  message_count: number;
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  meta_json: JsonValue;
  created_at: string;
};

export type MemoryEntityRow = {
  id: string;
  user_id: string;
  canonical_name: string;
  entity_type: string;
  attributes_json: JsonValue;
  created_at: string;
  updated_at: string;
};

export type MemoryFactRow = {
  id: string;
  user_id: string;
  entity_id: string | null;
  fact_text: string;
  confidence: number;
  valid_from: string;
  valid_until: string | null;
  source_message_id: string | null;
  created_at: string;
};

export type MemoryRelationRow = {
  id: string;
  user_id: string;
  source_entity_id: string;
  relation_type: string;
  target_entity_id: string;
  confidence: number;
  valid_from: string;
  valid_until: string | null;
  evidence_message_id: string | null;
  created_at: string;
};

export type MemorySummaryRow = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  summary_text: string;
  window_start_message_id: string | null;
  window_end_message_id: string | null;
  created_at: string;
};

