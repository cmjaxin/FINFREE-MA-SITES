import advisorsData from "@/data/advisors.json";

export type Advisor = (typeof advisorsData.advisors)[keyof typeof advisorsData.advisors];

/**
 * Get the advisor slug from the current hostname
 * Maps domain names to advisor keys via domainMappings
 */
export function getAdvisorSlug(): string {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  // Remove www. prefix if present
  const normalizedHost = hostname.replace(/^www\./, "");

  const mappings = advisorsData.domainMappings as Record<string, string>;

  // Try exact match first
  if (mappings[normalizedHost]) {
    return mappings[normalizedHost];
  }

  // Fallback to first advisor (Drake) for development
  return "drake-bloebaum";
}

/**
 * Get advisor config for current domain
 */
export function getCurrentAdvisor(): Advisor {
  const slug = getAdvisorSlug();
  const advisor = advisorsData.advisors[slug as keyof typeof advisorsData.advisors];

  if (!advisor) {
    console.error(`Advisor not found for slug: ${slug}`);
    // Return Drake as fallback
    return advisorsData.advisors["drake-bloebaum"];
  }

  return advisor;
}

/**
 * Get advisor by slug
 */
export function getAdvisorBySlug(slug: string): Advisor | null {
  return advisorsData.advisors[slug as keyof typeof advisorsData.advisors] || null;
}
