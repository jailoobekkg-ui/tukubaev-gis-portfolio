import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Hero from "@/components/site/Hero";
import Stats from "@/components/site/Stats";
import About from "@/components/site/About";
import Section, { Reveal } from "@/components/site/Section";
import ExperienceTimeline from "@/components/site/ExperienceTimeline";
import ProjectCard from "@/components/site/ProjectCard";
import EducationCards from "@/components/site/EducationCards";
import Certificates from "@/components/site/Certificates";
import Skills from "@/components/site/Skills";
import PortfolioGrid from "@/components/site/PortfolioGrid";
import Services from "@/components/site/Services";
import Contact from "@/components/site/Contact";
import { getPublicContent } from "@/lib/content";
import { format, getDictionary, isLocale, tr } from "@/lib/i18n";
import { siteUrl, yearsOfExperience } from "@/lib/utils";

export const revalidate = 86400;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = await getPublicContent();
  const t = getDictionary(lang, content.uiOverrides);
  const p = content.profile;
  const years = yearsOfExperience(p.careerStartYear);
  const cvHref = p.cvFile || `/${lang}/cv`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: tr(p.name, "en"),
    alternateName: [tr(p.fullName, "ru")],
    jobTitle: tr(p.headline, "en"),
    email: content.contacts.email ? `mailto:${content.contacts.email}` : undefined,
    url: `${siteUrl()}/${lang}`,
    nationality: { "@type": "Country", name: "Kyrgyz Republic" },
    alumniOf: content.education.map((e) => ({ "@type": "CollegeOrUniversity", name: tr(e.institution, "en") })),
    knowsAbout: ["Geographic Information Systems", "Remote Sensing", "Land Management", "Cadastre", "Cartography", "Web GIS"],
    knowsLanguage: ["ky", "ru", "en"],
    sameAs: [content.contacts.linkedin, content.contacts.github].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero
        name={tr(p.name, lang)}
        headline={tr(p.headline, lang)}
        subtitle={tr(p.subtitle, lang)}
        tagline={tr(p.tagline, lang)}
        roles={p.roles}
        years={years}
        cvHref={cvHref}
      />
      <Stats items={p.highlights.map((h) => ({ title: format(tr(h.title, lang), { years }), text: tr(h.text, lang) }))} />

      <About content={content} locale={lang} />

      <Section id="experience" kicker={t["experience.kicker"]} title={t["experience.title"]} className="bg-bg2/40">
        <ExperienceTimeline items={content.experience} />
      </Section>

      <Section id="projects" kicker={t["projects.kicker"]} title={t["projects.title"]}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...content.projects]
            .sort((a, b) => b.endYear - a.endYear || b.startYear - a.startYear)
            .map((pr, i) => (
              <Reveal key={pr.id} delay={Math.min(i * 0.05, 0.25)}>
                <ProjectCard project={pr} locale={lang} t={t} index={i} />
              </Reveal>
            ))}
        </div>
        <p className="mt-6 text-xs text-muted">{t["projects.disclaimer"]}</p>
      </Section>

      <Section id="education" kicker={t["education.kicker"]} title={t["education.title"]} className="bg-bg2/40">
        <EducationCards items={content.education} />
      </Section>

      <Section id="certificates" kicker={t["certs.kicker"]} title={t["certs.title"]}>
        <Certificates items={content.certificates} />
      </Section>

      <Section id="skills" kicker={t["skills.kicker"]} title={t["skills.title"]} intro={t["skills.note"]} className="bg-bg2/40">
        <Skills groups={content.skills} locale={lang} />
      </Section>

      <Section
        id="portfolio"
        kicker={t["portfolio.kicker"]}
        title={t["portfolio.title"]}
        intro={t["portfolio.intro"]}
        action={
          <Link href={`/${lang}/portfolio`} className="btn-ghost shrink-0">
            {t["portfolio.viewAll"]} <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        }
      >
        <PortfolioGrid items={content.portfolio} limit={6} />
      </Section>

      <Section id="gis-lab" kicker={t["lab.kicker"]} title={t["lab.title"]} intro={t["lab.intro"]} className="bg-bg2/40">
        <Reveal>
          <Link href={`/${lang}/gis-lab`} className="card card-hover group relative block overflow-hidden p-8 md:p-10">
            <div className="grid-bg absolute inset-0 opacity-70" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {[t["lab.basemap"], "GeoJSON · KML · GPX", t["lab.distance"], t["lab.area"], t["lab.search"], t["lab.export"]].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-accent2" />{x}</li>
                ))}
              </ul>
              <span className="btn-primary self-start md:self-auto">
                <Icon name="layers" className="h-4 w-4" /> {t["lab.open"]}
              </span>
            </div>
          </Link>
        </Reveal>
      </Section>

      <Section id="services" kicker={t["services.kicker"]} title={t["services.title"]}>
        <Services items={content.services} />
      </Section>

      <Section id="contact" kicker={t["contact.kicker"]} title={t["contact.title"]} className="bg-bg2/40">
        <Contact contacts={content.contacts} location={p.location} services={content.services.map((s) => tr(s.title, lang))} />
      </Section>
    </>
  );
}
