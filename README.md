# Villa Pomona Website

Heritage boutique villa in Bled, Slovenia. Static HTML/CSS/JS site — no build tools, no framework.

**Live:** [https://villa-pomona-bled.com/](https://villa-pomona-bled.com/)  
**Deployment:** GitHub Pages via `.github/workflows/deploy.yml` (push to `main`)

## Quick Start

```bash
# No build step needed. Just open in a browser:
open index.html
```

## Project Structure

```
.
├── index.html            # Main page (English)
├── sl/index.html          # Slovenian translation
├── de/index.html          # German translation
├── styles.css             # All styles
├── script.js              # All interactions
├── favicon.svg            # SVG favicon
├── robots.txt             # SEO
├── sitemap.xml            # SEO with hreflang alternates
├── privacy.html           # Privacy Policy
├── terms.html             # Terms & Conditions
├── 404.html               # Custom 404 page
├── assets/
│   ├── images/            # Photographs (WebP, max 1600px wide)
│   │   ├── *.webp         # Full-size images (1600px)
│   │   ├── *-800.webp     # Responsive variants (800px)
│   │   ├── apple-touch-icon.png  # iOS home screen icon (180×180)
│   │   └── og-image.jpg   # Social sharing image
│   └── fonts/             # Self-hosted fonts (woff2)
│       ├── CormorantGaramond-*.woff2
│       └── Inter-*.woff2
├── netlify.toml           # Inactive (GitHub Pages ignores it)
└── .github/workflows/deploy.yml
```

## Site Sections

| Section | ID | Description |
|---------|-----|-------------|
| Hero | `#hero` | Full-screen hero with img, title, CTA |
| About | `#about` | Villa description, stats |
| Bedrooms | `#bedrooms` | 5 accommodation cards (€170–€980/night) |
| Pool House | `#poolhouse` | Dedicated pool house section |
| Amenities | `#amenities` | 9 amenity cards |
| Location | `#location` | Location info + click-to-load Google Maps |
| FAQ | `#faq` | Accordion FAQ with FAQPage JSON-LD |
| Reviews | `#reviews` | Links to Airbnb, Booking.com, Google |
| Gallery | `#gallery` | Image grid with lightbox |
| Availability | `#availability` | Lazy-loaded channel-manager widget |
| Contact | `#contact` | Booking form (Formspree) + contact details |

## Key Features

- **No external dependencies** — fonts are self-hosted; no Google Fonts requests
- **Multilingual** — English (`/`), Slovenian (`/sl/`), German (`/de/`) with `hreflang` cluster
- **Self-hosted fonts** — Cormorant Garamond (300–600, italic 300/400) + Inter (300–600) via `@font-face` with `font-display: swap`
- **Responsive images** — all content images have `srcset` (800w + 1600w) and `sizes`
- **Booking form** — POSTs to Formspree (`FORMSPREE_FORM_ID` must be configured in `script.js`), falls back to `mailto:` on failure
- **Price estimate** — client-side calculation (nights × nightly rate + transfer surcharge) shown in real-time
- **Map** — click-to-load Google Maps iframe (no cookies until clicked)
- **Gallery lightbox** — keyboard (Esc, arrows) and touch navigation, focus trap
- **Analytics** — placeholder in `<head>` for Plausible or GoatCounter snippet
- **JSON-LD** — LodgingBusiness + FAQPage structured data
- **Accessibility** — skip-to-content link, semantic HTML, focus-visible outlines, reduced-motion support

## Configuration Prerequisites

Before deploying, configure these in `script.js`:
```js
var FORMSPREE_FORM_ID = 'YOUR_FORM_ID';   // Create form at formspree.io
```

User must also:
- Replace analytics placeholder in `<head>` with Plausible/GoatCounter snippet
- Supply real Airbnb/Booking.com/Google review URLs in the Reviews section
- Add channel-manager widget embed code in `index.html` Availability section
- Set up Google Search Console for the GitHub Pages property

## Translation Maintenance

3 HTML files (`index.html`, `sl/index.html`, `de/index.html`) must be kept in sync. When adding/updating content in one, replicate the changes in all three. Each has its own `<html lang>`, `<title>`, meta tags, OG tags, and hreflang links.

## Conventions

- **CSS** — all styles in `styles.css`. Uses CSS custom properties (`--green-*`, `--neutral-*`, `--gold`).
- **JS** — all interactions in `script.js` with `defer`. Includes: smooth scroll, mobile nav toggle, scroll reveal animations, booking form (Formspree), lightbox gallery, sticky nav, price estimate, map loader, availability lazy-loader.
- **Images** — all images in `assets/images/`. WebP format. Responsive variants at 800px (`-800` suffix).
- **Fonts** — self-hosted woff2 in `assets/fonts/`. No external font requests.
- **Footer year** — auto-updated to current year via JavaScript.

## Deployment

The site is deployed on **GitHub Pages** via Actions workflow (`.github/workflows/deploy.yml`). Push to `main` branch triggers automatic deployment.

`netlify.toml` exists in the repo but is **inactive** — GitHub Pages ignores it. It is kept for reference only.