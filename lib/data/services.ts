import type { Service } from "./types";

const services: readonly Service[] = [
  { name: "Spletne strani", color: "#2563eb" },
  { name: "AI avtomatizacije", color: "#a855f7" },
  { name: "3D tiskanje", color: "#06b6d4" },
];

/**
 * Get hero section services
 */
export async function getServices(): Promise<readonly Service[]> {
  return services;
}
