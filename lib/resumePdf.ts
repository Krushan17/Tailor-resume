import { type ResumeData, type ResumeExperience, type ResumeSkill, type ResumeEducation, type ResumeProject, type ResumeAward } from "@/types/resume";

const PAGE_WIDTH = 612; // 8.5in * 72dpi
const PAGE_HEIGHT = 792; // 11in * 72dpi
const MARGIN = 56;
const DEFAULT_FONT_SIZE = 11;
const LINE_HEIGHT_RATIO = 1.42;

type FontKey = "F1" | "F2" | "F3";

type ParagraphOptions = {
  font?: FontKey;
  fontSize?: number;
  indent?: number;
  lineHeight?: number;
  gapAfter?: number;
  maxWidth?: number;
};

type BulletOptions = ParagraphOptions & {
  bulletIndent?: number;
};

class SimplePdfDocument {
  private pages: string[][] = [];
  private currentPageIndex = -1;
  private cursorY = PAGE_HEIGHT - MARGIN;

  constructor() {
    this.addPage();
  }

  private addPage() {
    this.pages.push([]);
    this.currentPageIndex = this.pages.length - 1;
    this.cursorY = PAGE_HEIGHT - MARGIN;
  }

  private currentPage(): string[] {
    return this.pages[this.currentPageIndex];
  }

  private escapeText(text: string): string {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  private measureText(text: string, fontSize: number): number {
    if (!text) {
      return 0;
    }
    const length = text.length;
    const uppercaseCount = (text.match(/[A-Z]/g) ?? []).length;
    const wideCount = (text.match(/[MW@&%]/g) ?? []).length;
    const base = length * fontSize * 0.5;
    const uppercaseAdjust = uppercaseCount * fontSize * 0.05;
    const wideAdjust = wideCount * fontSize * 0.08;
    return base + uppercaseAdjust + wideAdjust;
  }

  private ensureSpace(spaceNeeded: number) {
    if (this.cursorY - spaceNeeded < MARGIN) {
      this.addPage();
    }
  }

  private addRaw(block: string) {
    this.currentPage().push(block);
  }

  private writeLine(text: string, x: number, y: number, font: FontKey, fontSize: number) {
    const escaped = this.escapeText(text);
    const block = [
      "BT",
      `/${font} ${fontSize.toFixed(2)} Tf`,
      `${x.toFixed(2)} ${y.toFixed(2)} Td`,
      `(${escaped}) Tj`,
      "ET",
    ].join("\n");
    this.addRaw(block);
  }

  addGap(size: number) {
    this.cursorY -= size;
    if (this.cursorY < MARGIN) {
      this.addPage();
    }
  }

  addParagraph(text: string, options: ParagraphOptions = {}) {
    const font = options.font ?? "F1";
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
    const lineHeight = options.lineHeight ?? fontSize * LINE_HEIGHT_RATIO;
    const indent = options.indent ?? 0;
    const maxWidth = options.maxWidth ?? PAGE_WIDTH - 2 * MARGIN - indent;

    const segments = text
      .split(/\n+/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0);

    segments.forEach((segment, index) => {
      const lines = this.wrapText(segment, fontSize, maxWidth);
      lines.forEach((line) => {
        this.ensureSpace(lineHeight);
        this.writeLine(line, MARGIN + indent, this.cursorY, font, fontSize);
        this.cursorY -= lineHeight;
      });
      if (index < segments.length - 1) {
        this.addGap(lineHeight * 0.5);
      }
    });

    if (options.gapAfter) {
      this.addGap(options.gapAfter);
    }
  }

  addHeading(text: string, fontSize = 20) {
    const lineHeight = fontSize * LINE_HEIGHT_RATIO;
    this.ensureSpace(lineHeight);
    this.writeLine(text, MARGIN, this.cursorY, "F2", fontSize);
    this.cursorY -= lineHeight;
    this.addGap(fontSize * 0.25);
  }

  addSubHeading(text: string, fontSize = 14) {
    const lineHeight = fontSize * LINE_HEIGHT_RATIO;
    this.ensureSpace(lineHeight);
    this.writeLine(text, MARGIN, this.cursorY, "F3", fontSize);
    this.cursorY -= lineHeight;
  }

  addLabelValue(label: string, value: string, options: ParagraphOptions = {}) {
    if (!label && !value) {
      return;
    }
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
    const lineHeight = options.lineHeight ?? fontSize * LINE_HEIGHT_RATIO;
    const indent = options.indent ?? 0;
    const y = this.cursorY;
    this.ensureSpace(lineHeight);
    const baseX = MARGIN + indent;
    if (label) {
      this.writeLine(label, baseX, this.cursorY, "F2", fontSize);
    }
    if (value) {
      const labelWidth = label ? this.measureText(`${label} `, fontSize) : 0;
      this.writeLine(value, baseX + labelWidth, y, options.font ?? "F1", fontSize);
    }
    this.cursorY -= lineHeight;
  }

  addBulletList(items: string[], options: BulletOptions = {}) {
    const font = options.font ?? "F1";
    const fontSize = options.fontSize ?? DEFAULT_FONT_SIZE;
    const lineHeight = options.lineHeight ?? fontSize * LINE_HEIGHT_RATIO;
    const indent = options.indent ?? 0;
    const bulletIndent = options.bulletIndent ?? fontSize * 1.1;
    const maxWidth = options.maxWidth ?? PAGE_WIDTH - 2 * MARGIN - indent - bulletIndent;

    items
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .forEach((item) => {
        const lines = this.wrapText(item, fontSize, maxWidth);
        lines.forEach((line, index) => {
          this.ensureSpace(lineHeight);
          const x = MARGIN + indent + (index === 0 ? 0 : bulletIndent);
          const content = index === 0 ? `• ${line}` : line;
          this.writeLine(content, x, this.cursorY, font, fontSize);
          this.cursorY -= lineHeight;
        });
      });

    if (options.gapAfter) {
      this.addGap(options.gapAfter);
    }
  }

  private wrapText(text: string, fontSize: number, maxWidth: number): string[] {
    if (!text) {
      return [];
    }
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (this.measureText(candidate, fontSize) <= maxWidth || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    });

    if (current) {
      lines.push(current);
    }

    return lines;
  }

