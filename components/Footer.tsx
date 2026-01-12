import { getSocialLinks, getLegalLinks } from "@/lib/data";
import FooterClient from "./FooterClient";

/**
 * Server Component wrapper for Footer
 * Fetches data on server, passes to client for animations
 */
export default async function Footer() {
  const [socialLinks, legalLinks] = await Promise.all([
    getSocialLinks(),
    getLegalLinks(),
  ]);

  return <FooterClient socialLinks={socialLinks} legalLinks={legalLinks} />;
}
