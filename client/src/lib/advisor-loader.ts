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
 * Get current advisor based on hostname
 */
export function getCurrentAdvisor(): Advisor {
  // Only run on client side
  if (typeof window === "undefined") {
    return advisorsData.advisors["drake-bloebaum"];
  }

  const hostname = window.location.hostname;
  const normalizedHost = hostname.replace(/^www\./, "");

  // Check domain mappings
  const mappings = advisorsData.domainMappings as Record<string, string>;
  if (mappings[normalizedHost]) {
    const slug = mappings[normalizedHost];
    return getAdvisorBySlug(slug);
  }

  // Default to Drake
  return advisorsData.advisors["drake-bloebaum"];
}
