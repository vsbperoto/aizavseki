export const SITE_CONFIG = {
  name: "AiZaVseki",
  nameCyrillic: "АИ За Всеки",
  tagline: "AI За Всеки",
  description: "Изкуственият интелект, обяснен на човешки език",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aizavseki.eu",
  email: "privacy@aizavseki.eu",
  contactEmail: "contact@aizavseki.eu",
  instagram: "https://www.instagram.com/aizavseki",
  facebook: "https://www.facebook.com/aizavseki",
  location: "България",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Начало" },
  { href: "/blog", label: "Блог" },
  { href: "/resources", label: "Ресурси" },
  { href: "/about", label: "За нас" },
  { href: "/contact", label: "Контакт" },
] as const;

export const FOOTER_LINKS = {
  resources: [
    { href: "/blog", label: "Блог" },
    { href: "/resources", label: "AI Инструменти" },
    { href: "/newsletter", label: "Бюлетин" },
  ],
  company: [
    { href: "/about", label: "За нас" },
    { href: "/contact", label: "Контакт" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Поверителност" },
    { href: "/terms-of-service", label: "Условия за ползване" },
    { href: "/data-deletion", label: "Изтриване на данни" },
  ],
} as const;

export type PillarKey = "AI_NEWS" | "AI_TOOLS" | "AI_TIPS" | "AI_BUSINESS" | "AI_FUN";

export const PILLARS: Record<PillarKey, { label: string; icon: string; color: string; description: string }> = {
  AI_NEWS: {
    label: "AI Новини",
    icon: "Newspaper",
    color: "#00d4ff",
    description: "Какво се случва в света на AI",
  },
  AI_TOOLS: {
    label: "AI Инструменти",
    icon: "Wrench",
    color: "#7c3aed",
    description: "Полезни AI инструменти за теб",
  },
  AI_TIPS: {
    label: "AI Съвети",
    icon: "Lightbulb",
    color: "#f59e0b",
    description: "Практични съвети за AI в ежедневието",
  },
  AI_BUSINESS: {
    label: "AI за Бизнес",
    icon: "Briefcase",
    color: "#10b981",
    description: "AI решения за твоя бизнес",
  },
  AI_FUN: {
    label: "AI Забавления",
    icon: "Gamepad2",
    color: "#ec4899",
    description: "Забавната страна на AI",
  },
} as const;

export const PILLAR_SLUGS: Record<PillarKey, string> = {
  AI_NEWS: "ai-novini",
  AI_TOOLS: "ai-instrumenti",
  AI_TIPS: "ai-saveti",
  AI_BUSINESS: "ai-za-biznes",
  AI_FUN: "ai-zabavlenia",
} as const;

export const SLUG_TO_PILLAR: Record<string, PillarKey> = Object.fromEntries(
  Object.entries(PILLAR_SLUGS).map(([key, slug]) => [slug, key as PillarKey])
) as Record<string, PillarKey>;

export const RESOURCE_CATEGORIES = {
  AI_BASICS: { name: "AI \u041E\u0441\u043D\u043E\u0432\u0438", slug: "ai-osnovi", icon: "\ud83d\udcda" },
  AI_TOOLS: { name: "AI \u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0438", slug: "ai-instrumenti", icon: "\ud83d\udd27" },
  AI_TIPS: { name: "AI \u0421\u044A\u0432\u0435\u0442\u0438", slug: "ai-saveti", icon: "\ud83d\udca1" },
  AI_BUSINESS: { name: "AI \u0437\u0430 \u0411\u0438\u0437\u043D\u0435\u0441\u0430", slug: "ai-za-biznesa", icon: "\ud83d\udcca" },
  AI_CREATIVE: { name: "AI \u0437\u0430 \u0422\u0432\u043E\u0440\u0447\u0435\u0441\u0442\u0432\u043E", slug: "ai-za-tvorchestvo", icon: "\ud83c\udfa8" },
  AI_DEVELOPMENT: { name: "AI \u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0430", slug: "ai-razrabotka", icon: "\ud83d\udcbb" },
  AI_ETHICS: { name: "AI \u0415\u0442\u0438\u043A\u0430", slug: "ai-etika", icon: "\u2696\ufe0f" },
  AI_TRENDS: { name: "AI \u0422\u0435\u043D\u0434\u0435\u043D\u0446\u0438\u0438", slug: "ai-tendentsii", icon: "\ud83d\ude80" },
} as const;

export type ResourceCategoryKey = keyof typeof RESOURCE_CATEGORIES;

export const CONTENT_TYPES = {
  definition: { name: "\u0414\u0435\u0444\u0438\u043D\u0438\u0446\u0438\u044F", label: "\u041A\u0430\u043A\u0432\u043E \u0435...?" },
  howto: { name: "\u0420\u044A\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E", label: "\u041A\u0430\u043A \u0434\u0430...?" },
  comparison: { name: "\u0421\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435", label: "X vs Y" },
} as const;

export type ContentTypeKey = keyof typeof CONTENT_TYPES;

export const STATS = [
  { value: 50, suffix: "+", label: "публикации" },
  { value: 5, suffix: "", label: "теми" },
  { value: 365, suffix: "", label: "дни в годината" },
  { value: 100, suffix: "%", label: "автоматизирано" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "AI изследва",
    description: "AI сканира актуални теми и тенденции в света на изкуствения интелект",
    icon: "Search",
  },
  {
    step: 2,
    title: "AI създава",
    description: "AI генерира съдържание и изображения, адаптирани за българска аудитория",
    icon: "Sparkles",
  },
  {
    step: 3,
    title: "Ти учиш",
    description: "Получаваш нова, полезна информация за AI всеки ден",
    icon: "GraduationCap",
  },
] as const;
