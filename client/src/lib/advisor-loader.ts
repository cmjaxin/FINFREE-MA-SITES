import advisorsDataRaw from "@/data/advisors.json";

const advisorsData = advisorsDataRaw as {
  advisors: Record<string, any>;
  domainMappings: Record<string, string>;
};

export type Advisor = typeof advisorsData.advisors[keyof typeof advisorsData.advisors];

/**
 * Get advisor by slug - simple direct access
 */
export function getAdvisorBySlug(slug: string): Advisor {
  const advisor = advisorsData.advisors[slug];
  if (!advisor) {
    return advisorsData.advisors["drake-bloebaum"];
  }
  return advisor;
}

/**
 * Get current advisor - returns Drake by default
 * Domain routing is handled by Vercel environment variables
 */
export function getCurrentAdvisor(): Advisor {
  // Get advisor slug from environment variable or URL param
  const slugFromEnv = import.meta.env.VITE_ADVISOR_SLUG || "drake-bloebaum";
  return getAdvisorBySlug(slugFromEnv);
}
