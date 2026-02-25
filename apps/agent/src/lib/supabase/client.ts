import { createBrowserClient } from "@supabase/ssr";

function getEnv(name: string, fallback: string) {
  const value = process.env[name];
  if (value && value.trim()) {
    return value.trim();
  }
  return fallback;
}

export function createClient() {
  return createBrowserClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL", "https://placeholder.supabase.co"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "placeholder-anon-key"),
  );
}
