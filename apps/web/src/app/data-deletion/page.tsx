"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function DataDeletionPage() {
  const [email, setEmail] = useState("");
  const [facebookUserId, setFacebookUserId] = useState("");
  const [reason, setReason] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          facebook_user_id: facebookUserId || undefined,
          reason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "\u0413\u0440\u0435\u0448\u043A\u0430 \u043F\u0440\u0438 \u0438\u0437\u043F\u0440\u0430\u0449\u0430\u043D\u0435 \u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430\u0442\u0430");
      }

      setConfirmationCode(data.confirmation_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "\u0412\u044A\u0437\u043D\u0438\u043A\u043D\u0430 \u0433\u0440\u0435\u0448\u043A\u0430");
    } finally {
      setLoading(false);
    }
  };

  if (confirmationCode) {
    return (
      <div className="relative min-h-screen py-16 px-4">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-brand-cyan hover:text-brand-cyan-bright transition-all mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{"\u041D\u0430\u0437\u0430\u0434 \u043A\u044A\u043C \u043D\u0430\u0447\u0430\u043B\u043E"}</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 md:p-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-green/10 border border-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-accent-green" />
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-4">
                {"\u0417\u0430\u044F\u0432\u043A\u0430\u0442\u0430 \u0435 \u043F\u0440\u0438\u0435\u0442\u0430"}
              </h1>

              <p className="text-brand-gray mb-6">
                {"\u0412\u0430\u0448\u0430\u0442\u0430 \u0437\u0430\u044F\u0432\u043A\u0430 \u0437\u0430 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435 \u043D\u0430 \u0434\u0430\u043D\u043D\u0438 \u0431\u0435\u0448\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0440\u0438\u0435\u0442\u0430 \u0438 \u0449\u0435 \u0431\u044A\u0434\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0435\u043D\u0430 \u0432 \u0440\u0430\u043C\u043A\u0438\u0442\u0435 \u043D\u0430 30 \u0434\u043D\u0438."}
              </p>

              <div className="bg-brand-navy/50 border border-brand-cyan/20 rounded-xl p-6 mb-6">
                <p className="text-brand-gray text-sm mb-2">
                  {"\u041A\u043E\u0434 \u0437\u0430 \u043F\u0440\u043E\u0441\u043B\u0435\u0434\u044F\u0432\u0430\u043D\u0435:"}
                </p>
                <p className="font-mono text-xl text-brand-cyan break-all">
                  {confirmationCode}
                </p>
              </div>

              <p className="text-brand-gray text-sm mb-8">
                {"\u0417\u0430\u043F\u0430\u0437\u0435\u0442\u0435 \u0442\u043E\u0437\u0438 \u043A\u043E\u0434, \u0437\u0430 \u0434\u0430 \u043C\u043E\u0436\u0435\u0442\u0435 \u0434\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430\u0442\u0430 \u0441\u0438."}
              </p>

              <Link
                href={`/data-deletion/status?id=${confirmationCode}`}
                className="inline-block text-brand-cyan hover:text-brand-cyan-bright font-semibold transition-colors"
              >
                {"\u041F\u0440\u043E\u0432\u0435\u0440\u0438 \u0441\u0442\u0430\u0442\u0443\u0441 \u043D\u0430 \u0437\u0430\u044F\u0432\u043A\u0430\u0442\u0430 \u2192"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-purple/5 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-brand-cyan hover:text-brand-cyan-bright transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>{"\u041D\u0430\u0437\u0430\u0434 \u043A\u044A\u043C \u043D\u0430\u0447\u0430\u043B\u043E"}</span>
        </Link>

        <ScrollReveal>
          <div className="glass p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 ring-1 ring-brand-cyan/20">
                <Trash2 className="w-6 h-6 text-brand-cyan" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
                {"\u0418\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435 \u043D\u0430 \u0434\u0430\u043D\u043D\u0438"}
              </h1>
            </div>

            <div className="mb-8 space-y-4">
              <p className="text-brand-gray">
                {"\u0421\u044A\u0433\u043B\u0430\u0441\u043D\u043E \u041E\u0431\u0449\u0438\u044F \u0440\u0435\u0433\u043B\u0430\u043C\u0435\u043D\u0442 \u0437\u0430 \u0437\u0430\u0449\u0438\u0442\u0430 \u043D\u0430 \u0434\u0430\u043D\u043D\u0438\u0442\u0435 (GDPR), \u0438\u043C\u0430\u0442\u0435 \u043F\u0440\u0430\u0432\u043E \u0434\u0430 \u043F\u043E\u0438\u0441\u043A\u0430\u0442\u0435 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435 \u043D\u0430 \u0412\u0430\u0448\u0438\u0442\u0435 \u043B\u0438\u0447\u043D\u0438 \u0434\u0430\u043D\u043D\u0438 \u043E\u0442 \u043D\u0430\u0448\u0430\u0442\u0430 \u0441\u0438\u0441\u0442\u0435\u043C\u0430."}
              </p>
              <p className="text-brand-gray">
                <strong className="text-brand-white">{"\u041A\u0430\u043A\u0432\u043E \u0449\u0435 \u0431\u044A\u0434\u0435 \u0438\u0437\u0442\u0440\u0438\u0442\u043E:"}</strong>
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-brand-gray">
                  <span className="text-brand-cyan mt-1.5 text-xs">{"\u25CF"}</span>
                  {"\u0418\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441 \u0438 \u0438\u043C\u0435 \u043E\u0442 \u043D\u0430\u0448\u0430\u0442\u0430 \u0431\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u0438"}
                </li>
                <li className="flex items-start gap-2 text-brand-gray">
                  <span className="text-brand-cyan mt-1.5 text-xs">{"\u25CF"}</span>
                  {"\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043D\u0430 \u0430\u0431\u043E\u043D\u0430\u043C\u0435\u043D\u0442\u0438 \u0437\u0430 \u0431\u044E\u043B\u0435\u0442\u0438\u043D"}
                </li>
                <li className="flex items-start gap-2 text-brand-gray">
                  <span className="text-brand-cyan mt-1.5 text-xs">{"\u25CF"}</span>
                  {"\u0418\u0437\u043F\u0440\u0430\u0442\u0435\u043D\u0438 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u0438 \u0441\u044A\u043E\u0431\u0449\u0435\u043D\u0438\u044F"}
                </li>
                <li className="flex items-start gap-2 text-brand-gray">
                  <span className="text-brand-cyan mt-1.5 text-xs">{"\u25CF"}</span>
                  {"Facebook/Instagram \u0434\u0430\u043D\u043D\u0438, \u0441\u0432\u044A\u0440\u0437\u0430\u043D\u0438 \u0441 \u0412\u0430\u0448\u0438\u044F \u0430\u043A\u0430\u0443\u043D\u0442 (\u0430\u043A\u043E \u0438\u043C\u0430 \u0442\u0430\u043A\u0438\u0432\u0430)"}
                </li>
              </ul>
              <p className="text-brand-gray">
                <strong className="text-brand-white">{"\u0421\u0440\u043E\u043A:"}</strong> {"\u0417\u0430\u044F\u0432\u043A\u0430\u0442\u0430 \u0449\u0435 \u0431\u044A\u0434\u0435 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0435\u043D\u0430 \u0432 \u0440\u0430\u043C\u043A\u0438\u0442\u0435 \u043D\u0430 30 \u0434\u043D\u0438. \u0429\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043F\u043E\u0442\u0432\u044A\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043D\u0430 \u043F\u043E\u0441\u043E\u0447\u0435\u043D\u0438\u044F \u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-brand-white font-medium mb-2">
                  {"\u0418\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441"} <span className="text-red-400">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
                <p className="text-brand-gray text-sm mt-2">
                  {"\u0418\u043C\u0435\u0439\u043B\u044A\u0442, \u043A\u043E\u0439\u0442\u043E \u0441\u0442\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u043B\u0438 \u043F\u0440\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F"}
                </p>
              </div>

              <div>
                <label htmlFor="facebookUserId" className="block text-brand-white font-medium mb-2">
                  {"Facebook User ID (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u043D\u043E)"}
                </label>
                <Input
                  id="facebookUserId"
                  type="text"
                  value={facebookUserId}
                  onChange={(e) => setFacebookUserId(e.target.value)}
                  placeholder={"\u0412\u0430\u0448\u0438\u044F\u0442 Facebook User ID"}
                  disabled={loading}
                />
                <p className="text-brand-gray text-sm mt-2">
                  {"\u0410\u043A\u043E \u0441\u0442\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u043B\u0438 Facebook Login \u0438\u043B\u0438 \u0441\u0432\u044A\u0440\u0437\u0430\u043B\u0438 Facebook \u0430\u043A\u0430\u0443\u043D\u0442"}
                </p>
              </div>

              <div>
                <label htmlFor="reason" className="block text-brand-white font-medium mb-2">
                  {"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u0437\u0430 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u043D\u043E)"}
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={"\u041C\u043E\u0436\u0435\u0442\u0435 \u0434\u0430 \u0441\u043F\u043E\u0434\u0435\u043B\u0438\u0442\u0435 \u0437\u0430\u0449\u043E \u0438\u0441\u043A\u0430\u0442\u0435 \u0434\u0430 \u0438\u0437\u0442\u0440\u0438\u0435\u0442\u0435 \u0434\u0430\u043D\u043D\u0438\u0442\u0435 \u0441\u0438..."}
                  disabled={loading}
                  rows={4}
                  className="w-full rounded-xl bg-brand-navy/80 border border-brand-cyan/10 px-4 py-3 text-brand-white placeholder:text-brand-gray/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan hover:border-brand-cyan/30 resize-none focus:shadow-[0_0_15px_rgba(0,212,255,0.1)] disabled:opacity-50"
                />
                <p className="text-brand-gray text-sm mt-2">
                  {"\u0422\u043E\u0432\u0430 \u043D\u0438 \u043F\u043E\u043C\u0430\u0433\u0430 \u0434\u0430 \u043F\u043E\u0434\u043E\u0431\u0440\u0438\u043C \u043D\u0430\u0448\u0438\u0442\u0435 \u0443\u0441\u043B\u0443\u0433\u0438"}
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="primary"
                disabled={loading || !email}
                className="w-full hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-shadow"
              >
                {loading ? "\u0418\u0437\u043F\u0440\u0430\u0449\u0430 \u0441\u0435..." : "\u0418\u0437\u043F\u0440\u0430\u0442\u0438 \u0437\u0430\u044F\u0432\u043A\u0430 \u0437\u0430 \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435"}
              </Button>

              <p className="text-brand-gray text-xs text-center">
                {"\u0427\u0440\u0435\u0437 \u0438\u0437\u043F\u0440\u0430\u0449\u0430\u043D\u0435\u0442\u043E \u043D\u0430 \u0442\u0430\u0437\u0438 \u0444\u043E\u0440\u043C\u0430 \u043F\u043E\u0442\u0432\u044A\u0440\u0436\u0434\u0430\u0432\u0430\u0442\u0435, \u0447\u0435 \u0441\u0442\u0435 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u0438\u043A \u043D\u0430 \u043F\u043E\u0441\u043E\u0447\u0435\u043D\u0438\u044F \u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441 \u0438 \u0438\u0441\u043A\u0430\u0442\u0435 \u043D\u0435\u043E\u0431\u0440\u0430\u0442\u0438\u043C\u043E \u0434\u0430 \u0438\u0437\u0442\u0440\u0438\u0435\u0442\u0435 \u0412\u0430\u0448\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u0438 \u043E\u0442 \u043D\u0430\u0448\u0430\u0442\u0430 \u0441\u0438\u0441\u0442\u0435\u043C\u0430."}
              </p>
            </form>

            <div className="mt-8 pt-8 border-t border-brand-cyan/10">
              <p className="text-brand-gray text-sm">
                {"\u0410\u043A\u043E \u0438\u043C\u0430\u0442\u0435 \u0432\u044A\u043F\u0440\u043E\u0441\u0438 \u043E\u0442\u043D\u043E\u0441\u043D\u043E \u0438\u0437\u0442\u0440\u0438\u0432\u0430\u043D\u0435\u0442\u043E \u043D\u0430 \u0434\u0430\u043D\u043D\u0438, \u0441\u0432\u044A\u0440\u0436\u0435\u0442\u0435 \u0441\u0435 \u0441 \u043D\u0430\u0441 \u043D\u0430 "}{" "}
                <a
                  href="mailto:privacy@aizavseki.eu"
                  className="text-brand-cyan hover:text-brand-cyan-bright transition-colors"
                >
                  privacy@aizavseki.eu
                </a>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
