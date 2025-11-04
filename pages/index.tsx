import Head from "next/head";
import { useState, type ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import type { ResumeData } from "@/types/resume";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const resumeData: ResumeData = {
  basics: {
    name: "Avery Johnson",
    title: "Senior Product Designer & UX Strategist",
    email: "avery@northwindlabs.com",
    phone: "(206) 555-8123",
    website: "https://avery.design",
    location: {
      city: "Seattle",
      region: "WA",
      country: "USA",
    },
    profiles: [
      { network: "LinkedIn", url: "https://linkedin.com/in/averyjohnson" },
      { network: "Dribbble", url: "https://dribbble.com/averymakes" },
    ],
    summary:
      "Product designer who translates complex requirements into elegant experiences for enterprise and consumer audiences alike.",
  },
  summary: [
    "Leader who drives measurable impact through experimentation, storytelling, and deep partnership with engineering and product.",
    "Specializes in orchestrating design systems and research programs that keep multi-platform products cohesive and accessible.",
  ],
  experiences: [
    {
      role: "Lead Product Designer",
      company: "Northwind Labs",
      location: "Seattle, WA",
      startDate: "2019-04",
      endDate: "2024-11",
      summary:
        "Directed product discovery and delivery for Northwind's analytics suite used by Fortune 500 revenue teams.",
      highlights: [
        "Shipped a forecasting workflow that lifted qualified pipeline accuracy by 23% and shortened analyst handoffs by 37%.",
        "Built the Compass design system, uniting 17 product squads under shared accessibility and component governance.",
        "Partnered with data science to launch guided machine-learning scenarios that grew annual recurring revenue by $12M.",
      ],
      technologies: ["Figma", "Storybook", "Amplitude"],
    },
    {
      role: "Senior UX Designer",
      company: "Contoso Retail Cloud",
      location: "Remote",
      startDate: "2015-07",
      endDate: "2019-03",
      summary:
        "Scaled customer research and rapid prototyping to deliver omnichannel experiences for global retail partners.",
      highlights: [
        "Facilitated quarterly design sprints that cut experimentation cycles from 6 weeks to 9 days on average.",
        "Redesigned the B2B fulfillment portal, improving repeat order conversion by 18% and reducing support tickets by 32%.",
        "Implemented accessibility scorecards and coaching that moved WCAG conformance from 56% to 92% in one year.",
      ],
      technologies: ["Sketch", "InVision", "Adobe XD"],
    },
  ],
  projects: [
    {
      name: "Compass Design System",
      description:
        "Established the governance, tooling, and adoption programs for Northwind's component library across platforms.",
      highlights: [
        "Reduced net new interface defects by 48% through automated linting and Storybook visual regression suites.",
        "Introduced accessibility tokens and contrast automation that enabled 100% AA compliance on launch.",
      ],
      technologies: ["React", "Storybook", "Chromatic"],
      url: "https://northwindlabs.design/compass",
    },
    {
      name: "Voice of Customer Insights Platform",
      description:
        "Connected survey analytics, CRM data, and opportunity health into a single narrative workspace for GTM teams.",
      highlights: [
        "Synthesized 6k+ qualitative responses into decision frameworks that unlocked a $4.5M retention opportunity.",
        "Built experiment dashboards enabling PMs to track confidence levels and ROI in real time.",
      ],
      technologies: ["Figma", "Mixpanel", "Looker"],
    },
  ],
  education: [
    {
      institution: "Carnegie Mellon University",
      studyType: "M.HCI",
      area: "Human-Computer Interaction",
      startDate: "2011-08",
      endDate: "2013-05",
      highlights: [
        "Capstone with IDEO delivering connected health service blueprints for chronic care teams.",
      ],
    },
    {
      institution: "University of Washington",
      degree: "B.A.",
      area: "Visual Communication Design",
      startDate: "2007-09",
      endDate: "2011-06",
      highlights: ["Graduated magna cum laude; student design lab lead for 3 semesters."],
    },
  ],
  skills: [
    {
      category: "Product Strategy",
      items: [
        "Vision roadmapping",
        "Experiment design",
        "Executive storytelling",
      ],
    },
    {
      category: "Research & Discovery",
      items: [
        "Mixed-method studies",
        "JTBD synthesis",
        "Service blueprinting",
      ],
    },
    {
      category: "Tools",
      items: ["Figma", "FigJam", "Maze", "Looker", "Notion"],
    },
  ],
  awards: [
    {
      title: "Red Dot Design Award",
      awarder: "Red Dot: Brands & Communication Design",
      date: "2021-09",
      summary: "Recognized for measurable impact of the Compass design system roll out.",
    },
  ],
  certifications: [
    {
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2022-04",
    },
  ],
};

type ExperienceDisplay = {
  title: string;
  subtitle?: string;
  summary?: string;
  highlights: string[];
};

type ProjectDisplay = {
  title: string;
  subtitle?: string;
  highlights: string[];
};

type SkillDisplay = {
  label: string;
  value: string;
};

type EducationDisplay = {
  title: string;
  subtitle?: string;
  details: string[];
};

type AchievementDisplay = {
  title: string;
  detail?: string;
};

function parseDateString(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parts = trimmed.split(/[-/]/);
  if (parts.length === 1) {
    const year = Number(parts[0]);
    if (!Number.isNaN(year) && year >= 1900 && year <= 2100) {
      return new Date(year, 0, 1);
    }
  }
  if (parts.length >= 2) {
    const [yearPart, monthPart, dayPart] = parts.length === 2 ? [parts[0], parts[1], "1"] : parts;
    const year = Number(yearPart);
    const month = Number(monthPart);
    const day = Number(dayPart ?? "1");
    if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12) {
      return new Date(year, month - 1, Number.isNaN(day) ? 1 : day);
    }
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return undefined;
}

function formatDate(value?: string): string | undefined {
  const parsed = parseDateString(value);
  if (!parsed) {
    return value?.trim();
  }
  return parsed.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function formatDateRange(start?: string, end?: string, isCurrent?: boolean): string | undefined {
  const formattedStart = formatDate(start);
  const formattedEnd = isCurrent ? "Present" : formatDate(end);
  if (formattedStart && formattedEnd) {
    if (formattedStart === formattedEnd) {
      return formattedStart;
    }
    return `${formattedStart} – ${formattedEnd}`;
  }
  return formattedStart ?? formattedEnd;
}

function buildContactInfo(data: ResumeData): string[] {
  const items: string[] = [];
  if (data.basics?.email) items.push(data.basics.email);
  if (data.basics?.phone) items.push(data.basics.phone);
  if (data.basics?.website) items.push(data.basics.website);

  const location = [data.basics?.location?.city, data.basics?.location?.region, data.basics?.location?.country]
    .filter(Boolean)
    .join(", ");
  if (location) {
    items.push(location);
  }

  (data.basics?.profiles ?? []).forEach((profile) => {
    if (profile?.url) {
      items.push(profile.url);
    } else if (profile?.network && profile?.username) {
      items.push(`${profile.network}: ${profile.username}`);
    }
  });

  return items;
}

function collectSummaryParagraphs(data: ResumeData): string[] {
  const candidate =
    data.summary ??
    data.basics?.summary ??
    data.objective ??
    data.headline ??
    data.overview ??
    data.profile ??
    data.description;
  if (!candidate) {
    return [];
  }
  if (Array.isArray(candidate)) {
    return candidate.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  }
  return candidate
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function collectExperiences(data: ResumeData): ExperienceDisplay[] {
  const sources = [
    data.experiences,
    data.experience,
    data.work,
    data.professionalExperience,
    data.employmentHistory,
    data.roles,
  ];

  return sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item && (item.company || item.name || item.organization || item.role || item.position))
    .map((item) => {
      const company = item.company ?? item.organization ?? item.name ?? "";
      const role = item.role ?? item.title ?? item.position ?? "";
      const title = [role, company].filter(Boolean).join(" · ") || company || role;
      const location = item.location ?? [item.city, item.region].filter(Boolean).join(", ");
      const dates = formatDateRange(item.startDate ?? item.start ?? item.from, item.endDate ?? item.end ?? item.to, item.isCurrent);
      const subtitle = [location, dates].filter(Boolean).join(" | ") || undefined;
      const summary = item.summary ?? item.description;
      const highlights = (item.highlights ?? item.bullets ?? item.achievements ?? [])
        .map((entry) => entry?.trim())
        .filter((entry): entry is string => !!entry && entry.length > 0);
      const technologies = (item.technologies ?? [])
        .map((entry) => entry?.trim())
        .filter((entry): entry is string => !!entry && entry.length > 0);
      if (technologies.length > 0) {
        highlights.push(`Tech: ${technologies.join(", ")}`);
      }
      return {
        title,
        subtitle,
        summary: summary?.trim() || undefined,
        highlights,
      };
    });
}

function collectProjects(data: ResumeData): ProjectDisplay[] {
  const sources = [data.projects, data.initiatives];
  return sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item && (item.name || item.title))
    .map((item) => {
      const title = item.name ?? item.title ?? "";
      const subtitle = item.url ?? item.link ?? undefined;
      const highlights: string[] = [];
      if (item.description ?? item.summary) {
        highlights.push((item.description ?? item.summary ?? "").trim());
      }
      (item.highlights ?? [])
        .map((entry) => entry?.trim())
        .filter((entry): entry is string => !!entry && entry.length > 0)
        .forEach((entry) => highlights.push(entry));
      const technologies = (item.technologies ?? item.tech ?? item.keywords ?? [])
        .map((entry) => entry?.trim())
        .filter((entry): entry is string => !!entry && entry.length > 0);
      if (technologies.length > 0) {
        highlights.push(`Stack: ${technologies.join(", ")}`);
      }
      return {
        title,
        subtitle,
        highlights,
      };
    });
}

function collectSkills(data: ResumeData): SkillDisplay[] {
  const sources = [data.skills, data.skillCategories, data.competencies];
  return sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .map((skill) => {
      const label = skill?.category ?? skill?.name ?? skill?.label ?? skill?.type ?? "Skills";
      const values = Array.isArray(skill?.items ?? skill?.skills ?? skill?.keywords)
        ? (skill?.items ?? skill?.skills ?? skill?.keywords ?? [])
            .map((entry) => entry?.trim())
            .filter((entry): entry is string => !!entry && entry.length > 0)
        : typeof (skill?.items ?? skill?.skills ?? skill?.keywords) === "string"
          ? (skill?.items ?? skill?.skills ?? skill?.keywords ?? "")
              .split(/,\s*/)
              .map((entry) => entry.trim())
              .filter((entry) => entry.length > 0)
          : [];
      return {
        label,
        value: values.join(", "),
      };
    })
    .filter((entry) => entry.value.length > 0);
}

function collectEducation(data: ResumeData): EducationDisplay[] {
  const sources = [data.education, data.educationHistory, data.academics, data.studies];
  return sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item && (item.institution || item.school || item.organization))
    .map((item) => {
      const institution = item.institution ?? item.school ?? item.organization ?? "";
      const degree = [item.studyType ?? item.degree ?? item.field ?? item.area]
        .flat()
        .filter((entry): entry is string => !!entry && entry.trim().length > 0)
        .join(" ");
      const title = [degree, institution].filter(Boolean).join(" · ") || institution;
      const dates = formatDateRange(item.startDate ?? item.start ?? item.from, item.endDate ?? item.end ?? item.to);
      const subtitle = dates ?? undefined;
      const details = (item.highlights ?? item.courses ?? [])
        .map((entry) => entry?.trim())
        .filter((entry): entry is string => !!entry && entry.length > 0);
      if (item.score ?? item.gpa) {
        details.push(`GPA: ${(item.score ?? item.gpa ?? "").trim()}`);
      }
      return {
        title,
        subtitle,
        details,
      };
    });
}

