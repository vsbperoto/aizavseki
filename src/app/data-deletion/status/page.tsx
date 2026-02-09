"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function DataDeletionStatusPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("id") || "";

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<{
    status: string;
    requested_at: string;
    completed_at?: string;
  } | null>(null);

  useEffect(() => {
    if (initialCode) {
      checkStatus(initialCode);
    }
  }, [initialCode]);

  const checkStatus = async (confirmationCode: string) => {
    setError("");
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/data-deletion?code=${encodeURIComponent(confirmationCode)}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Заявката не е намерена. Проверете дали кодът е правилен.");
        }
        const data = await response.json();
        throw new Error(data.error || "Грешка при проверка на статуса");
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Възникна грешка");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      checkStatus(code.trim());
    }
  };

  const getStatusDisplay = () => {
    if (!status) return null;

    switch (status.status) {
      case "pending":
        return {
          icon: <Clock className="w-8 h-8 text-yellow-400" />,
          title: "В процес на обработка",
          description: "Вашата заявка е получена и чака обработка.",
          color: "yellow",
        };
      case "processing":
        return {
          icon: <AlertCircle className="w-8 h-8 text-blue-400" />,
          title: "Данните се изтриват",
          description: "Вашата заявка се обработва в момента.",
          color: "blue",
        };
      case "completed":
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
          title: "Данните са изтрити успешно",
          description: "Всички Ваши лични данни са премахнати от нашата система.",
          color: "green",
        };
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-brand-gray" />,
          title: "Непознат статус",
          description: "Моля, свържете се с нас за повече информация.",
          color: "gray",
        };
    }
  };

  const statusDisplay = status ? getStatusDisplay() : null;

  return (
    <div className="min-h-screen bg-brand-dark py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyan/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад към начало</span>
        </Link>

        <div className="glass p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8 text-brand-cyan" />
            <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
              Статус на заявка
            </h1>
          </div>

          <p className="text-brand-gray mb-8">
            Въведете кода за проследяване, който получихте при подаване на заявката за
            изтриване на данни.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label htmlFor="code" className="block text-brand-white font-medium mb-2">
                Код за проследяване
              </label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Въведете Вашия код за проследяване"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !code.trim()}
              className="w-full"
            >
              {loading ? "Проверява се..." : "Провери статус"}
            </Button>
          </form>

          {statusDisplay && (
            <div className="border-t border-brand-cyan/10 pt-8">
              <div className="text-center">
                <div
                  className={`w-16 h-16 bg-${statusDisplay.color}-500/20 border border-${statusDisplay.color}-500/30 rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  {statusDisplay.icon}
                </div>

                <h2 className="font-heading text-2xl font-bold text-brand-white mb-3">
                  {statusDisplay.title}
                </h2>

                <p className="text-brand-gray mb-6">{statusDisplay.description}</p>

                <div className="bg-brand-navy/50 border border-brand-cyan/20 rounded-lg p-6 text-left">
                  <div className="space-y-3">
                    <div>
                      <p className="text-brand-gray text-sm">Статус:</p>
                      <p className="text-brand-white font-semibold">
                        {status?.status === "pending" && "В очакване"}
                        {status?.status === "processing" && "В процес"}
                        {status?.status === "completed" && "Завършено"}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-gray text-sm">Дата на заявката:</p>
                      <p className="text-brand-white">
                        {status?.requested_at
                          ? new Date(status.requested_at).toLocaleString("bg-BG", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })
                          : "Няма данни"}
                      </p>
                    </div>
                    {status?.completed_at && (
                      <div>
                        <p className="text-brand-gray text-sm">Дата на завършване:</p>
                        <p className="text-brand-white">
                          {new Date(status.completed_at).toLocaleString("bg-BG", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {status?.status !== "completed" && (
                  <p className="text-brand-gray text-sm mt-6">
                    Заявките обикновено се обработват в рамките на 30 дни. Ще получите
                    имейл уведомление, когато процесът приключи.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-brand-cyan/10">
            <p className="text-brand-gray text-sm text-center">
              Ако имате въпроси относно Вашата заявка, свържете се с нас на{" "}
              <a
                href="mailto:privacy@aizavseki.eu"
                className="text-brand-cyan hover:text-brand-cyan/80"
              >
                privacy@aizavseki.eu
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
