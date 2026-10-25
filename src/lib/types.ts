export const LOCALES = ["en", "ru", "ky"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Text in all three site languages. Empty strings fall back to English. */
export type I18n = { en: string; ru: string; ky: string };
export type I18nList = { en: string[]; ru: string[]; ky: string[] };

export type MapSettings = {
  /** [lat, lng]; empty = whole Kyrgyzstan */
  center?: [number, number] | null;
  zoom?: number | null;
  /** URL of a public GeoJSON file (e.g. uploaded via admin) */
  geojsonUrl?: string;
  /** A ready-made web map (e.g. a qgis2web export in /public/maps) shown in an iframe instead of the default map */
  embedUrl?: string;
};

export type Profile = {
  name: I18n;
  fullName: I18n;
  headline: I18n;
  roles: string[];
  tagline: I18n;
  subtitle: I18n;
  bio: I18n;
  specializations: I18nList;
  location: I18n;
  careerStartYear: number;
  photo: string;
  /** Photo for the first screen (e.g. a theodolite). Empty = drawn illustration. */
  heroImage?: string;
  /** Optional uploaded CV file (PDF). When empty the generated CV page is used. */
  cvFile: string;
  languages: { name: I18n; level: I18n }[];
  highlights: { title: I18n; text: I18n }[];
};

export type Contacts = {
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  linkedin: string;
  github: string;
};

export type Experience = {
  id: string;
  /** YYYY or YYYY-MM */
  start: string;
  end: string;
  organization: I18n;
  position: I18n;
  location: I18n;
  details: I18nList;
  projectSlug: string;
  published: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: I18n;
  organization: I18n;
  client: I18n;
  period: string;
  startYear: number;
  endYear: number;
  role: I18n;
  location: I18n;
  summary: I18n;
  activities: I18nList;
  technologies: string[];
  images: string[];
  /** Map sets shown with the page-by-page viewer (e.g. basin plan maps) */
  documents?: PageDocument[];
  map: MapSettings;
  published: boolean;
};

export type Education = {
  id: string;
  institution: I18n;
  period: string;
  qualification: I18n;
  specialty: I18n;
  faculty: I18n;
  thesis: I18n;
  image: string;
  imageApproved: boolean;
  published: boolean;
};

export type Certificate = {
  id: string;
  title: I18n;
  issuer: I18n;
  date: I18n;
  year: number;
  location: I18n;
  topics: string[];
  description: I18n;
  image: string;
  /** Owner must approve each scanned document before its image is shown publicly. */
  imageApproved: boolean;
  published: boolean;
};

export type SkillGroup = {
  id: string;
  icon: string;
  title: I18n;
  items: I18nList;
  published: boolean;
};

/** A multi-page publication (e.g. an atlas) rendered to images: {base}/page-01.jpg … page-NN.jpg (+ -thumb.jpg). */
export type PageDocument = {
  id: string;
  title: I18n;
  base: string;
  pages: number;
};

export type PortfolioItem = {
  id: string;
  slug: string;
  category: string;
  title: I18n;
  summary: I18n;
  body: I18n;
  year: string;
  projectSlug: string;
  images: string[];
  documents?: PageDocument[];
  map: MapSettings;
  published: boolean;
};

export type Service = {
  id: string;
  icon: string;
  title: I18n;
  description: I18n;
  published: boolean;
};

export type SiteContent = {
  profile: Profile;
  contacts: Contacts;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certificates: Certificate[];
  skills: SkillGroup[];
  portfolio: PortfolioItem[];
  services: Service[];
  /** Overrides for interface strings: { en: { "nav.about": "..." }, ... } */
  uiOverrides: Record<Locale, Record<string, string>>;
};

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  organization: string;
  service: string;
  message: string;
  locale: string;
  read: boolean;
};

export const PORTFOLIO_CATEGORIES = [
  "gis-mapping",
  "land-surveying",
  "cadastral",
  "remote-sensing",
  "uav",
  "web-gis",
  "water",
] as const;

export const CERT_TOPICS = ["gis", "remote-sensing", "uav", "programming", "project-management"] as const;
