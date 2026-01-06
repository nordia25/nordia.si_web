import type { CompanyInfo, SocialLink, NavLink, LegalLink } from "./types";

const companyInfo: CompanyInfo = {
  city: "Nova Vas",
  timezone: "Europe/Ljubljana",
  coords: "45.8150° N, 14.5144° E",
  address: "Runarsko 1A, 1385 Nova Vas",
  country: "Slovenija",
  vatId: "SI96391766",
  regNumber: "7392508000",
};

const socialLinks: readonly SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/company/nordia" },
  { label: "Instagram", href: "https://instagram.com/nordia.si" },
  { label: "GitHub", href: "https://github.com/nordia" },
];

const navLinks: readonly NavLink[] = [
  { label: "Filozofija", href: "#why" },
  { label: "Storitve", href: "#works" },
  { label: "O nas", href: "#about" },
];

const legalLinks: readonly LegalLink[] = [
  { label: "Zasebnost", href: "/zasebnost" },
];

/**
 * Get company information
 */
export async function getCompanyInfo(): Promise<CompanyInfo> {
  return companyInfo;
}

/**
 * Get social media links
 */
export async function getSocialLinks(): Promise<readonly SocialLink[]> {
  return socialLinks;
}

/**
 * Get navigation links
 */
export async function getNavLinks(): Promise<readonly NavLink[]> {
  return navLinks;
}

/**
 * Get legal/footer links
 */
export async function getLegalLinks(): Promise<readonly LegalLink[]> {
  return legalLinks;
}
