# caseyjdavis.com Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a greenfield Astro + Tailwind consulting website for Casey Davis, an Azure cloud consultant in Denver, replacing the existing GitHub Pages site with a Cloudflare Pages deployment.

**Architecture:** Astro static site with Tailwind CSS for styling. Content (blog posts) lives in Astro content collections as Markdown files. The homepage is a consulting landing page; the blog is secondary at `/blog`. Contact form posts to Formspree; call booking uses a Calendly embed.

**Tech Stack:** Astro 4.x, Tailwind CSS 3.x, Playwright (E2E tests), Formspree (contact form), Cloudflare Pages (deployment)

---

## File Map

```
caseyjdavis.com/
├── astro.config.mjs              # Astro config: integrations, site URL
├── tailwind.config.mjs           # Color tokens, font config
├── tsconfig.json                 # TypeScript config (Astro default)
├── package.json
├── .gitignore
├── playwright.config.ts          # Playwright E2E config
│
├── public/
│   ├── favicon.svg
│   └── headshot.jpg              # Casey's professional photo (placeholder initially)
│
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML shell, <head>, SEO meta tags, LocalBusiness schema
│   │   └── BlogLayout.astro      # Wraps BaseLayout; adds blog post typography styles
│   │
│   ├── components/
│   │   ├── Nav.astro             # Top nav; mobile slide-down drawer
│   │   ├── Hero.astro            # Badge, headline, subheadline, dual CTAs
│   │   ├── HowItWorks.astro      # 3-step process cards (01/02/03)
│   │   ├── CaseStudy.astro       # Brighton Fire Rescue card with stats
│   │   ├── Services.astro        # 3 service cards
│   │   ├── BottomCTA.astro       # "Ready to simplify your IT?" + CTA button
│   │   ├── Footer.astro          # Links, copyright
│   │   └── ContactForm.astro     # Formspree form with success/error/loading states
│   │
│   ├── pages/
│   │   ├── index.astro           # Homepage: assembles all homepage components
│   │   ├── contact.astro         # Contact page: ContactForm + Calendly embed
│   │   └── blog/
│   │       ├── index.astro       # Blog listing: card grid with title, date, read time, excerpt
│   │       └── [...slug].astro   # Individual blog post page
│   │
│   ├── content/
│   │   ├── config.ts             # Content collection schema for blog posts
│   │   └── blog/                 # Markdown blog posts (migrated from existing site)
│   │       └── example-post.md
│   │
│   └── styles/
│       └── global.css            # Tailwind directives + any base overrides
│
└── tests/
    └── e2e/
        ├── homepage.spec.ts      # Homepage sections visible, CTAs link correctly
        ├── contact.spec.ts       # Form submits, shows success/error states
        └── blog.spec.ts          # Blog index renders, post page renders
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `.gitignore`, `playwright.config.ts`, `src/styles/global.css`

- [ ] **Step 1: Initialize Astro project**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git --no-install
```

Expected: Astro project files created in current directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D @astrojs/tailwind tailwindcss @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Add Tailwind integration to astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.caseyjdavis.com',
  integrations: [tailwind()],
});
```

- [ ] **Step 4: Configure Tailwind color tokens**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        slate: {
          dark: '#1e293b',
          border: '#334155',
          muted: '#94a3b8',
        },
        brand: {
          blue: '#2563eb',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Add Tailwind directives to global.css**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-midnight text-white;
  }
}
```

- [ ] **Step 6: Add placeholder headshot**

```bash
curl -o public/headshot.jpg "https://placehold.co/400x400/1e293b/94a3b8?text=Photo"
```

- [ ] **Step 7: Configure .gitignore**

```
# .gitignore
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
.DS_Store
.superpowers/
```

- [ ] **Step 8: Configure Playwright**

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

- [ ] **Step 9: Verify build works**

```bash
npm run build
```

