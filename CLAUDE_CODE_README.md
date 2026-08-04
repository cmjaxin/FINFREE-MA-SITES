# NEO Home Loans — Mortgage Advisor Homepage Template
## Claude Code Guide: Generating Custom Sites from a Spreadsheet

---

## Overview

This is a production-ready React homepage template built for NEO Home Loans mortgage advisors. It uses the **Donald Miller StoryBrand framework** — the customer is the hero, the advisor is the guide — while simultaneously being structured for **SEO, GEO, and LLM discoverability** (the advisor's name, NMLS, location, and credentials are embedded in schema markup, headings, and body copy).

The template is designed so that **all advisor-specific data lives in a single `ADVISOR_CONFIG` object** at the top of `client/src/pages/Home.tsx`. To generate a new advisor site, you only need to update that one object.

---

## How to Generate a New Advisor Site from a Spreadsheet

### Step 1 — Understand the spreadsheet columns

Your spreadsheet should have one row per advisor with these columns:

| Column | Description | Example |
|---|---|---|
| `name` | Full legal name | Jane Smith |
| `firstName` | First name only (used in copy) | Jane |
| `title` | Job title | Mortgage Advisor |
| `company` | Company name | NEO Home Loans |
| `nmls` | NMLS number (digits only) | 123456 |
| `yearsExperience` | Years in the industry | 12+ |
| `phone` | Formatted phone | (555) 123-4567 |
| `phoneTel` | Digits only for tel: links | 5551234567 |
| `email` | Email address | jane@neohomeloans.com |
| `address` | Full office address | 123 Main St, Denver, CO 80202 |
| `city` | City | Denver |
| `state` | Full state name | Colorado |
| `stateAbbr` | State abbreviation | CO |
| `applyUrl` | NEO apply link for this advisor | https://neohomeloans.com/start/r/XXXXX |
| `calendarUrl` | YouCanBook.me or Calendly URL | https://calendly.com/jane-smith |
| `headshot` | URL to advisor headshot image | https://... |
| `heroBgImage` | URL to hero background photo | https://... |
| `heroTestimonialImage` | URL to a client testimonial photo | https://... |
| `heroTestimonialAlt` | Alt text for testimonial image | Smith Family testimonial |
| `reviewsApiKey` | experience.com widget API key | P4Qz... |
| `reviewsWidgetKey` | experience.com widget key | -l-H... |
| `bnTouchUserId` | BNTouch USERID | 10694 |
| `bnTouchWebFormId` | BNTouch WEBFORMID | 5361 |
| `bnTouchSource` | BNTouch added_source label | Jane Website |
| `trustBarHeading` | Trust bar headline | Helping Homebuyers Across Colorado |
| `trustBarFootnote` | States/regions served | Serving clients throughout Colorado... |
| `aboutBio_1` | First bio paragraph (bold, empathy-first) | A mortgage is more than... |
| `aboutBio_2` | Second bio paragraph | For over 12 years, Jane has... |
| `aboutBio_3` | Third bio paragraph (personal details) | Born and raised in Denver... |
| `footerDescription` | Footer one-liner about the advisor | Mortgage Advisor serving Denver... |
| `specialties` | Comma-separated specialties | First-Time Buyers, VA Loans, Jumbo |
| `heroHeadline_1` | First line of hero headline | Buying a Home Shouldn't Feel |
| `heroHeadline_2` | Second line (teal accent) | Confusing or Overwhelming |
| `heroSubhead` | Hero subheadline paragraph | Whether you're buying... |
| `heroBio` | Short bio shown in hero | For more than 12 years, Jane... |

---

### Step 2 — For each advisor row, update ADVISOR_CONFIG

Open `client/src/pages/Home.tsx`. The `ADVISOR_CONFIG` object starts at line ~22 and ends at the comment `// END ADVISOR CONFIG`. Replace every value in that object with the advisor's data from the spreadsheet.

**The rest of the file does not need to change.** All JSX references use `a.fieldName` (where `a = ADVISOR_CONFIG`), so the entire page updates automatically.

---

### Step 3 — Update the HTML head for SEO

Open `client/index.html`. Update these values per advisor:

```html
<!-- Page title -->
<title>Drake Bloebaum | Mortgage Advisor | Salt Lake City, UT | NEO Home Loans</title>

<!-- Meta description -->
<meta name="description" content="Drake Bloebaum is a mortgage advisor with NEO Home Loans in Salt Lake City, UT. NMLS #225567. Specializing in home purchase, refinance, and medical professional loans." />

<!-- Canonical URL -->
<link rel="canonical" href="https://YOUR-ADVISOR-DOMAIN.com/" />

<!-- Schema.org JSON-LD (update all fields) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Drake Bloebaum",
  "jobTitle": "Mortgage Advisor",
  "worksFor": { "@type": "Organization", "name": "NEO Home Loans" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2063 E 3900 S",
    "addressLocality": "Salt Lake City",
    "addressRegion": "UT",
    "postalCode": "84124"
  },
  "telephone": "+18016331167",
  "email": "drakeb@neohomeloans.com",
  "url": "https://YOUR-ADVISOR-DOMAIN.com/",
  "identifier": { "@type": "PropertyValue", "name": "NMLS", "value": "225567" },
  "knowsAbout": ["Mortgage Loans", "Home Purchase", "Refinancing", "Medical Professional Loans", "VA Loans", "FHA Loans", "Jumbo Loans"]
}
</script>
```

---

### Step 4 — Deploy to Vercel

Each advisor gets their own Vercel deployment. This is a standard Vite + React static site.

**One-time setup (first advisor):**
```bash
npm install -g vercel
vercel login
```

**Per advisor deployment:**
```bash
# 1. Install dependencies (only needed once per machine)
pnpm install

# 2. Build the site
pnpm build

# 3. Deploy to Vercel
vercel --prod

# When prompted:
# - Project name: neo-[advisor-slug] (e.g., neo-drake-bloebaum)
# - Framework: Vite
# - Build command: pnpm build
# - Output directory: dist
```

**Or use Vercel's GitHub integration:**
1. Push each advisor's version to a separate GitHub repo (e.g., `neo-drake-bloebaum`)
2. Connect each repo to Vercel
3. Vercel auto-deploys on every push

---

### Step 5 — Custom domain

In Vercel dashboard → Project → Settings → Domains, add the advisor's custom domain (e.g., `buildwealthwithdrake.com`). Vercel handles SSL automatically.

---

## What Changes Per Advisor vs. What Stays the Same

### Changes per advisor (ADVISOR_CONFIG only)
- Name, title, NMLS, years of experience
- Phone, email, address, city, state
- Apply URL, calendar URL
- Headshot image URL
- Hero background image URL
- Hero testimonial image (a real client photo/card)
- experience.com reviews widget keys
- BNTouch USERID, WEBFORMID, and source label
- Bio paragraphs (3 paragraphs: empathy → credentials → personal)
- Trust bar heading and footnote (states served)
- "Why clients choose [name]" bullet points
- About tags (location, years, NMLS, specialties)
- Footer description

### Stays the same across all advisors (brand-level content)
- NEO logo
- StoryBrand narrative structure (Problem → Guide → Process → Experience → CTA)
- The Problem section (3 cards)
- Three Simple Steps process
- NEO Experience section (5 pillars + 6 service cards)
- Medical Professionals section (program highlights + eligible designations)
- Who We Help section (8 categories)
- BNTouch form structure
- Full Better/NEO legal disclaimer
- All design tokens (navy, teal, fonts, spacing)

---

## Advisor-Specific Copy Guidelines for Claude

When writing bio paragraphs for a new advisor, follow this structure:

**Paragraph 1 (empathy-first, bold):** Start with what the client feels or needs, not what the advisor does. Example: *"A mortgage is more than paperwork and interest rates — it's a financial decision that can shape your future."*

**Paragraph 2 (credentials, human):** Years of experience + what they actually do for clients. Avoid listing certifications. Example: *"For over 12 years, Jane has helped families navigate the mortgage process with honest advice, clear communication, and personalized financing strategies."*

**Paragraph 3 (personal):** Where they're from, local market knowledge, personal life details (family, hobbies). This is what makes the advisor a real person, not a resume. Example: *"Born and raised in Denver, Jane understands the Colorado market while helping clients across the region. When she's not helping clients, you'll find her hiking with her two kids or volunteering with Habitat for Humanity."*

**Hero bio (one sentence):** A short version of paragraph 2 for the hero section. Example: *"For more than 12 years, Jane Smith has helped individuals and families throughout Colorado make smart mortgage decisions that support their long-term financial goals."*

---

## Hero Testimonial Image

The hero section shows a real client testimonial photo (like the Norton Family card) on the right side of the hero. This is one of the highest-trust elements on the page.

For each advisor, use a real client photo with a quote overlay. If you don't have one yet, use a placeholder and update it later. The image should be approximately 460px wide and hosted at a public URL.

---

## Reviews Widget

Each advisor needs their own experience.com widget embed code. The two values to update are:
- `reviewsApiKey` — the `ss-custom-reviews-widget-api-key` attribute value
- `reviewsWidgetKey` — the `widget-key` attribute value

These come from the advisor's experience.com account under their widget embed snippet.

---

## File Structure Reference

```
neo-loan-officer-homepage/
├── client/
│   ├── index.html              ← Update title, meta description, canonical, schema JSON-LD
│   └── src/
│       └── pages/
│           └── Home.tsx        ← Update ADVISOR_CONFIG object only (lines ~22–100)
├── package.json
├── vite.config.ts
└── CLAUDE_CODE_README.md       ← This file
```

---

## Quick Checklist for Each New Advisor

- [ ] Update `ADVISOR_CONFIG` in `client/src/pages/Home.tsx`
- [ ] Update `<title>`, `<meta name="description">`, `<link rel="canonical">` in `client/index.html`
- [ ] Update Schema.org JSON-LD in `client/index.html`
- [ ] Confirm headshot URL is publicly accessible
- [ ] Confirm hero background image URL is publicly accessible
- [ ] Add real client testimonial image to `heroTestimonialImage`
- [ ] Confirm experience.com widget keys are correct
- [ ] Confirm BNTouch USERID and WEBFORMID are correct
- [ ] Confirm calendar URL is live and bookable
- [ ] Run `pnpm build` — confirm no errors
- [ ] Deploy to Vercel with advisor-specific project name
- [ ] Add custom domain in Vercel dashboard
- [ ] Test form submission (check BNTouch for the lead)
- [ ] Test calendar booking
- [ ] Verify reviews widget loads on live domain
