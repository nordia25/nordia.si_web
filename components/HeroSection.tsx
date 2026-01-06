import { getServices } from "@/lib/data";
import HeroSectionClient from "./HeroSectionClient";

/**
 * Server Component wrapper for HeroSection
 * Fetches services data on server, passes to client for animations
 */
export default async function HeroSection() {
  const services = await getServices();

  return <HeroSectionClient services={services} />;
}