  getPages(): string[] {
    if (this.pages.length === 0) {
      this.addPage();
    }
    return this.pages.map((page) => page.join("\n"));
  }
}

function buildPdfFromPages(pages: string[], width: number, height: number): Buffer {
  const objects: string[] = [];

  const addObject = (body: string): number => {
    const index = objects.length + 1;
    objects.push(`${index} 0 obj\n${body}\nendobj\n`);
    return index;
  };

  const fontRegular = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBold = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const fontItalic = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>");

  const pagesObjectIndex = objects.length + 1;
  objects.push("__PAGES_PLACEHOLDER__");

  const pageReferences: number[] = [];
  const safePages = pages.length > 0 ? pages : [""];

  safePages.forEach((pageContent) => {
    const normalizedContent = pageContent.endsWith("\n") ? pageContent : `${pageContent}\n`;
    const body = normalizedContent.trim().length > 0 ? normalizedContent : "";
    const stream = `<< /Length ${Buffer.byteLength(body, "utf8")} >>\nstream\n${body}endstream`;
    const streamObject = addObject(stream);
    const pageObject = addObject(
      [
        "<< /Type /Page",
        `/Parent ${pagesObjectIndex} 0 R`,
        `/MediaBox [0 0 ${width} ${height}]`,
        `/Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R /F3 ${fontItalic} 0 R >> >>`,
        `/Contents ${streamObject} 0 R`,
        ">>",
      ].join("\n"),
    );
    pageReferences.push(pageObject);
  });

  const kids = pageReferences.map((ref) => `${ref} 0 R`).join(" ");
  const pagesObject = [
    "<< /Type /Pages",
    `/Kids [${kids}]`,
    `/Count ${pageReferences.length}`,
    ">>",
  ].join("\n");
  objects[pagesObjectIndex - 1] = `${pagesObjectIndex} 0 obj\n${pagesObject}\nendobj\n`;

  const catalogObject = addObject(`<< /Type /Catalog /Pages ${pagesObjectIndex} 0 R >>`);

  const header = Buffer.from("%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n", "utf8");
  const objectBuffers = objects.map((object) => Buffer.from(object, "utf8"));

  let currentOffset = header.length;
  const xrefEntries = ["0000000000 65535 f \n"];
  objectBuffers.forEach((buffer) => {
    xrefEntries.push(`${currentOffset.toString().padStart(10, "0")} 00000 n \n`);
    currentOffset += buffer.length;
  });

  const xref = Buffer.from(`xref\n0 ${objects.length + 1}\n${xrefEntries.join("")}`, "utf8");
  const trailer = Buffer.from(
    [
      "trailer",
      `<< /Size ${objects.length + 1} /Root ${catalogObject} 0 R >>`,
      "startxref",
      `${currentOffset}`,
      "%%EOF",
    ].join("\n"),
    "utf8",
  );

  return Buffer.concat([header, ...objectBuffers, xref, trailer]);
}

