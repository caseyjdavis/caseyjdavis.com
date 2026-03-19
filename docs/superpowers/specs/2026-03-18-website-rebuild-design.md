# caseyjdavis.com — Website Rebuild Design Spec

**Date:** 2026-03-18
**Author:** Casey Davis
**Status:** Approved

---

## Goal

Rebuild caseyjdavis.com as a consulting-focused website that positions Casey as an Azure cloud infrastructure consultant serving small businesses in the Denver metro area. The primary objective is converting visitors into consulting leads via a contact form and direct call booking.

---

## Target Audience

**Primary:** Small businesses (1–50 employees) in the Denver metro area who need cloud infrastructure help but cannot afford a full-time IT hire.

**Secondary (future):** Mid-market companies (50–500 employees) undertaking cloud migrations or modernization projects.

---

## Approach

Full rebuild using a modern static site framework. The homepage serves as the primary consulting sales page. The blog is retained as a credibility and SEO asset but is secondary — accessible at `/blog`, not featured on the homepage.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro | Content-focused, fast, excellent SEO, native Markdown blog support, minimal JS output |
| Styling | Tailwind CSS | Full design control, consistent utility-first approach |
| Deployment | Cloudflare Pages | Fast global CDN, generous free tier, easy git-based deploys |
| Forms | Formspree | Serverless form handling without a backend; compatible with Cloudflare Pages (Netlify Forms requires Netlify's own CDN pipeline and will not work here) |
| Scheduling | Calendly embed | Direct call booking without custom infrastructure |

---

## Color Palette

| Role | Color | Hex |
|---|---|---|
| Background (primary) | Midnight | `#0f172a` |
| Background (secondary) | Dark Slate | `#1e293b` |
| Primary accent | Electric Blue | `#2563eb` |
| Call-to-action | Orange | `#f97316` |
| Text (primary) | White | `#ffffff` |
| Text (muted) | Slate | `#94a3b8` |
| Border | Dark Border | `#334155` |

*Note: The midnight + orange palette intentionally echoes Denver Broncos colors, providing a subtle local Denver connection.*

---

## Site Structure

```
/                    Homepage (consulting landing page)
/blog                Blog index
/blog/[slug]         Individual blog posts
/contact             Contact form + Calendly embed
/about               (optional, can be added in a future iteration)
```

---

## Homepage Sections

### 1. Navigation
- Logo: "Casey.Davis" with orange period accent
- Links:
  - "Services" — anchor link to the Services section (`#services`)
  - "Work" — anchor link to the Featured Case Study section (`#featured-work`)
  - "Blog" — links to `/blog`
- Primary CTA: "Book a Call" (orange button, right-aligned) — links to `/contact`
- Responsive: collapses to a slide-down drawer menu on mobile (no full-screen overlay)

### 2. Hero
- Badge: "☁️ Azure Cloud Consulting · Denver, CO"
- Headline: **"Stop Managing IT Headaches."** (bold, white, with "IT Headaches." in orange)
- Subheadline: "I help Denver small businesses move to the cloud — reducing costs, improving reliability, and eliminating the systems that slow you down."
- CTAs: "Book a Free 30-Min Call →" (orange, primary, links to `/contact`) + "See My Work" (ghost, secondary, anchor links to `#featured-work`)
- Visual: Professional headshot or abstract cloud/Azure-themed background image
- Background: Subtle gradient from midnight to dark slate

### 3. How It Works (Process)
- Section id: `how-it-works`
- Section label: "HOW IT WORKS" (orange, uppercase, letter-spaced)
- Three steps with orange top-border accent cards:
  - **01 — We Talk:** Free 30-minute call to understand your current setup and goals.
  - **02 — I Assess:** Deep audit of your infrastructure, costs, and risk areas.
  - **03 — We Build:** Migration, deployment, and ongoing support tailored to your business.

### 4. Featured Case Study — Brighton Fire Rescue
- Section id: `featured-work`
- Section label: "FEATURED WORK"
- Card with blue left-border accent
- Organization: Brighton Fire Rescue
- Details: 7 stations, 140 employees, public safety sector
- Description: Migrated multi-station fire rescue organization from legacy on-premise infrastructure to a fully cloud-based environment — improving reliability and access across all locations.
- Stats: 100% Cloud · 7 Stations · 140 Employees (displayed as large orange numbers)
- Tag: "Azure Migration"

### 5. Services
- Section id: `services`
- Section label: "SERVICES"
- Three cards:
  - **☁️ Cloud Migration** — Move your business to Azure — planned, tested, and stress-free.
  - **🔧 Managed Azure** — Ongoing monitoring, optimization, and support for your cloud environment.
  - **💼 SMB IT Support** — On-site and remote IT support for Denver-area small businesses.

### 6. Bottom CTA
- Headline: "Ready to simplify your IT?"
- Subtext: "Let's talk — no pressure, no jargon."
- CTA: "Book a Free 30-Min Call →" (orange button)

---

## Contact Page (`/contact`)

- Brief intro: "Let's talk about your infrastructure."
- **Contact form** fields: Name, Email, Company (optional), Message
  - On success: replace the form with an inline confirmation message ("Thanks! I'll be in touch within 1 business day.")
  - On error: display an inline error message below the submit button ("Something went wrong — please email me directly at [email].")
  - Submit button shows a loading state while the request is in flight
- **Calendly embed**: Direct 30-minute call booking
- Response time note: "I typically respond within 1 business day."

---

## Blog (`/blog`)

- Clean card grid or list layout
- Each post: title, date, estimated read time (computed at build time from word count, not a frontmatter field), short excerpt
- Individual posts use Markdown with frontmatter schema:
  - `title` (string, required)
  - `date` (ISO 8601 date string, required)
  - `description` (string, required — used as excerpt on the index and as meta description)
  - `tags` (array of strings, optional)
- Existing posts from current site migrated as Markdown files
- No comments system in initial build (can be added later)

---

## Images

- **Hero:** Professional headshot of Casey Davis
- **Section backgrounds:** Stock imagery from Unsplash (cloud/infrastructure/Denver themes)
- **Service icons:** Emoji or Heroicons SVG set
- **Case study:** No client images required; stats and text sufficient

---

## SEO Considerations

- Page title: "Casey Davis — Azure Cloud Consulting · Denver, CO"
- Meta description targeting Denver SMB cloud consulting keywords
- Structured data (LocalBusiness schema) for Denver geo-targeting
- Blog posts retain SEO value from existing content
- Sitemap auto-generated by Astro

---

## Out of Scope (Initial Build)

- Authentication or user accounts
- Client portal
- Pricing page (can be added later)
- About page (can be added later as a simple page)
- Comment system on blog
- Newsletter signup

---

## Success Criteria

1. A visitor can book a call or submit a contact form from the homepage without scrolling past two sections.
2. The Brighton Fire Rescue case study is reachable within one scroll from the hero on a standard 1080p desktop screen.
3. The site scores 90+ on Google Lighthouse (Performance, Accessibility, SEO).
4. Blog posts are editable via Markdown without touching component code.
5. The site is deployed and live on Cloudflare Pages connected to the caseyjdavis.com domain.
