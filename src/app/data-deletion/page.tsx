"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
        throw new Error(data.error || "Грешка при изпращане на заявката");
      }

      setConfirmationCode(data.confirmation_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Възникна грешка");
    } finally {
      setLoading(false);
    }
  };

  if (confirmationCode) {
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
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-green-400" />
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-4">
                Заявката е приета
              </h1>

              <p className="text-brand-gray mb-6">
                Вашата заявка за изтриване на данни беше успешно приета и ще бъде обработена
                в рамките на 30 дни.
              </p>

              <div className="bg-brand-navy/50 border border-brand-cyan/20 rounded-lg p-6 mb-6">
                <p className="text-brand-gray text-sm mb-2">
                  Код за проследяване:
                </p>
                <p className="font-mono text-xl text-brand-cyan break-all">
                  {confirmationCode}
                </p>
              </div>

              <p className="text-brand-gray text-sm mb-8">
                Запазете този код, за да можете да проверите статуса на заявката си.
              </p>

              <Link
                href={`/data-deletion/status?id=${confirmationCode}`}
                className="inline-block text-brand-cyan hover:text-brand-cyan/80 font-semibold"
              >
                Провери статус на заявката →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <Trash2 className="w-8 h-8 text-brand-cyan" />
            <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text">
              Изтриване на данни
            </h1>
          </div>

          <div className="prose prose-invert prose-cyan max-w-none mb-8">
            <p className="text-brand-gray">
              Съгласно Общия регламент за защита на данните (GDPR), имате право да поискате
              изтриване на Вашите лични данни от нашата система.
            </p>
            <p className="text-brand-gray mt-4">
              <strong className="text-brand-white">Какво ще бъде изтрито:</strong>
            </p>
            <ul className="list-disc pl-6 text-brand-gray space-y-2">
              <li>Имейл адрес и име от нашата база данни</li>
              <li>История на абонаменти за бюлетин</li>
              <li>Изпратени контактни съобщения</li>
              <li>Facebook/Instagram данни, свързани с Вашия акаунт (ако има такива)</li>
            </ul>
            <p className="text-brand-gray mt-4">
              <strong className="text-brand-white">Срок:</strong> Заявката ще бъде обработена
              в рамките на 30 дни. Ще получите потвърждение на посочения имейл адрес.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-brand-white font-medium mb-2">
                Имейл адрес <span className="text-red-400">*</span>
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
                Имейлът, който сте използвали при регистрация
              </p>
            </div>

            <div>
              <label htmlFor="facebookUserId" className="block text-brand-white font-medium mb-2">
                Facebook User ID (опционално)
              </label>
              <Input
                id="facebookUserId"
                type="text"
                value={facebookUserId}
                onChange={(e) => setFacebookUserId(e.target.value)}
                placeholder="Вашият Facebook User ID"
                disabled={loading}
              />
              <p className="text-brand-gray text-sm mt-2">
                Ако сте използвали Facebook Login или свързали Facebook акаунт
              </p>
            </div>

            <div>
              <label htmlFor="reason" className="block text-brand-white font-medium mb-2">
                Причина за изтриване (опционално)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Можете да споделите защо искате да изтриете данните си..."
                disabled={loading}
                rows={4}
                className="w-full bg-brand-navy/50 border border-brand-cyan/20 rounded-lg px-4 py-3 text-brand-white placeholder:text-brand-gray focus:outline-none focus:border-brand-cyan/50 transition-colors disabled:opacity-50"
              />
              <p className="text-brand-gray text-sm mt-2">
                Това ни помага да подобрим нашите услуги
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? "Изпраща се..." : "Изпрати заявка за изтриване"}
            </Button>

            <p className="text-brand-gray text-xs text-center">
              Чрез изпращането на тази форма потвърждавате, че сте собственик на посочения
              имейл адрес и искате необратимо да изтриете Вашите данни от нашата система.
            </p>
          </form>

          <div className="mt-8 pt-8 border-t border-brand-cyan/10">
            <p className="text-brand-gray text-sm">
              Ако имате въпроси относно изтриването на данни, свържете се с нас на{" "}
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