interface NormalizedExperience {
  heading: string;
  subHeading?: string;
  summary?: string;
  highlights: string[];
}

interface NormalizedEducation {
  heading: string;
  subHeading?: string;
  details: string[];
}

interface NormalizedProject {
  heading: string;
  subHeading?: string;
  highlights: string[];
}

interface NormalizedSkill {
  label: string;
  value: string;
}

interface NormalizedAward {
  heading: string;
  detail?: string;
}

interface NormalizedCertification {
  heading: string;
  detail?: string;
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

function formatDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const sanitized = value.trim();
  if (!sanitized) {
    return undefined;
  }
  const date = parseDateString(sanitized);
  if (!date) {
    return sanitized;
  }
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function parseDateString(input: string): Date | undefined {
  const trimmed = input.trim();
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
    if (
      !Number.isNaN(year) &&
      !Number.isNaN(month) &&
      month >= 1 &&
      month <= 12 &&
      year >= 1900 &&
      year <= 2100
    ) {
      return new Date(year, month - 1, Number.isNaN(day) ? 1 : day);
    }
  }
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  return undefined;
}

function collectExperiences(resume: ResumeData): NormalizedExperience[] {
  const sources: (ResumeExperience[] | undefined)[] = [
    resume.experiences,
    resume.experience,
    resume.work,
    resume.professionalExperience,
    resume.employmentHistory,
    resume.roles,
  ];

  const items = sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item && (item.company || item.name || item.organization || item.role || item.position));

  return items.map((item) => {
    const company = item.company ?? item.organization ?? item.name ?? "";
    const role = item.role ?? item.title ?? item.position ?? "";
    const heading = [role, company].filter(Boolean).join(" · ");
    const location = item.location ?? [item.city, item.region].filter(Boolean).join(", ");
    const dates = formatDateRange(
      item.startDate ?? item.start ?? item.from,
      item.endDate ?? item.end ?? item.to,
      item.isCurrent,
    );
    const subHeading = [location, dates].filter(Boolean).join(" | ");
    const summary = item.summary ?? item.description;
    const highlights = (item.highlights ?? item.bullets ?? item.achievements ?? []).filter(
      (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
    );
    const technologies = (item.technologies ?? []).filter((tech): tech is string => typeof tech === "string");
    if (technologies.length > 0) {
      highlights.push(`Tech: ${technologies.join(", ")}`);
    }
    return {
      heading: heading || company || role || "",
      subHeading: subHeading || undefined,
      summary: summary || undefined,
      highlights,
    };
  });
}

function collectEducation(resume: ResumeData): NormalizedEducation[] {
  const sources: (ResumeEducation[] | undefined)[] = [
    resume.education,
    resume.educationHistory,
    resume.academics,
    resume.studies,
  ];

  const items = sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item && (item.institution || item.school || item.organization));

  return items.map((item) => {
    const institution = item.institution ?? item.school ?? item.organization ?? "";
    const degree = [item.studyType ?? item.degree ?? item.field ?? item.area]
      .flat()
      .filter((value): value is string => typeof value === "string");
    const heading = [degree.join(" "), institution].filter(Boolean).join(" · ");
    const dates = formatDateRange(
      item.startDate ?? item.start ?? item.from,
      item.endDate ?? item.end ?? item.to,
      undefined,
    );
    const detailParts = [dates, item.score ?? item.gpa];
    const details = detailParts.filter((part): part is string => !!part && part.trim().length > 0);
    const highlightText = (item.highlights ?? item.courses ?? []).filter(
      (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
    );
    return {
      heading: heading || institution,
      subHeading: details.join(" | ") || undefined,
      details: highlightText,
    };
  });
}

