import { getProjects } from "@/lib/data";
import WorksSectionClient from "./WorksSectionClient";

/**
 * Server Component wrapper for WorksSection
 * Fetches projects data on server, passes to client for animations
 */
export default async function WorksSection() {
  const projects = await getProjects();

  return <WorksSectionClient projects={projects} />;
}
