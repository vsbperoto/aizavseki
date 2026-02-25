import { LegalPage } from "@/components/legal/LegalPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика за поверителност",
  description: "Научете как AiZaVseki събира, обработва и защитава вашите лични данни. GDPR-съвместима политика за поверителност.",
  alternates: { canonical: "https://aizavseki.eu/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Политика за поверителност" lastUpdated="9 февруари 2026">
      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          1. Кой сме ние
        </h2>
        <p>
          АИ За Всеки (AiZaVseki.eu) е образователна платформа за изкуствен интелект,
          регистрирана в България. Ние сме контролер на Вашите лични данни и се ангажираме
          да защитаваме Вашата поверителност в съответствие с GDPR и българското законодателство.
        </p>
        <p className="mt-4">
          <strong>Контакт за въпроси относно поверителността:</strong>{" "}
          <a href="mailto:privacy@aizavseki.eu" className="text-brand-cyan hover:text-brand-cyan/80">
            privacy@aizavseki.eu
          </a>
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          2. Какви данни събираме
        </h2>
        <p>Ние събираме следните категории лични данни:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Данни от формуляри:</strong> Име и имейл адрес, когато се абонирате за
            нашия бюлетин или ни изпратите съобщение чрез контактна форма
          </li>
          <li>
            <strong>Данни от Facebook/Instagram:</strong> Чрез Meta API получаваме достъп до
            статистики на нашите страници (брой последователи, ангажираност), за да публикуваме
            съдържание в нашите собствени акаунти
          </li>
          <li>
            <strong>Бисквитки:</strong> Сесийни бисквитки за технически функционалности и
            опционални бисквитки за анализ (Google Analytics)
          </li>
          <li>
            <strong>Данни за използване:</strong> IP адрес, тип на браузър, посетени страници,
            време на посещение (чрез Google Analytics)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          3. Facebook/Instagram интеграция
        </h2>
        <p>
          Нашата платформа използва Meta API (Facebook/Instagram) за следните цели:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Публикуване на образователно съдържание в нашите собствени Facebook и Instagram страници</li>
          <li>Достъп до статистики на нашите страници (Page Insights) за подобряване на съдържанието</li>
          <li>Четене на коментари и съобщения, за да взаимодействаме с нашата общност</li>
        </ul>
        <p className="mt-4">
          <strong className="text-brand-white">Важна информация:</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Ние НЕ събираме или съхраняваме пароли на потребители</li>
          <li>Ние НЕ продаваме данни на трети страни</li>
          <li>Ние публикуваме съдържание САМО в нашите собствени акаунти, не в акаунтите на други потребители</li>
          <li>Спазваме Meta Platform Terms и Meta Platform Policy</li>
          <li>Данните се използват само за образователни и информационни цели</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          4. Как използваме данните
        </h2>
        <p>Вашите лични данни се използват за следните цели:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Публикуване на съдържание:</strong> За автоматизирано публикуване на
            образователни публикации в нашите Facebook и Instagram страници
          </li>
          <li>
            <strong>Анализ и статистики:</strong> За разбиране на ангажираността на аудиторията
            и подобряване на качеството на съдържанието
          </li>
          <li>
            <strong>Бюлетин:</strong> За изпращане на образователни материали и новини до
            абонати, които са дали своето съгласие
          </li>
          <li>
            <strong>Комуникация:</strong> За отговор на Ваши запитвания чрез контактната форма
          </li>
          <li>
            <strong>Подобрение на услугата:</strong> За анализ на използването на уебсайта
            и оптимизация на потребителското изживяване
          </li>
        </ul>
        <p className="mt-4">
          <strong>Правно основание:</strong> Обработваме данни на базата на Ваше съгласие
          (чл. 6(1)(a) GDPR) за бюлетина и легитимен интерес (чл. 6(1)(f) GDPR) за анализ
          и подобрение на услугата.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          5. Съхранение и сигурност на данните
        </h2>
        <p>
          Ние прилагаме индустриални стандарти за сигурност, за да защитим Вашите данни:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Инфраструктура:</strong> Данните се съхраняват в Supabase (PostgreSQL)
            в европейски регион (EU)
          </li>
          <li>
            <strong>Мултимедия:</strong> Изображения и видеа се съхраняват в Cloudinary CDN
            с европейски сървъри
          </li>
          <li>
            <strong>Шифроване:</strong> TLS 1.3 за данни в движение, AES-256 за данни в покой
          </li>
          <li>
            <strong>Достъп:</strong> Ограничен достъп само за упълномощени администратори
            с многофакторна автентикация
          </li>
        </ul>
        <p className="mt-4">
          <strong>Период на съхранение:</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Абонати за бюлетин: До момента на отписване</li>
          <li>Контактни съобщения: До 12 месеца след последна комуникация</li>
          <li>Данни за анализ: До 26 месеца (изискване на Google Analytics)</li>
          <li>Facebook/Instagram данни: Не съхраняваме трайно; заявки в реално време към Meta API</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          6. Вашите права по GDPR
        </h2>
        <p>
          Вие имате следните права относно Вашите лични данни:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Право на достъп (чл. 15):</strong> Да получите копие от данните, които
            обработваме за Вас
          </li>
          <li>
            <strong>Право на коригиране (чл. 16):</strong> Да поискате коригиране на неточни данни
          </li>
          <li>
            <strong>Право на изтриване (чл. 17):</strong> Да поискате изтриване на Вашите данни
            (&quot;право да бъдеш забравен&quot;)
          </li>
          <li>
            <strong>Право на преносимост (чл. 20):</strong> Да получите данните си в структуриран,
            машинночетим формат
          </li>
          <li>
            <strong>Право на възражение (чл. 21):</strong> Да възразите срещу обработка на базата
            на легитимен интерес
          </li>
          <li>
            <strong>Право на оттегляне на съгласие (чл. 7(3)):</strong> Да оттеглите съгласието
            си по всяко време
          </li>
          <li>
            <strong>Право на жалба (чл. 77):</strong> Да подадете жалба до Комисия за защита на
            личните данни (КЗЛД) в България
          </li>
        </ul>
        <p className="mt-4">
          За упражняване на правата си, свържете се с нас на{" "}
          <a href="mailto:privacy@aizavseki.eu" className="text-brand-cyan hover:text-brand-cyan/80">
            privacy@aizavseki.eu
          </a>{" "}
          или използвайте нашата страница за{" "}
          <a href="/data-deletion" className="text-brand-cyan hover:text-brand-cyan/80">
            изтриване на данни
          </a>.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          7. Бисквитки
        </h2>
        <p>
          Нашият уебсайт използва следните видове бисквитки:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Необходими бисквитки:</strong> Сесийни бисквитки за технически функционалности
            (не изискват съгласие)
          </li>
          <li>
            <strong>Анализ и статистики:</strong> Google Analytics за разбиране на използването
            на сайта (изискват съгласие)
          </li>
        </ul>
        <p className="mt-4">
          <strong>Важно:</strong> Ние НЕ използваме рекламни бисквитки или бисквитки за проследяване
          в маркетингови цели.
        </p>
        <p className="mt-4">
          Можете да управлявате бисквитките чрез настройките на Вашия браузър. Моля, имайте предвид,
          че деактивирането на необходими бисквитки може да ограничи функционалността на сайта.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          8. Услуги на трети страни
        </h2>
        <p>
          За предоставяне на нашите услуги работим със следните доставчици на трети страни:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Meta/Facebook/Instagram:</strong> За публикуване на съдържание и достъп до
            статистики (Meta Ireland Limited, Ирландия - EU)
          </li>
          <li>
            <strong>Supabase:</strong> За съхранение на структурирани данни (Supabase Inc.,
            европейски регион)
          </li>
          <li>
            <strong>Cloudinary:</strong> За CDN и съхранение на изображения (Cloudinary Ltd.,
            европейски сървъри)
          </li>
          <li>
            <strong>Vercel:</strong> За хостване на уебсайта (Vercel Inc., европейски регион)
          </li>
          <li>
            <strong>Google Analytics:</strong> За анализ на трафика (Google Ireland Limited,
            Ирландия - EU)
          </li>
        </ul>
        <p className="mt-4">
          Всички доставчици са избрани на базата на тяхното съответствие с GDPR и използват
          стандартни договорни клаузи (SCC) за трансфер на данни.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          9. Поверителност на деца
        </h2>
        <p>
          Нашата платформа не е предназначена за лица под 16 години. Ние съзнателно не събираме
          лични данни от деца под 16 години без съгласието на родител или настойник.
        </p>
        <p className="mt-4">
          Ако научим, че сме събрали лични данни от дете под 16 години без родителско съгласие,
          ще предприемем стъпки за изтриване на тази информация възможно най-бързо.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          10. Промени в политиката за поверителност
        </h2>
        <p>
          Ние можем да актуализираме тази Политика за поверителност периодично, за да отразим
          промени в нашите практики или законодателството.
        </p>
        <p className="mt-4">
          Всички промени ще бъдат публикувани на тази страница с актуализирана дата &quot;Последна
          актуализация&quot;. За съществени промени ще Ви уведомим чрез имейл (ако сте абонат) или
          чрез забележимо уведомление на нашия уебсайт.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-brand-white mb-4">
          11. Контакт
        </h2>
        <p>
          За въпроси или оплаквания относно тази Политика за поверителност или обработката на
          Вашите лични данни, моля, свържете се с нас:
        </p>
        <div className="mt-4 p-4 bg-brand-navy/30 border border-brand-cyan/10 rounded-lg">
          <p>
            <strong className="text-brand-white">АИ За Всеки (AiZaVseki.eu)</strong>
          </p>
          <p className="mt-2">
            Имейл:{" "}
            <a href="mailto:privacy@aizavseki.eu" className="text-brand-cyan hover:text-brand-cyan/80">
              privacy@aizavseki.eu
            </a>
          </p>
          <p className="mt-1">Държава: България</p>
        </div>
        <p className="mt-4">
          За жалби можете също да се свържете с Комисия за защита на личните данни (КЗЛД):{" "}
          <a
            href="https://www.cpdp.bg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cyan hover:text-brand-cyan/80"
          >
            www.cpdp.bg
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