function collectProjects(resume: ResumeData): NormalizedProject[] {
  const sources: (ResumeProject[] | undefined)[] = [resume.projects, resume.initiatives];

  const items = sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item && (item.name || item.title));

  return items.map((item) => {
    const name = item.name ?? item.title ?? "";
    const link = item.url ?? item.link;
    const technologies = (item.technologies ?? item.tech ?? item.keywords ?? [])
      .filter((entry): entry is string => typeof entry === "string");
    const highlights = (item.highlights ?? []).filter((entry): entry is string => typeof entry === "string");
    if (item.description ?? item.summary) {
      highlights.unshift(item.description ?? item.summary ?? "");
    }
    if (technologies.length > 0) {
      highlights.push(`Stack: ${technologies.join(", ")}`);
    }
    return {
      heading: name,
      subHeading: link ?? undefined,
      highlights,
    };
  });
}

function collectSkills(resume: ResumeData): NormalizedSkill[] {
  const sources: (ResumeSkill[] | undefined)[] = [resume.skills, resume.skillCategories, resume.competencies];

  const items = sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((item) => item);

  return items.map((item) => {
    const label = item.category ?? item.name ?? item.label ?? item.type ?? "Skills";
    const rawItems = item.items ?? item.skills ?? item.keywords ?? [];
    const values = Array.isArray(rawItems)
      ? rawItems.filter((entry): entry is string => typeof entry === "string")
      : typeof rawItems === "string"
        ? rawItems.split(/,\s*/)
        : [];
    return {
      label,
      value: values.join(", "),
    };
  });
}

function collectAwards(resume: ResumeData): NormalizedAward[] {
  const sources: (ResumeAward[] | undefined)[] = [resume.awards, resume.honors];
  return sources
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .filter((award) => award && (award.title || award.awarder))
    .map((award) => ({
      heading: [award.title, award.awarder].filter(Boolean).join(" · "),
      detail: formatDate(award.date) ?? award.summary,
    }));
}

function collectCertifications(resume: ResumeData): NormalizedCertification[] {
  return (resume.certifications ?? [])
    .filter((cert) => cert && (cert.name || cert.issuer))
    .map((cert) => ({
      heading: [cert.name, cert.issuer].filter(Boolean).join(" · "),
      detail: formatDate(cert.date) ?? cert.summary,
    }));
}

function buildSummary(resume: ResumeData): string | undefined {
  const summaryCandidate =
    resume.summary ??
    resume.basics?.summary ??
    resume.objective ??
    resume.headline ??
    resume.overview ??
    resume.profile ??
    resume.description;
  if (Array.isArray(summaryCandidate)) {
    return summaryCandidate.join(" ");
  }
  return typeof summaryCandidate === "string" ? summaryCandidate : undefined;
}

function buildContactLine(resume: ResumeData): string[] {
  const contactParts: string[] = [];
  const email = resume.basics?.email ?? resume.contact?.email;
  const phone = resume.basics?.phone ?? resume.contact?.phone;
  const website = resume.basics?.website ?? resume.contact?.website;
  const location =
    resume.contact?.location ??
    resume.contact?.address ??
    [
      resume.basics?.location?.city,
      resume.basics?.location?.region,
      resume.basics?.location?.country,
    ]
      .filter(Boolean)
      .join(", ");

  if (email) {
    contactParts.push(email);
  }
  if (phone) {
    contactParts.push(phone);
  }
  if (website) {
    contactParts.push(website);
  }
  if (location) {
    contactParts.push(location);
  }

  const profiles = (resume.basics?.profiles ?? []).filter((profile) => profile && (profile.url || profile.username));
  profiles.forEach((profile) => {
    if (profile.url) {
      contactParts.push(profile.url);
    } else if (profile.network && profile.username) {
      contactParts.push(`${profile.network}: ${profile.username}`);
    }
  });

  const extras = (resume.strengths ?? [])
    .concat(resume.extras ?? [])
    .concat(resume.highlights ?? [])
    .filter((item): item is string => typeof item === "string");
  extras.forEach((item) => {
    contactParts.push(item);
  });

  return contactParts;
}