Expected: `dist/` directory created, no errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro + Tailwind project"
```

---

## Task 2: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('page has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Casey Davis/);
});

test('page has viewport meta tag', async ({ page }) => {
  await page.goto('/');
  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveAttribute('content', /width=device-width/);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL — no page to load yet.

- [ ] **Step 3: Create BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'Casey Davis — Azure Cloud Consulting · Denver, CO',
  description = 'Azure cloud consulting for Denver small businesses. Cloud migration, managed Azure, and IT support from Casey Davis.',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- LocalBusiness structured data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Casey Davis Consulting",
        "description": "Azure cloud consulting for Denver small businesses",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Denver",
          "addressRegion": "CO",
          "addressCountry": "US"
        },
        "url": "https://www.caseyjdavis.com",
        "areaServed": "Denver Metropolitan Area"
      }
    </script>
  </head>
  <body class="bg-midnight text-white font-sans">
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Create minimal index.astro to load the layout**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <p>Hello</p>
</BaseLayout>
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add BaseLayout with SEO meta and LocalBusiness schema"
```

---

## Task 3: Navigation Component

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// Add to tests/e2e/homepage.spec.ts

test('nav has logo and book a call CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('nav a[href="/contact"]').filter({ hasText: 'Book a Call' })).toBeVisible();
});

test('nav links point to correct anchors', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav a[href="#services"]')).toBeVisible();
  await expect(page.locator('nav a[href="#featured-work"]')).toBeVisible();
  await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
});

