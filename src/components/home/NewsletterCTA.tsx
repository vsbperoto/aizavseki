"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Нещо се обърка. Опитайте отново.");
      }
    } catch {
      setStatus("error");
      setMessage("Нещо се обърка. Опитайте отново.");
    }
  }

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-8 sm:p-12 lg:p-16">
            {/* Glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-purple/10 blur-3xl" />

            <div className="relative text-center">
              <Mail className="mx-auto h-12 w-12 text-brand-cyan mb-6" />
              <h2 className="font-heading text-3xl font-bold text-brand-white sm:text-4xl">
                Получавай AI новини всяка седмица
              </h2>
              <p className="mt-4 text-brand-gray text-lg">
                Безплатен бюлетин с най-важното от света на AI, директно в
                пощата ти.
              </p>

              {status === "success" ? (
                <div className="mt-8 flex items-center justify-center gap-2 text-accent-green">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{message}</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                >
                  <Input
                    type="email"
                    placeholder="tvoyat@email.bg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="max-w-sm"
                  />
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto whitespace-nowrap"
                  >
                    {status === "loading" ? "Изпращане..." : "Абонирай се"}
                  </Button>
                </form>
              )}

              {status === "error" && (
                <p className="mt-3 text-sm text-red-400">{message}</p>
              )}

              <p className="mt-6 text-sm text-brand-gray/60">
                Присъединиха се 100+ абоната
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
