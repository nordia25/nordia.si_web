import type { TeamMember } from "./types";

/** Team member profiles */
export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    name: "Nikolaj Taras Fras",
    role: "CEO - Komercialni direktor",
    subRole: "Frontend developer",
    image: "/team/taras.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/taras-fras",
      twitter: "https://twitter.com/tarasfras",
    },
  },
  {
    name: "Izak Ivančič",
    role: "CTO - Tehnični direktor",
    subRole: "Backend developer",
    image: "/team/izak.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/izak-ivancic",
      twitter: "https://twitter.com/izakivancic",
    },
  },
] as const;

/**
 * Get all team members
 * Async wrapper for future CMS/database integration
 */
export async function getTeamMembers(): Promise<readonly TeamMember[]> {
  return TEAM_MEMBERS;
}
