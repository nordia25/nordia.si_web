/**
 * Data layer - centralized data exports
 * Prepared for future CMS/database integration
 */

// Types
export type {
  Project,
  TeamMember,
  CompanyInfo,
  SocialLink,
  NavLink,
  LegalLink,
  Service,
  SocialPlatform,
} from "./types";

// Data fetchers
export { getProjects } from "./projects";
export { getTeamMembers, getSocialPlatforms } from "./team";
export { getCompanyInfo, getSocialLinks, getNavLinks, getLegalLinks } from "./company";
export { getServices } from "./services";