function collectAchievements(data: ResumeData): AchievementDisplay[] {
  const awards = (data.awards ?? data.honors ?? [])
    .map((award) => {
      if (!award) return undefined;
      const title = [award.title, award.awarder].filter(Boolean).join(" · ");
      const detail = formatDate(award.date) ?? award.summary;
      if (!title) {
        return undefined;
      }
      return { title, detail: detail?.trim() };
    })
    .filter((entry): entry is AchievementDisplay => !!entry);

  const certifications = (data.certifications ?? [])
    .map((cert) => {
      if (!cert) return undefined;
      const title = [cert.name, cert.issuer].filter(Boolean).join(" · ");
      const detail = formatDate(cert.date) ?? cert.summary;
      if (!title) {
        return undefined;
      }
      return { title, detail: detail?.trim() };
    })
    .filter((entry): entry is AchievementDisplay => !!entry);

  return [...awards, ...certifications];
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const contactInfo = buildContactInfo(resumeData);
  const summaryParagraphs = collectSummaryParagraphs(resumeData);
  const experiences = collectExperiences(resumeData);
  const projects = collectProjects(resumeData);
  const skills = collectSkills(resumeData);
  const education = collectEducation(resumeData);
  const achievements = collectAchievements(resumeData);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fallbackName = resumeData.basics?.name ?? "resume";
      link.href = url;
      link.download = `${fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF", error);
      setDownloadError(error instanceof Error ? error.message : "Unable to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-100`}> 
      <Head>
        <title>{`${resumeData.basics?.name ?? "Tailored Resume"} · Tailored Resume`}</title>
      </Head>
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10">
        <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 sm:p-12">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {resumeData.basics?.name}
                </h1>
                {resumeData.basics?.title && (
                  <p className="text-lg text-slate-600">{resumeData.basics.title}</p>
                )}
                {resumeData.basics?.summary && (
                  <p className="max-w-2xl text-sm text-slate-600">{resumeData.basics.summary}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                  {contactInfo.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700 ring-1 ring-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isDownloading ? "Preparing PDF…" : "Download polished PDF"}
                </button>
                {downloadError && <p className="max-w-xs text-sm text-red-600">{downloadError}</p>}
              </div>
            </header>

            {summaryParagraphs.length > 0 && (
              <Section title="Summary">
                <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                  {summaryParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Section>
            )}

            {experiences.length > 0 && (
              <Section title="Experience">
                {experiences.map((experience) => (
                  <article
                    key={`${experience.title}-${experience.subtitle}`}
                    className="rounded-2xl border border-slate-200/70 bg-white/60 p-5 shadow-sm shadow-slate-100"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold text-slate-900">{experience.title}</h3>
                      {experience.subtitle && (
                        <p className="text-sm text-slate-500">{experience.subtitle}</p>
                      )}
                    </div>
                    {experience.summary && (
                      <p className="mt-2 text-sm text-slate-600">{experience.summary}</p>
                    )}
                    {experience.highlights.length > 0 && (
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {experience.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-slate-400" aria-hidden />
                            <span className="flex-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </Section>
            )}

            {projects.length > 0 && (
              <Section title="Projects">
                {projects.map((project) => (
                  <article
                    key={`${project.title}-${project.subtitle}`}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm shadow-emerald-100"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold text-emerald-900">{project.title}</h3>
                      {project.subtitle && (
                        <a
                          className="text-sm font-medium text-emerald-700 hover:underline"
                          href={project.subtitle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {project.subtitle}
                        </a>
                      )}
                    </div>
                    {project.highlights.length > 0 && (
                      <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                        {project.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" aria-hidden />
                            <span className="flex-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </Section>
            )}

            {skills.length > 0 && (
              <Section title="Core Strengths">
                <div className="grid gap-3 sm:grid-cols-2">
                  {skills.map((skill) => (
                    <div key={skill.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-sm font-semibold text-slate-700">{skill.label}</p>
                      <p className="mt-2 text-sm text-slate-600">{skill.value}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {education.length > 0 && (
              <Section title="Education">
                {education.map((entry) => (
                  <article key={`${entry.title}-${entry.subtitle}`} className="rounded-2xl border border-slate-200/60 p-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold text-slate-900">{entry.title}</h3>
                      {entry.subtitle && <p className="text-sm text-slate-500">{entry.subtitle}</p>}
                    </div>
                    {entry.details.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {entry.details.map((detail) => (
                          <li key={detail}>• {detail}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </Section>
            )}

            {achievements.length > 0 && (
              <Section title="Awards & Certifications">
                <div className="grid gap-3 sm:grid-cols-2">
                  {achievements.map((achievement) => (
                    <div key={`${achievement.title}-${achievement.detail}`} className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-200">
                      <p className="text-sm font-semibold text-slate-800">{achievement.title}</p>
                      {achievement.detail && <p className="mt-1 text-sm text-slate-600">{achievement.detail}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
