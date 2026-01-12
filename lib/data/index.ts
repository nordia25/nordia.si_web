/**
 * Data layer - centralized data exports
 */

export type {
  Project,
  TeamMember,
  CompanyInfo,
  SocialLink,
  NavLink,
  LegalLink,
} from "./types";

export { getProjects } from "./projects";
export { getTeamMembers } from "./team";
export { getCompanyInfo, getSocialLinks, getNavLinks, getLegalLinks } from "./company";