test('mobile nav drawer opens on hamburger click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const drawer = page.locator('[data-mobile-menu]');
  await expect(drawer).toBeHidden();
  await page.locator('[data-hamburger]').click();
  await expect(drawer).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create Nav component**

```astro
---
// src/components/Nav.astro
---

<nav class="flex items-center justify-between px-6 py-4 border-b border-slate-border">
  <a href="/" class="font-bold text-white text-sm">
    Casey<span class="text-brand-orange">.</span>Davis
  </a>

  <!-- Desktop links -->
  <div class="hidden md:flex items-center gap-6 text-sm text-slate-muted">
    <a href="#services" class="hover:text-white transition-colors">Services</a>
    <a href="#featured-work" class="hover:text-white transition-colors">Work</a>
    <a href="/blog" class="hover:text-white transition-colors">Blog</a>
    <a
      href="/contact"
      class="bg-brand-orange text-white px-4 py-2 rounded font-bold hover:bg-orange-500 transition-colors"
    >
      Book a Call
    </a>
  </div>

  <!-- Mobile hamburger -->
  <button
    data-hamburger
    class="md:hidden text-slate-muted hover:text-white"
    aria-label="Open menu"
    onclick="document.querySelector('[data-mobile-menu]').classList.toggle('hidden')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</nav>

<!-- Mobile drawer -->
<div data-mobile-menu class="hidden md:hidden bg-slate-dark border-b border-slate-border px-6 py-4 flex flex-col gap-4 text-sm">
  <a href="#services" class="text-slate-muted hover:text-white transition-colors">Services</a>
  <a href="#featured-work" class="text-slate-muted hover:text-white transition-colors">Work</a>
  <a href="/blog" class="text-slate-muted hover:text-white transition-colors">Blog</a>
  <a href="/contact" class="bg-brand-orange text-white px-4 py-2 rounded font-bold text-center">Book a Call</a>
</div>
```

- [ ] **Step 4: Add Nav to index.astro**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
---

<BaseLayout>
  <Nav />
</BaseLayout>
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add Nav component with mobile drawer"
```

---

## Task 4: Hero Section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// Add to tests/e2e/homepage.spec.ts

test('hero has headline and dual CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Stop Managing');
  await expect(page.locator('a[href="/contact"]').filter({ hasText: 'Book a Free' })).toBeVisible();
  await expect(page.locator('a[href="#featured-work"]').filter({ hasText: 'See My Work' })).toBeVisible();
});

test('hero has Denver badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Denver, CO')).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create Hero component**

```astro
---
// src/components/Hero.astro
---

<section class="px-6 py-16 md:py-24 text-center bg-gradient-to-b from-midnight to-slate-dark">
  <div class="max-w-2xl mx-auto">
    <span class="inline-block bg-blue-950 text-blue-400 text-xs px-4 py-1 rounded-full mb-6 border border-brand-blue">
      ☁️ Azure Cloud Consulting · Denver, CO
    </span>

    <h1 class="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
      Stop Managing<br />
      <span class="text-brand-orange">IT Headaches.</span>
    </h1>

    <p class="text-slate-muted text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
      I help Denver small businesses move to the cloud — reducing costs, improving
      reliability, and eliminating the systems that slow you down.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/contact"
        class="bg-brand-orange text-white px-6 py-3 rounded font-bold hover:bg-orange-500 transition-colors"
      >
        Book a Free 30-Min Call →
      </a>
      <a
        href="#featured-work"
        class="border border-slate-border text-slate-muted px-6 py-3 rounded hover:text-white hover:border-slate-muted transition-colors"
      >
        See My Work
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add Hero to index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---

<BaseLayout>
  <Nav />
  <Hero />
</BaseLayout>
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add Hero section"
```

---

## Task 5: How It Works Section

**Files:**
- Create: `src/components/HowItWorks.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// Add to tests/e2e/homepage.spec.ts

test('how it works shows 3 steps', async ({ page }) => {
  await page.goto('/');
  const steps = page.locator('[data-step]');
  await expect(steps).toHaveCount(3);
  await expect(steps.nth(0)).toContainText('We Talk');
  await expect(steps.nth(1)).toContainText('I Assess');
  await expect(steps.nth(2)).toContainText('We Build');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create HowItWorks component**

```astro
---
// src/components/HowItWorks.astro
const steps = [
  {
    number: '01',
    title: 'We Talk',
    description: 'Free 30-minute call to understand your current setup and goals.',
  },
  {
    number: '02',
    title: 'I Assess',
    description: 'Deep audit of your infrastructure, costs, and risk areas.',
  },
  {
    number: '03',
    title: 'We Build',
    description: 'Migration, deployment, and ongoing support tailored to your business.',
  },
];
---

<section id="how-it-works" class="px-6 py-16 bg-midnight">
  <p class="text-center text-brand-orange text-xs font-bold uppercase tracking-widest mb-8">
    How It Works
  </p>
  <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
    {steps.map((step) => (
      <div data-step class="bg-slate-dark border-t-2 border-brand-orange p-6 rounded">
        <div class="text-2xl font-extrabold text-brand-orange mb-2">{step.number}</div>
        <h3 class="text-white font-bold mb-2">{step.title}</h3>
        <p class="text-slate-muted text-sm leading-relaxed">{step.description}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Add HowItWorks to index.astro**

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/HowItWorks.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add How It Works section"
```

---

## Task 6: Case Study Section

**Files:**
- Create: `src/components/CaseStudy.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// Add to tests/e2e/homepage.spec.ts

test('case study shows Brighton Fire Rescue', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#featured-work');
  await expect(section).toBeVisible();
  await expect(section).toContainText('Brighton Fire Rescue');
  await expect(section).toContainText('140');
  await expect(section).toContainText('100%');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create CaseStudy component**

```astro
---
// src/components/CaseStudy.astro
const stats = [
  { value: '100%', label: 'Cloud' },
  { value: '7', label: 'Stations' },
  { value: '140', label: 'Employees' },
];
---

<section id="featured-work" class="px-6 py-16 bg-slate-dark">
  <p class="text-center text-brand-orange text-xs font-bold uppercase tracking-widest mb-8">
    Featured Work
  </p>
  <div class="max-w-3xl mx-auto bg-midnight border border-slate-border border-l-4 border-l-brand-blue rounded-lg p-8">
    <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
      <div>
        <h3 class="text-white font-bold text-lg">Brighton Fire Rescue</h3>
        <p class="text-slate-muted text-sm">7 stations · 140 employees · Public safety</p>
      </div>
      <span class="bg-blue-950 text-blue-400 text-xs px-3 py-1 rounded border border-brand-blue">
        Azure Migration
      </span>
    </div>
    <p class="text-slate-muted text-sm leading-relaxed mb-6">
      Migrated a multi-station fire rescue organization from legacy on-premise infrastructure
      to a fully cloud-based environment — improving reliability and access across all locations.
    </p>
    <div class="flex gap-4">
      {stats.map((stat) => (
        <div class="bg-slate-dark border border-slate-border px-4 py-3 rounded text-center">
          <div class="text-2xl font-extrabold text-brand-orange">{stat.value}</div>
          <div class="text-slate-muted text-xs">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add CaseStudy to index.astro**

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/CaseStudy.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add Brighton Fire Rescue case study section"
```

---

## Task 7: Services Section

**Files:**
- Create: `src/components/Services.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// Add to tests/e2e/homepage.spec.ts

test('services section shows 3 services', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#services');
  await expect(section).toBeVisible();
  await expect(section).toContainText('Cloud Migration');
  await expect(section).toContainText('Managed Azure');
  await expect(section).toContainText('SMB IT Support');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create Services component**

```astro
---
// src/components/Services.astro
const services = [
  {
    icon: '☁️',
    title: 'Cloud Migration',
    description: 'Move your business to Azure — planned, tested, and stress-free.',
  },
  {
    icon: '🔧',
    title: 'Managed Azure',
    description: 'Ongoing monitoring, optimization, and support for your cloud environment.',
  },
  {
    icon: '💼',
    title: 'SMB IT Support',
    description: 'On-site and remote IT support for Denver-area small businesses.',
  },
];
---

<section id="services" class="px-6 py-16 bg-midnight">
  <p class="text-center text-brand-orange text-xs font-bold uppercase tracking-widest mb-8">
    Services
  </p>
  <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
    {services.map((service) => (
      <div class="bg-slate-dark border border-slate-border p-6 rounded">
        <div class="text-2xl mb-3">{service.icon}</div>
        <h3 class="text-white font-bold mb-2">{service.title}</h3>
        <p class="text-slate-muted text-sm leading-relaxed">{service.description}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Add Services to index.astro**

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Services.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add Services section"
```

---

## Task 8: Bottom CTA + Footer

**Files:**
- Create: `src/components/BottomCTA.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing E2E test**

```ts
// Add to tests/e2e/homepage.spec.ts

test('bottom CTA links to contact page', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('section').filter({ hasText: 'Ready to simplify' });
  await expect(cta).toBeVisible();
  await expect(cta.locator('a[href="/contact"]')).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create BottomCTA component**

```astro
---
// src/components/BottomCTA.astro
---

<section class="px-6 py-20 text-center bg-gradient-to-b from-slate-dark to-midnight border-t border-slate-border">
  <h2 class="text-3xl font-extrabold text-white mb-3">Ready to simplify your IT?</h2>
  <p class="text-slate-muted mb-8">Let's talk — no pressure, no jargon.</p>
  <a
    href="/contact"
    class="bg-brand-orange text-white px-8 py-4 rounded font-bold hover:bg-orange-500 transition-colors inline-block"
  >
    Book a Free 30-Min Call →
  </a>
</section>
```

- [ ] **Step 4: Create Footer component**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---

<footer class="px-6 py-8 bg-midnight border-t border-slate-border text-center text-slate-muted text-sm">
  <div class="flex flex-col sm:flex-row justify-center gap-4 mb-4">
    <a href="/blog" class="hover:text-white transition-colors">Blog</a>
    <a href="/contact" class="hover:text-white transition-colors">Contact</a>
    <a href="https://linkedin.com/in/mrcaseyjdavis" target="_blank" rel="noopener" class="hover:text-white transition-colors">LinkedIn</a>
    <a href="https://github.com/caseyjdavis" target="_blank" rel="noopener" class="hover:text-white transition-colors">GitHub</a>
  </div>
  <p>© {year} Casey Davis. Denver, CO.</p>
</footer>
```

- [ ] **Step 5: Add BottomCTA and Footer to index.astro**

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/homepage.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/BottomCTA.astro src/components/Footer.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add BottomCTA and Footer"
```

---

## Task 9: Contact Page

**Files:**
- Create: `src/components/ContactForm.astro`
- Create: `src/pages/contact.astro`
- Create: `tests/e2e/contact.spec.ts`

**Pre-requisite:** Create a free Formspree account at https://formspree.io and create a new form. Copy the form endpoint ID (looks like `xyzabcde`). Store it as an environment variable:

```bash
# .env (create this file, it is gitignored)
FORMSPREE_ID=xyzabcde
```

Add `.env.example`:
```
FORMSPREE_ID=your_formspree_form_id
```

- [ ] **Step 1: Write failing E2E tests**

```ts
// tests/e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test('contact page renders form and calendly', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('contact form shows error when submitted empty', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('button[type="submit"]').click();
  // Browser native validation should prevent submission
  const nameInput = page.locator('input[name="name"]');
  await expect(nameInput).toBeFocused();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx playwright test tests/e2e/contact.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Create ContactForm component**

```astro
---
// src/components/ContactForm.astro
const formspreeId = import.meta.env.FORMSPREE_ID ?? 'REPLACE_ME';
---

<form
  id="contact-form"
  action={`https://formspree.io/f/${formspreeId}`}
  method="POST"
  class="space-y-4 max-w-lg"
>
  <div>
    <label for="name" class="block text-sm text-slate-muted mb-1">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full bg-midnight border border-slate-border rounded px-4 py-2 text-white placeholder-slate-muted focus:outline-none focus:border-brand-blue"
    />
  </div>

  <div>
    <label for="email" class="block text-sm text-slate-muted mb-1">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full bg-midnight border border-slate-border rounded px-4 py-2 text-white placeholder-slate-muted focus:outline-none focus:border-brand-blue"
    />
  </div>

  <div>
    <label for="company" class="block text-sm text-slate-muted mb-1">Company <span class="text-xs">(optional)</span></label>
    <input
      type="text"
      id="company"
      name="company"
      class="w-full bg-midnight border border-slate-border rounded px-4 py-2 text-white placeholder-slate-muted focus:outline-none focus:border-brand-blue"
    />
  </div>

  <div>
    <label for="message" class="block text-sm text-slate-muted mb-1">Message</label>
    <textarea
      id="message"
      name="message"
      rows="5"
      required
      class="w-full bg-midnight border border-slate-border rounded px-4 py-2 text-white placeholder-slate-muted focus:outline-none focus:border-brand-blue"
    ></textarea>
  </div>

  <!-- Honeypot spam field -->
  <input type="text" name="_gotcha" class="hidden" />

  <button
    type="submit"
    id="submit-btn"
    class="bg-brand-orange text-white px-6 py-3 rounded font-bold hover:bg-orange-500 transition-colors disabled:opacity-50"
  >
    Send Message
  </button>

  <div id="form-success" class="hidden text-green-400 text-sm">
    Thanks! I'll be in touch within 1 business day.
  </div>
  <div id="form-error" class="hidden text-red-400 text-sm">
    Something went wrong — please email me directly at
    <a href="mailto:casey@caseyjdavis.com" class="underline">casey@caseyjdavis.com</a>.
  </div>
</form>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const successMsg = document.getElementById('form-success')!;
  const errorMsg = document.getElementById('form-error')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    successMsg.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
      } else {
        errorMsg.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    } catch {
      errorMsg.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
</script>
```

- [ ] **Step 4: Create contact.astro page**

```astro
---
// src/pages/contact.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import ContactForm from '../components/ContactForm.astro';
---

<BaseLayout
  title="Contact — Casey Davis"
  description="Get in touch with Casey Davis for Azure cloud consulting in Denver."
>
  <Nav />
  <main class="px-6 py-16 max-w-5xl mx-auto">
    <h1 class="text-3xl font-extrabold text-white mb-2">Let's talk about your infrastructure.</h1>
    <p class="text-slate-muted mb-12">I typically respond within 1 business day.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h2 class="text-white font-bold mb-6">Send a message</h2>
        <ContactForm />
      </div>

      <div>
        <h2 class="text-white font-bold mb-6">Or book a call directly</h2>
        <!-- Calendly inline embed — replace YOUR_CALENDLY_URL with your actual Calendly link -->
        <div
          class="calendly-inline-widget"
          data-url="https://calendly.com/YOUR_CALENDLY_URL"
          style="min-width:320px;height:630px;"
        ></div>
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

**Note:** Replace `YOUR_CALENDLY_URL` with your actual Calendly scheduling link (e.g., `caseyjdavis/30min`).

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/contact.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactForm.astro src/pages/contact.astro tests/e2e/contact.spec.ts .env.example
git commit -m "feat: add contact page with Formspree form and Calendly embed"
```

---

## Task 10: Blog Content Collection

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/example-post.md`
- Create: `src/layouts/BlogLayout.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `tests/e2e/blog.spec.ts`

- [ ] **Step 1: Write failing E2E tests**

```ts
// tests/e2e/blog.spec.ts
import { test, expect } from '@playwright/test';

test('blog index page renders', async ({ page }) => {
  await page.goto('/blog');
  await expect(page).toHaveTitle(/Blog/);
  await expect(page.locator('h1')).toContainText('Blog');
});

test('blog post page renders from slug', async ({ page }) => {
  await page.goto('/blog/example-post');
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
});

test('blog index links to posts', async ({ page }) => {
  await page.goto('/blog');
  const firstPost = page.locator('a[href^="/blog/"]').first();
  await expect(firstPost).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx playwright test tests/e2e/blog.spec.ts --reporter=line
```

Expected: FAIL

- [ ] **Step 3: Define content collection schema**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 4: Create example blog post**

```markdown
---
title: "Getting Started with Azure for Small Businesses"
date: "2025-03-01"
description: "A practical introduction to Azure cloud services for small business owners who want to reduce IT overhead and improve reliability."
tags: ["azure", "cloud", "small-business"]
---

Moving to the cloud doesn't have to be complicated. Here's what you need to know to get started with Azure...
```

- [ ] **Step 5: Create BlogLayout**

```astro
---
// src/layouts/BlogLayout.astro
import BaseLayout from './BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

export interface Props {
  title: string;
  description: string;
  date: Date;
  readingTime: number;
}

const { title, description, date, readingTime } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});
---

<BaseLayout title={`${title} — Casey Davis`} description={description}>
  <Nav />
  <main class="px-6 py-16 max-w-2xl mx-auto">
    <header class="mb-10">
      <h1 class="text-3xl font-extrabold text-white mb-3">{title}</h1>
      <div class="text-slate-muted text-sm">
        {formattedDate} · {readingTime} min read
      </div>
    </header>
    <article class="prose prose-invert prose-slate max-w-none">
      <slot />
    </article>
  </main>
  <Footer />
</BaseLayout>
```

Install prose plugin:
```bash
npm install -D @tailwindcss/typography
```

Update `tailwind.config.mjs` to import and register the plugin (ESM — `require()` is not available in `.mjs` files):
```js
// tailwind.config.mjs
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        slate: {
          dark: '#1e293b',
          border: '#334155',
          muted: '#94a3b8',
        },
        brand: {
          blue: '#2563eb',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
};
```

- [ ] **Step 6: Create blog index page**

```astro
---
// src/pages/blog/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);

function readingTime(body: string) {
  const words = body.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
---

<BaseLayout
  title="Blog — Casey Davis"
  description="Articles on Azure, cloud infrastructure, and IT for Denver small businesses."
>
  <Nav />
  <main class="px-6 py-16 max-w-4xl mx-auto">
    <h1 class="text-3xl font-extrabold text-white mb-10">Blog</h1>
    <div class="grid gap-6">
      {posts.map((post) => (
        <a href={`/blog/${post.slug}`} class="block bg-slate-dark border border-slate-border rounded-lg p-6 hover:border-brand-blue transition-colors">
          <h2 class="text-white font-bold text-lg mb-2">{post.data.title}</h2>
          <div class="text-slate-muted text-xs mb-3">
            {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            · {readingTime(post.body)} min read
          </div>
          <p class="text-slate-muted text-sm leading-relaxed">{post.data.description}</p>
        </a>
      ))}
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 7: Create blog post page**

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

function readingTime(body: string) {
  return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}
---

<BlogLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  readingTime={readingTime(post.body)}
>
  <Content />
</BlogLayout>
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npx playwright test tests/e2e/blog.spec.ts --reporter=line
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/content/ src/layouts/BlogLayout.astro src/pages/blog/ tests/e2e/blog.spec.ts
git commit -m "feat: add blog content collection, index, and post pages"
```

---

## Task 11: Assemble Final Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Assemble all components into the final homepage**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import HowItWorks from '../components/HowItWorks.astro';
import CaseStudy from '../components/CaseStudy.astro';
import Services from '../components/Services.astro';
import BottomCTA from '../components/BottomCTA.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout>
  <Nav />
  <main>
    <Hero />
    <HowItWorks />
    <CaseStudy />
    <Services />
    <BottomCTA />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Run all E2E tests**

```bash
npx playwright test --reporter=line
```

Expected: All PASS

- [ ] **Step 3: Run a production build and verify no errors**

```bash
npm run build
```

Expected: `dist/` created, no TypeScript or Astro errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble final homepage"
```

---

## Task 12: Deploy to Cloudflare Pages

**Pre-requisites:** Cloudflare account, GitHub repo `caseyjdavis/caseyjdavis.com` created and pushed.

- [ ] **Step 1: Push code to GitHub**

```bash
git remote add origin https://github.com/caseyjdavis/caseyjdavis.com.git
git push -u origin main
```

- [ ] **Step 2: Create Cloudflare Pages project**

1. Log in to Cloudflare Dashboard → Pages → Create a project
2. Connect GitHub, select `caseyjdavis/caseyjdavis.com`
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add environment variable: `FORMSPREE_ID` = your Formspree form ID
5. Click **Save and Deploy**

- [ ] **Step 3: Verify preview deployment**

Wait for build to complete. Cloudflare will provide a URL like `https://caseyjdavis-com.pages.dev`. Open it and verify:
- Homepage loads correctly
- All sections visible
- Nav links work
- Contact form renders
- Blog page renders

- [ ] **Step 4: Add Cloudflare Pages build config to repo**

Create `wrangler.toml` only if custom routing is needed — for a static Astro site it is not required. Skip this step.

- [ ] **Step 5: DNS cutover (when ready to go live)**

In Cloudflare Pages project settings → Custom domains → Add `www.caseyjdavis.com`.

If domain is already on Cloudflare DNS: Cloudflare will configure it automatically.

If domain is on another registrar: Update CNAME record for `www` to point to `caseyjdavis-com.pages.dev`. Remove/disable the GitHub Pages `CNAME` file in the old repo first to avoid conflicts.

- [ ] **Step 6: Commit any deployment config changes**

```bash
git add -A
git commit -m "chore: add deployment notes and .env.example"
```

---

## Task 13: Migrate Existing Blog Posts

**Files:**
- Create: one `.md` file per existing blog post in `src/content/blog/`

- [ ] **Step 1: Fetch existing posts from the live site**

Visit `https://www.caseyjdavis.com/blog` and note all existing post URLs.

- [ ] **Step 2: For each post, create a Markdown file**

File naming: use the existing slug (e.g., `truenas-ssl.md`).

Required frontmatter:
```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
description: "One sentence description used as the excerpt and meta description."
tags: ["relevant", "tags"]
---

Post content here...
```

- [ ] **Step 3: Verify posts appear on blog index**

```bash
npm run dev
```

Open `http://localhost:4321/blog` and confirm all migrated posts appear.

- [ ] **Step 4: Commit**

```bash
git add src/content/blog/
git commit -m "content: migrate existing blog posts"
```

---

## Final Checklist

Before DNS cutover, verify:

- [ ] `npm run build` completes without errors
- [ ] `npx playwright test` — all tests pass
- [ ] Homepage loads on Cloudflare preview URL
- [ ] Contact form submits successfully to Formspree (test with a real submission)
- [ ] Calendly embed loads on `/contact`
- [ ] All nav links work (Services, Work, Blog anchors; Book a Call → /contact)
- [ ] Blog index shows posts; clicking a post opens the post page
- [ ] Mobile nav drawer opens and closes correctly
- [ ] Replace placeholder headshot in `public/headshot.jpg` with real photo
- [ ] Update Calendly URL in `src/pages/contact.astro`
- [ ] Update Formspree ID in `.env`
- [ ] Site title and meta description are correct in browser tab and search preview
