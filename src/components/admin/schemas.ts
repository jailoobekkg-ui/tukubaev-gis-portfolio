import type { FieldDef } from "./fields";
import { CERT_TOPICS, PORTFOLIO_CATEGORIES } from "@/lib/types";

const CAT_LABELS: Record<string, string> = {
  "gis-mapping": "ГИС и картография",
  "land-surveying": "Землеустройство и съёмка",
  cadastral: "Кадастровый анализ",
  "remote-sensing": "ДЗЗ",
  uav: "БПЛА и фотограмметрия",
  "web-gis": "Web GIS",
  water: "Водные ресурсы",
};
const TOPIC_LABELS: Record<string, string> = {
  gis: "ГИС",
  "remote-sensing": "ДЗЗ",
  uav: "БПЛА",
  programming: "Программирование",
  "project-management": "Управление проектами",
};
const ICONS = ["layers", "satellite", "drone", "code", "land", "globe", "map", "database", "compass", "chart", "mountain", "target"].map((v) => ({ value: v, label: v }));

export const profileFields: FieldDef[] = [
  { key: "name", label: "Имя (короткое)", type: "i18n" },
  { key: "fullName", label: "Полное ФИО", type: "i18n" },
  { key: "headline", label: "Заголовок (должность)", type: "i18n" },
  { key: "roles", label: "Специализации в первом экране (EN)", type: "list" },
  { key: "subtitle", label: "Подзаголовок первого экрана", type: "i18n" },
  { key: "tagline", label: "Профессиональный слоган", type: "i18n" },
  { key: "bio", label: "Биография", type: "i18nArea", help: "Абзацы разделяйте пустой строкой" },
  { key: "specializations", label: "Профессиональная специализация", type: "i18nList" },
  { key: "location", label: "Местоположение", type: "i18n", help: "Только страна/город, без домашнего адреса" },
  { key: "careerStartYear", label: "Год начала карьеры", type: "number", help: "Стаж считается автоматически" },
  { key: "cvFile", label: "Файл CV (PDF)", type: "image", help: "Пусто — используется автоматическая страница CV" },
  { key: "heroImage", label: "Фото первого экрана (теодолит)", type: "image", help: "Пусто — рисованный теодолит. Фото автоматически тонируется в цвета сайта" },
  { key: "photo", label: "Фото (необязательно)", type: "image" },
];

export const contactFields: FieldDef[] = [
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Телефон", type: "text", help: "Пусто — не показывается" },
  { key: "whatsapp", label: "WhatsApp (номер)", type: "text" },
  { key: "telegram", label: "Telegram (@username)", type: "text" },
  { key: "linkedin", label: "LinkedIn (URL)", type: "text" },
  { key: "github", label: "GitHub (URL или логин)", type: "text" },
];

export type CollectionDef = {
  key: "experience" | "projects" | "education" | "certificates" | "skills" | "portfolio" | "services";
  label: string;
  titleKey: string;
  subtitle?: (item: Record<string, unknown>) => string;
  fields: FieldDef[];
  template: () => Record<string, unknown>;
};

const i18n = () => ({ en: "", ru: "", ky: "" });
const i18nList = () => ({ en: [], ru: [], ky: [] });
const map = () => ({ center: null, zoom: null, geojsonUrl: "" });
const uid = (p: string) => `${p}-${Date.now().toString(36)}`;

