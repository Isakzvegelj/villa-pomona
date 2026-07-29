---
description: Improve and maintain the Villa Pomona static website
mode: primary
model: deepseek/deepseek-v4-flash
steps: 50
color: "#2D6A4F"
---

# Villa Pomona Site — AI Agent

## Project Overview

You are working on **Villa Pomona**, a heritage boutique villa in Bled, Slovenia. The site is a **static HTML/CSS/JS single-page website** — no build tools, no frameworks. Deployed on Netlify. Changes pushed to `main` auto-deploy.

## Core Files

| File | Purpose |
|---|---|
| `index.html` | All content and structure (single page, sections linked by `#id`) |
| `styles.css` | All styling. Uses CSS custom properties (`--green-*`, `--neutral-*`, `--gold-*`) |
| `script.js` | All interactions: smooth scroll, nav toggle, scroll reveal, booking form, lightbox gallery, sticky nav |
| `assets/images/` | Photographs: hero (3), gallery (8), about (1), rooms (3) |
| `favicon.svg` | SVG favicon |
| `netlify.toml` | Netlify deploy config (static publish, security headers, cache control, SPA redirect) |
| `robots.txt` | SEO |
| `sitemap.xml` | SEO |
| `README.md` | Full project reference |

## Site Sections (in `index.html`)

Hero → About → Bedrooms (5 cards) → Pool House → Amenities (9 items) → Location → Testimonials → Gallery (with lightbox) → Contact (info + booking form)

## How to Work

1. **Read `README.md` first** for full context.
2. **Edit files directly** — no build step. Preview by opening `index.html` in a browser.
3. **Commit and push** to deploy:
   ```
   git add -A && git commit -m "description" && git push origin main
   ```
4. **Keep it simple** — avoid adding external dependencies, build tools, or frameworks unless the problem genuinely requires them.

## Your Autonomy

This document provides context and suggestions. You are an intelligent agent. If you see a better approach, a more elegant solution, or something the author didn't anticipate — **use your own judgment**. The goal is a better site, not adherence to this document. If you need to restructure, refactor, or do something unconventional, do it. Explain your reasoning in commit messages.

## Suggested Improvement Areas

- SEO / meta tags / Open Graph / structured data
- Accessibility (aria labels, contrast, keyboard navigation, focus management)
- Performance (image optimization, responsive images, lazy loading)
- Mobile responsiveness edge cases
- Content updates or new sections
- Code quality (cleanup, organization, comments where helpful)
- Analytics integration (GA4, Plausible, etc.)
- i18n / multi-language support (Slovenian/English)
- Form validation, submission handling, or backend integration
- Any other improvements you identify

This list is not exhaustive. If you see something that needs fixing, fix it.