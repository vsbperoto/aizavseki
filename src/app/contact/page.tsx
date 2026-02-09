"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, Send, CheckCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Нещо се обърка.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Нещо се обърка. Опитайте отново.");
    }
  }

  return (
    <div className="pt-24 pb-16 sm:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-display text-4xl font-bold text-brand-white sm:text-5xl">
            Контакт
          </h1>
          <p className="mt-4 text-brand-gray text-lg">
            Имаш въпрос или предложение? Пиши ни!
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <Card hover={false}>
                {status === "success" ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-accent-green mb-4" />
                    <h2 className="font-heading text-xl font-semibold text-brand-white">
                      Съобщението е изпратено!
                    </h2>
                    <p className="mt-2 text-brand-gray">
                      Ще ви отговорим възможно най-скоро.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-brand-gray-light mb-1.5">
                        Име
                      </label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Вашето име"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-brand-gray-light mb-1.5">
                        Имейл
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="tvoyat@email.bg"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-brand-gray-light mb-1.5">
                        Съобщение
                      </label>
                      <textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Вашето съобщение..."
                        required
                        rows={5}
                        className="w-full rounded-xl bg-brand-navy/80 border border-brand-cyan/10 px-4 py-3 text-brand-white placeholder:text-brand-gray/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan hover:border-brand-cyan/30 resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-400">{errorMessage}</p>
                    )}

                    <Button type="submit" disabled={status === "loading"} className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      {status === "loading" ? "Изпращане..." : "Изпрати"}
                    </Button>
                  </form>
                )}
              </Card>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2">
            <ScrollReveal delay={0.2}>
              <Card hover={false}>
                <Mail className="h-8 w-8 text-brand-cyan mb-4" />
                <h3 className="font-heading text-lg font-semibold text-brand-white">
                  Имейл
                </h3>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="mt-2 text-brand-cyan hover:text-brand-cyan-bright transition-colors"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
                <p className="mt-6 text-sm text-brand-gray">
                  Обикновено отговаряме в рамките на 24-48 часа.
                </p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
