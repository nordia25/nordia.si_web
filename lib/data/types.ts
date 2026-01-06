/**
 * Shared type definitions for server-side data
 */

export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  number: string;
  color: string;
  backColor: string;
  accentColor: string;
  oneLiner: string;
  bullets: string[];
  description: string;
  closingText: string;
}

export interface TeamMember {
  name: string;
  role: string;
  subRole: string;
  image: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface CompanyInfo {
  city: string;
  timezone: string;
  coords: string;
  address: string;
  country: string;
  vatId: string;
  regNumber: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface Service {
  name: string;
  color: string;
}

export interface SocialPlatform {
  name: string;
  initial: string;
}
