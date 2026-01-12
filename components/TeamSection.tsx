import { getTeamMembers } from "@/lib/data";
import TeamSectionClient from "./TeamSectionClient";

/**
 * Server Component wrapper for TeamSection
 * Fetches data on server, passes to client for animations
 */
export default async function TeamSection() {
  const teamMembers = await getTeamMembers();

  return <TeamSectionClient teamMembers={teamMembers} />;
}
