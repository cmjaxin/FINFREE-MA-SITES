# NEO Advisor Network Setup Guide

## Overview

This is a **multi-advisor mortgage homepage template** that runs **8 separate advisor sites from 1 GitHub repo and 1 Vercel project**.

- **1 codebase** = 8 fully customized advisor websites
- **Host-based routing** = each domain automatically loads the correct advisor data
- **8 custom domains** = each advisor gets their own URL
- **Single deployment** = update code once, all sites update instantly

## Architecture

```
GitHub Repo (FINFREE-MA-SITES)
    ↓
    client/src/data/advisors.json ← All 8 advisors' data + testimonials
    ↓
Vercel Project (single)
    ↓
Domain 1 → advisor-1
Domain 2 → advisor-2
Domain 3 → advisor-3
... etc
```

When someone visits `mikejones.neohomeloans.com`:
1. Request hits Vercel project
2. App detects hostname
3. Looks up advisor slug in `domainMappings`
4. Loads that advisor's data from `advisors.json`
5. Renders page with their specific content

## Setup Steps

### 1. Clone & Install

```bash
git clone https://github.com/cmjaxin/FINFREE-MA-SITES.git
cd FINFREE-MA-SITES
pnpm install
```

### 2. Add Your Custom Domains

Update the domain mappings in `client/src/data/advisors.json`:

```json
"domainMappings": {
  "your-michael-domain.com": "michael-jones",
  "your-david-domain.com": "david-nelson",
  "your-skyler-domain.com": "skyler-ford",
  // ... etc
}
```

### 3. Test Locally

```bash
pnpm dev
```

Visit `http://localhost:3000` - you'll see Drake's site (the fallback).

To test a specific advisor's domain locally, add to your `/etc/hosts`:
```
127.0.0.1 your-michael-domain.local
```

Then visit `http://your-michael-domain.local:3000`

### 4. Deploy to Vercel

```bash
pnpm build
vercel --prod
```

### 5. Add Custom Domains in Vercel

1. Go to Vercel project → **Settings → Domains**
2. Add each advisor's custom domain
3. Point each domain's DNS to Vercel

Example DNS setup (varies by registrar):
```
CNAME: your-domain.com → cname.vercel.app
```

## Advisor Data Structure

Each advisor in `advisors.json` has:

```json
{
  "name": "Michael Jones",
  "nmls": "33323",
  "email": "mike.jones@neohomeloans.com",
  "phone": "(801) 403-3190",
  "headshot": "https://...",
  "heroHeadline": ["...", "..."],
  "specialties": ["...", "..."],
  "aboutBio": ["paragraph 1", "paragraph 2", "paragraph 3"],
  "testimonials": [
    {
      "quote": "...",
      "author": "...",
      "location": "..."
    },
    // ... 3 testimonials per advisor
  ]
}
```

## Adding/Updating Advisors

1. Edit `client/src/data/advisors.json`
2. Add advisor to `advisors` object
3. Add domain mapping to `domainMappings`
4. Commit and push
5. Vercel auto-deploys

## SEO Setup

Each domain needs its own SEO metadata. The app currently uses generic meta tags in `client/index.html`. 

**TODO:** Add dynamic meta tag injection per advisor in `Home.tsx`:
- Unique page title with advisor name + city
- Unique meta description with NMLS + specialties
- Unique schema.org JSON-LD with advisor details

See `CLAUDE_CODE_README.md` for the original template's SEO structure.

## Testimonials

Instead of the experience.com reviews widget (which Jason Drobeck uses), we're showing formatted client testimonials directly on the page.

3 testimonials per advisor, displayed in a 3-column grid below the hero section.

To update testimonials, edit the `testimonials` array in each advisor's record in `advisors.json`.

## File Structure

```
FINFREE-MA-SITES/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx           ← Main page (loads dynamic advisor data)
│   │   ├── components/
│   │   │   └── Testimonials.tsx   ← Testimonials card grid
│   │   ├── lib/
│   │   │   └── advisor-loader.ts  ← Advisor data loading logic
│   │   └── data/
│   │       └── advisors.json      ← ALL 8 advisors' data + mappings
│   └── index.html
├── vercel.json                     ← Vercel build config
├── package.json
└── SETUP.md                        ← This file
```

## Troubleshooting

**Domain not loading correct advisor:**
- Check domain mapping in `advisors.json`
- Verify DNS is pointing to Vercel
- Check browser dev tools → Network → see if correct advisor slug is in data

**Reviews widget not showing:**
- Jason Drobeck's site uses the experience.com widget
- Other advisors show formatted testimonials below hero
- If widget keys are added, uncomment the widget injection code

**Build errors:**
```bash
pnpm install --force
pnpm build
```

## Next Steps

- [ ] Set up 8 custom domains (register or add to existing registrar)
- [ ] Add domain mappings to `advisors.json`
- [ ] Deploy to Vercel
- [ ] Add domains to Vercel project
- [ ] Configure DNS for each domain
- [ ] Test each advisor's site
- [ ] Add dynamic meta tags per advisor (currently generic)
- [ ] Add hero testimonial images to each advisor's record
- [ ] Set up calendar booking links for each advisor

## Questions?

See the original template guide: `CLAUDE_CODE_README.md`
