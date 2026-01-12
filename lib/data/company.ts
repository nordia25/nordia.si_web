import type { CompanyInfo, SocialLink, NavLink, LegalLink } from "./types";

/** Company contact and registration information */
export const COMPANY_INFO: CompanyInfo = {
  city: "Nova Vas",
  timezone: "Europe/Ljubljana",
  coords: "45.8150° N, 14.5144° E",
  address: "Runarsko 1A, 1385 Nova Vas",
  country: "Slovenija",
  vatId: "SI96391766",
  regNumber: "7392508000",
} as const;

/** Social media profile links */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/company/nordia" },
  { label: "Instagram", href: "https://instagram.com/nordia.si" },
  { label: "GitHub", href: "https://github.com/nordia" },
] as const;

/** Main navigation links */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Filozofija", href: "#why" },
  { label: "Storitve", href: "#works" },
  { label: "O nas", href: "#about" },
] as const;

/** Footer legal links */
export const LEGAL_LINKS: readonly LegalLink[] = [
  { label: "Zasebnost", href: "/zasebnost" },
] as const;

/**
 * Get company information
 * Async wrapper for future CMS/API integration
 */
export async function getCompanyInfo(): Promise<CompanyInfo> {
  return COMPANY_INFO;
}

/**
 * Get social media links
 * Async wrapper for future CMS/API integration
 */
export async function getSocialLinks(): Promise<readonly SocialLink[]> {
  return SOCIAL_LINKS;
}

/**
 * Get navigation links
 * Async wrapper for future CMS/API integration
 */
export async function getNavLinks(): Promise<readonly NavLink[]> {
  return NAV_LINKS;
}

/**
 * Get legal/footer links
 * Async wrapper for future CMS/API integration
 */
export async function getLegalLinks(): Promise<readonly LegalLink[]> {
  return LEGAL_LINKS;
}
