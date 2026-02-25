"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
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
        setErrorMessage(data.error || "\u041D\u0435\u0449\u043E \u0441\u0435 \u043E\u0431\u044A\u0440\u043A\u0430.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("\u041D\u0435\u0449\u043E \u0441\u0435 \u043E\u0431\u044A\u0440\u043A\u0430. \u041E\u043F\u0438\u0442\u0430\u0439\u0442\u0435 \u043E\u0442\u043D\u043E\u0432\u043E.");
    }
  }

  return (
    <div className="relative pt-24 pb-16 sm:pt-32">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">{"\u041A\u043E\u043D\u0442\u0430\u043A\u0442"}</span>
          </h1>
          <p className="mt-4 text-brand-gray text-lg">
            {"\u0418\u043C\u0430\u0448 \u0432\u044A\u043F\u0440\u043E\u0441 \u0438\u043B\u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435? \u041F\u0438\u0448\u0438 \u043D\u0438!"}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <div className="group relative rounded-2xl">
                {/* Card hover glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-brand-cyan/0 blur-[20px] transition-all duration-500 group-hover:bg-brand-cyan/5" />
                <Card hover={false} className="relative">
                  <AnimatePresence mode="wait">
                    {status === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center py-8 text-center"
                      >
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10 ring-1 ring-accent-green/20">
                          <CheckCircle className="h-8 w-8 text-accent-green" />
                        </div>
                        <h2 className="font-heading text-xl font-semibold text-brand-white">
                          {"\u0421\u044A\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u0442\u043E \u0435 \u0438\u0437\u043F\u0440\u0430\u0442\u0435\u043D\u043E!"}
                        </h2>
                        <p className="mt-2 text-brand-gray">
                          {"\u0429\u0435 \u0432\u0438 \u043E\u0442\u0433\u043E\u0432\u043E\u0440\u0438\u043C \u0432\u044A\u0437\u043C\u043E\u0436\u043D\u043E \u043D\u0430\u0439-\u0441\u043A\u043E\u0440\u043E."}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-light mb-1.5">
                            {"\u0418\u043C\u0435"}
                          </label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder={"\u0412\u0430\u0448\u0435\u0442\u043E \u0438\u043C\u0435"}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-brand-gray-light mb-1.5">
                            {"\u0418\u043C\u0435\u0439\u043B"}
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
                            {"\u0421\u044A\u043E\u0431\u0449\u0435\u043D\u0438\u0435"}
                          </label>
                          <textarea
                            id="message"
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder={"\u0412\u0430\u0448\u0435\u0442\u043E \u0441\u044A\u043E\u0431\u0449\u0435\u043D\u0438\u0435..."}
                            required
                            rows={5}
                            className="w-full rounded-xl bg-brand-navy/80 border border-brand-cyan/10 px-4 py-3 text-brand-white placeholder:text-brand-gray/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan hover:border-brand-cyan/30 resize-none focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                          />
                        </div>

                        <AnimatePresence>
                          {status === "error" && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3"
                            >
                              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                              <p className="text-sm text-red-400">{errorMessage}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button type="submit" disabled={status === "loading"} className="w-full hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-shadow">
                          <Send className="mr-2 h-4 w-4" />
                          {status === "loading" ? "\u0418\u0437\u043F\u0440\u0430\u0449\u0430\u043D\u0435..." : "\u0418\u0437\u043F\u0440\u0430\u0442\u0438"}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2">
            <ScrollReveal delay={0.2}>
              <div className="group relative rounded-2xl">
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-brand-cyan/0 blur-[20px] transition-all duration-500 group-hover:bg-brand-cyan/5" />
                <Card hover={false} className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20">
                    <Mail className="h-6 w-6 text-brand-cyan" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-brand-white">
                    {"\u0418\u043C\u0435\u0439\u043B"}
                  </h3>
                  <a
                    href={`mailto:${SITE_CONFIG.contactEmail}`}
                    className="mt-2 inline-block text-brand-cyan hover:text-brand-cyan-bright transition-colors"
                  >
                    {SITE_CONFIG.contactEmail}
                  </a>
                  <p className="mt-6 text-sm text-brand-gray">
                    {"\u041E\u0431\u0438\u043A\u043D\u043E\u0432\u0435\u043D\u043E \u043E\u0442\u0433\u043E\u0432\u0430\u0440\u044F\u043C\u0435 \u0432 \u0440\u0430\u043C\u043A\u0438\u0442\u0435 \u043D\u0430 24-48 \u0447\u0430\u0441\u0430."}
                  </p>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
