import {
  getCompanyInfo,
  getSocialLinks,
  getNavLinks,
  getLegalLinks,
} from "@/lib/data";
import FooterClient from "./FooterClient";

/**
 * Server Component wrapper for Footer
 * Fetches data on server, passes to client for animations
 */
export default async function Footer() {
  const [companyInfo, socialLinks, navLinks, legalLinks] = await Promise.all([
    getCompanyInfo(),
    getSocialLinks(),
    getNavLinks(),
    getLegalLinks(),
  ]);

  return (
    <FooterClient
      companyInfo={companyInfo}
      socialLinks={socialLinks}
      navLinks={navLinks}
      legalLinks={legalLinks}
    />
  );
}