export function createResumePdf(resume: ResumeData): Buffer {
  const document = new SimplePdfDocument();

  const name = resume.basics?.name ?? (typeof resume.name === "string" ? resume.name : undefined);
  const title =
    resume.basics?.title ??
    resume.basics?.label ??
    resume.basics?.headline ??
    resume.headline ??
    resume.objective ??
    undefined;

  if (name) {
    document.addHeading(name, 24);
  }
  if (title) {
    document.addSubHeading(title, 14);
  }

  const contactParts = buildContactLine(resume);
  if (contactParts.length > 0) {
    document.addParagraph(contactParts.join("  •  "), { font: "F1", fontSize: 10, gapAfter: 12 });
  }

  const summary = buildSummary(resume);
  if (summary) {
    document.addHeading("Summary", 14);
    document.addParagraph(summary, { gapAfter: 12 });
  }

  const experiences = collectExperiences(resume).filter((experience) => experience.heading.trim().length > 0);
  if (experiences.length > 0) {
    document.addHeading("Experience", 14);
    experiences.forEach((experience) => {
      if (experience.heading) {
        document.addParagraph(experience.heading, {
          font: "F2",
          fontSize: 12,
          gapAfter: 2,
        });
      }
      if (experience.subHeading) {
        document.addParagraph(experience.subHeading, {
          font: "F3",
          fontSize: 10,
          gapAfter: 4,
        });
      }
      if (experience.summary) {
        document.addParagraph(experience.summary, { gapAfter: 4 });
      }
      if (experience.highlights.length > 0) {
        document.addBulletList(experience.highlights, { gapAfter: 8 });
      } else {
        document.addGap(6);
      }
    });
  }

  const projects = collectProjects(resume).filter((project) => project.heading.trim().length > 0);
  if (projects.length > 0) {
    document.addHeading("Projects", 14);
    projects.forEach((project) => {
      document.addParagraph(project.heading, { font: "F2", fontSize: 12, gapAfter: 2 });
      if (project.subHeading) {
        document.addParagraph(project.subHeading, { font: "F3", fontSize: 10, gapAfter: 4 });
      }
      if (project.highlights.length > 0) {
        document.addBulletList(project.highlights, { gapAfter: 6 });
      } else {
        document.addGap(4);
      }
    });
  }

  const education = collectEducation(resume).filter((entry) => entry.heading.trim().length > 0);
  if (education.length > 0) {
    document.addHeading("Education", 14);
    education.forEach((entry) => {
      document.addParagraph(entry.heading, { font: "F2", fontSize: 12, gapAfter: 2 });
      if (entry.subHeading) {
        document.addParagraph(entry.subHeading, { font: "F3", fontSize: 10, gapAfter: 4 });
      }
      if (entry.details.length > 0) {
        document.addBulletList(entry.details, { gapAfter: 6 });
      } else {
        document.addGap(4);
      }
    });
  }

  const skills = collectSkills(resume).filter((skill) => skill.value.trim().length > 0);
  if (skills.length > 0) {
    document.addHeading("Skills", 14);
    skills.forEach((skill) => {
      document.addLabelValue(`${skill.label}:`, skill.value, {
        fontSize: 11,
        gapAfter: 2,
      });
    });
    document.addGap(6);
  }

  const awards = collectAwards(resume).filter((award) => award.heading.trim().length > 0);
  if (awards.length > 0) {
    document.addHeading("Awards", 14);
    awards.forEach((award) => {
      document.addParagraph(award.heading, { font: "F2", fontSize: 12, gapAfter: 2 });
      if (award.detail) {
        document.addParagraph(award.detail, { fontSize: 10, gapAfter: 4 });
      }
    });
  }

  const certifications = collectCertifications(resume).filter((cert) => cert.heading.trim().length > 0);
  if (certifications.length > 0) {
    document.addHeading("Certifications", 14);
    certifications.forEach((cert) => {
      document.addParagraph(cert.heading, { font: "F2", fontSize: 12, gapAfter: 2 });
      if (cert.detail) {
        document.addParagraph(cert.detail, { fontSize: 10, gapAfter: 4 });
      }
    });
  }

  const pageContents = document.getPages();
  return buildPdfFromPages(pageContents, PAGE_WIDTH, PAGE_HEIGHT);
}