export const collections: CollectionDef[] = [
  {
    key: "experience",
    label: "Опыт работы",
    titleKey: "position",
    subtitle: (x) => `${x.start} – ${x.end}`,
    fields: [
      { key: "position", label: "Должность", type: "i18n" },
      { key: "organization", label: "Организация", type: "i18n" },
      { key: "start", label: "Начало", type: "text", help: "ГГГГ или ГГГГ-ММ" },
      { key: "end", label: "Окончание", type: "text", help: "ГГГГ или ГГГГ-ММ (точно по CV)" },
      { key: "location", label: "Место", type: "i18n" },
      { key: "details", label: "Подробности", type: "i18nList" },
      { key: "projectSlug", label: "Связанный проект (slug)", type: "text" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("exp"), start: "", end: "", organization: i18n(), position: i18n(), location: i18n(), details: i18nList(), projectSlug: "", published: false }),
  },
  {
    key: "projects",
    label: "Проекты",
    titleKey: "title",
    subtitle: (x) => String(x.period ?? ""),
    fields: [
      { key: "title", label: "Название", type: "i18n" },
      { key: "slug", label: "Slug (адрес страницы)", type: "text", help: "латиница, цифры, дефис" },
      { key: "client", label: "Заказчик", type: "i18n" },
      { key: "organization", label: "Организация", type: "i18n" },
      { key: "role", label: "Роль", type: "i18n" },
      { key: "period", label: "Период (текст)", type: "text" },
      { key: "startYear", label: "Год начала", type: "number" },
      { key: "endYear", label: "Год окончания", type: "number" },
      { key: "location", label: "Место", type: "i18n" },
      { key: "summary", label: "Краткое описание", type: "i18nArea" },
      { key: "activities", label: "Выполненные работы", type: "i18nList" },
      { key: "technologies", label: "Технологии (только подтверждённые)", type: "list" },
      { key: "images", label: "Галерея", type: "images" },
      { key: "map", label: "Карта", type: "map" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("prj"), slug: "", title: i18n(), organization: i18n(), client: i18n(), period: "", startYear: new Date().getFullYear(), endYear: new Date().getFullYear(), role: i18n(), location: i18n(), summary: i18n(), activities: i18nList(), technologies: [], images: [], map: map(), published: false }),
  },
  {
    key: "education",
    label: "Образование",
    titleKey: "institution",
    subtitle: (x) => String(x.period ?? ""),
    fields: [
      { key: "institution", label: "Учебное заведение", type: "i18n" },
      { key: "period", label: "Период", type: "text" },
      { key: "specialty", label: "Специальность", type: "i18n" },
      { key: "qualification", label: "Квалификация", type: "i18n" },
      { key: "faculty", label: "Факультет", type: "i18n" },
      { key: "thesis", label: "Тема дипломного проекта", type: "i18n" },
      { key: "image", label: "Копия диплома (без номеров и QR-кодов)", type: "image" },
      { key: "imageApproved", label: "Изображение проверено и одобрено для публикации", type: "bool" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("edu"), institution: i18n(), period: "", qualification: i18n(), specialty: i18n(), faculty: i18n(), thesis: i18n(), image: "", imageApproved: false, published: false }),
  },
  {
    key: "certificates",
    label: "Сертификаты",
    titleKey: "title",
    subtitle: (x) => `${x.year}${x.imageApproved ? "" : " · изображение не одобрено"}`,
    fields: [
      { key: "title", label: "Название", type: "i18n" },
      { key: "issuer", label: "Организация", type: "i18n" },
      { key: "date", label: "Дата (текст)", type: "i18n" },
      { key: "year", label: "Год", type: "number" },
      { key: "location", label: "Место", type: "i18n" },
      { key: "topics", label: "Тематика", type: "multiselect", options: CERT_TOPICS.map((v) => ({ value: v, label: TOPIC_LABELS[v] })) },
      { key: "description", label: "Описание", type: "i18nArea" },
      { key: "image", label: "Скан сертификата", type: "image" },
      { key: "imageApproved", label: "Изображение проверено и одобрено для публикации", type: "bool", help: "до одобрения скан не виден посетителям" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("cert"), title: i18n(), issuer: i18n(), date: i18n(), year: new Date().getFullYear(), location: i18n(), topics: [], description: i18n(), image: "", imageApproved: false, published: false }),
  },
  {
    key: "skills",
    label: "Навыки",
    titleKey: "title",
    fields: [
      { key: "title", label: "Категория", type: "i18n" },
      { key: "icon", label: "Иконка", type: "select", options: ICONS },
      { key: "items", label: "Навыки", type: "i18nList" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("sk"), icon: "layers", title: i18n(), items: i18nList(), published: false }),
  },
  {
    key: "portfolio",
    label: "Портфолио",
    titleKey: "title",
    subtitle: (x) => `${CAT_LABELS[String(x.category)] ?? x.category} · ${x.year}`,
    fields: [
      { key: "title", label: "Название", type: "i18n" },
      { key: "slug", label: "Slug (адрес страницы)", type: "text", help: "латиница, цифры, дефис" },
      { key: "category", label: "Категория", type: "select", options: PORTFOLIO_CATEGORIES.map((v) => ({ value: v, label: CAT_LABELS[v] })) },
      { key: "year", label: "Год / период", type: "text" },
      { key: "summary", label: "Краткое описание", type: "i18nArea" },
      { key: "body", label: "Текст страницы", type: "i18nArea", help: "Абзацы разделяйте пустой строкой" },
      { key: "projectSlug", label: "Связанный проект (slug)", type: "text" },
      { key: "images", label: "Карты, ортофотопланы, фото, скриншоты", type: "images" },
      { key: "map", label: "Карта", type: "map" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("pf"), slug: "", category: "gis-mapping", title: i18n(), summary: i18n(), body: i18n(), year: String(new Date().getFullYear()), projectSlug: "", images: [], map: map(), published: false }),
  },
  {
    key: "services",
    label: "Услуги",
    titleKey: "title",
    fields: [
      { key: "title", label: "Название", type: "i18n" },
      { key: "icon", label: "Иконка", type: "select", options: ICONS },
      { key: "description", label: "Описание", type: "i18nArea" },
      { key: "published", label: "Опубликовано", type: "bool" },
    ],
    template: () => ({ id: uid("svc"), icon: "compass", title: i18n(), description: i18n(), published: false }),
  },
];
