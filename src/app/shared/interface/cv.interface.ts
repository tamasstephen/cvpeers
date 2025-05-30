export interface PersonalDetails {
  fullName: string;
  email?: string;
  phone?: string;
  website?: string;
  headline: string;
  linkedin?: string;
}

export interface SocialLink {
  type: string;
  url: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface Language {
  name: string;
  level: string;
}
