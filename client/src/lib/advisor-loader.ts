import advisorsDataRaw from "@/data/advisors.json";

const advisorsData = advisorsDataRaw as {
  advisors: Record<string, any>;
  domainMappings: Record<string, string>;
};

export type Advisor = {
  name: string;
  firstName: string;
  title: string;
  company: string;
  nmls: string;
  yearsExperience: string;
  phone: string;
  phoneTel: string;
  email: string;
  address: string;
  city: string;
  state: string;
  stateAbbr: string;
  applyUrl: string;
  calendarUrl: string;
  headshot: string;
  heroBgImage: string;
  heroTestimonialImage: string;
  heroTestimonialAlt: string;
  logoUrl: string;
  reviewsApiKey: string;
  reviewsWidgetKey: string;
  bnTouchUserId: string;
  bnTouchWebFormId: string;
  bnTouchSource: string;
  heroHeadline: string[];
  heroSubhead: string;
  heroBio: string;
  trustBarHeading: string;
  trustBarItems: string[];
  trustBarFootnote: string;
  reviewsSectionHeading: string;
  reviewsSectionSubhead: string;
  aboutBio: string[];
  aboutTags: string[];
  aboutWhyChoose: string[];
  footerDescription: string;
  specialties: string[];
  testimonials: Array<{
    quote: string;
    author: string;
    location: string;
  }>;
};

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
