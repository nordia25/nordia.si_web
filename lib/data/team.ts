import type { TeamMember } from "./types";

const TEAM_MEMBERS: readonly TeamMember[] = [
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
];

/**
 * Get all team members
 */
export async function getTeamMembers(): Promise<readonly TeamMember[]> {
  return TEAM_MEMBERS;
}
