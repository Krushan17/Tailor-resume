export interface ResumeProfile {
  network?: string;
  username?: string;
  url?: string;
}

export interface ResumeLocation {
  city?: string;
  region?: string;
  country?: string;
  address?: string;
  postalCode?: string;
}

export interface ResumeBasics {
  name?: string;
  title?: string;
  label?: string;
  headline?: string;
  email?: string;
  phone?: string;
  website?: string;
  summary?: string;
  profiles?: ResumeProfile[];
  location?: ResumeLocation;
}

export interface ResumeContact {
  email?: string;
  phone?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  location?: string;
  address?: string;
}

export interface ResumeExperience {
  company?: string;
  organization?: string;
  name?: string;
  role?: string;
  position?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  start?: string;
  end?: string;
  from?: string;
  to?: string;
  isCurrent?: boolean;
  location?: string;
  city?: string;
  region?: string;
  summary?: string;
  description?: string;
  highlights?: string[];
  bullets?: string[];
  achievements?: string[];
  technologies?: string[];
}

export interface ResumeEducation {
  institution?: string;
  school?: string;
  organization?: string;
  area?: string;
  degree?: string;
  studyType?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  start?: string;
  end?: string;
  from?: string;
  to?: string;
  score?: string;
  gpa?: string;
  summary?: string;
  courses?: string[];
  highlights?: string[];
}

export interface ResumeSkill {
  category?: string;
  name?: string;
  label?: string;
  type?: string;
  keywords?: string[];
  items?: string[];
  skills?: string[];
}

export interface ResumeProject {
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  highlights?: string[];
  keywords?: string[];
  tech?: string[];
  technologies?: string[];
  url?: string;
  link?: string;
}

export interface ResumeAward {
  title?: string;
  awarder?: string;
  date?: string;
  summary?: string;
}

export interface ResumeCertification {
  name?: string;
  issuer?: string;
  date?: string;
  summary?: string;
}

export interface ResumeData {
  basics?: ResumeBasics;
  contact?: ResumeContact;
  summary?: string | string[];
  objective?: string;
  headline?: string;
  overview?: string;
  profile?: string;
  description?: string;
  experiences?: ResumeExperience[];
  experience?: ResumeExperience[];
  work?: ResumeExperience[];
  professionalExperience?: ResumeExperience[];
  employmentHistory?: ResumeExperience[];
  roles?: ResumeExperience[];
  education?: ResumeEducation[];
  educationHistory?: ResumeEducation[];
  academics?: ResumeEducation[];
  studies?: ResumeEducation[];
  skills?: ResumeSkill[];
  skillCategories?: ResumeSkill[];
  competencies?: ResumeSkill[];
  projects?: ResumeProject[];
  initiatives?: ResumeProject[];
  achievements?: string[];
  awards?: ResumeAward[];
  honors?: ResumeAward[];
  certifications?: ResumeCertification[];
  strengths?: string[];
  extras?: string[];
  highlights?: string[];
  sections?: Record<string, unknown>;
  [key: string]: unknown;
}
