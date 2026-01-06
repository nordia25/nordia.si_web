import MissionSectionClient from "./MissionSectionClient";

/**
 * Server Component wrapper for MissionSection
 * Static content - no data fetching needed
 * Client component handles animations and interactions
 */
export default function MissionSection() {
  return <MissionSectionClient />;
}
