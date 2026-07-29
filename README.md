# Villa Pomona Website

Heritage boutique villa in Bled, Slovenia. Static HTML/CSS/JS site — no build tools, no framework. Serves directly via Netlify or GitHub Pages.

## Quick Start

```bash
# No build step needed. Just open in a browser:
open index.html
```

## Project Structure

```
.
├── index.html          # Main page (single-page site, all sections, ~490 lines)
├── styles.css           # All styles (251 lines)
├── script.js            # All interactions (247 lines)
├── assets/images/       # Photographs (WebP and JPEG, max 1600px wide)
│   ├── hero-1.webp
│   ├── hero-2.webp
│   ├── about.webp
│   ├── master-suite.webp
│   ├── superior-suite.webp
│   ├── pool-house.webp
│   ├── og-image.jpg
│   └── gallery-1.webp through gallery-8.webp
├── favicon.svg          # SVG favicon
├── robots.txt           # SEO
├── sitemap.xml          # SEO
├── netlify.toml         # Netlify deploy config
└── .gitignore
```

## Site Sections (in `index.html`)

| Section | ID | Description |
|---------|-----|-------------|
| Hero | `#hero` | Full-screen hero with background image, title, CTA |
| About | `#about` | Villa description, stats (3 bedrooms, pool house, 5 parking, 3 min to lake) |
| Bedrooms | `#bedrooms` | 5 accommodation cards: 3 bedrooms, pool house, entire villa. Prices from €170–€980/night |
| Pool House | `#poolhouse` | Dedicated pool house section with features |
| Amenities | `#amenities` | 9 amenity cards (pool, pool house, lounge library, balcony, parking, garden, staff, breakfast, kitchen) |
| Location | `#location` | Location description with walking distances and nearby attractions |
| Testimonials | — | 3 guest review cards |
| Gallery | `#gallery` | Image grid with lightbox (keyboard & touch navigation) |
| Contact | `#contact` | Contact info + booking form |

## Conventions

- **No external dependencies** — pure HTML/CSS/JS. The only external resources are Google Fonts (Cormorant Garamond + Inter).
- **Single-page** — all content is in `index.html` with anchor links (`#about`, `#bedrooms`, etc.).
- **CSS** — all styles in `styles.css`. Uses CSS custom properties for theming (--green-\*, --neutral-\*, --gold-*).
- **JS** — all interactions in `script.js`. Includes: smooth scroll, mobile nav toggle, scroll reveal animations, booking form (Netlify Forms), lightbox gallery, sticky nav.
- **Images** — all images in `assets/images/`. Converted to WebP (quality 80, max 1600px wide). `hero-1.jpg` kept for social sharing compatibility.
- **Deployment** — Netlify (`netlify.toml`). Static site hosted at `https://villapomona.si/`. Booking form submissions appear in Netlify dashboard → Forms → "booking". No build step.
- **Netlify Forms** — booking form submits via POST to `location.pathname`. Netlify edge intercepts the form-name submission before the SPA redirect. Falls back to `mailto:` on failure.
- **JSON-LD** — structured data for search engines is inline in `<head>` (LodgingBusiness schema).
- **WhatsApp** — direct chat button links to `wa.me/38651603858`.
- **Footer year** — auto-updated to current year via JavaScript.
- **Security headers** — HSTS (1 year, preload) and CSP sent via Netlify headers. CSP uses `'unsafe-inline'` on `script-src` and `style-src` for JSON-LD and Google Fonts compatibility. `form-action` covers both production domain and Netlify preview URLs.

## Making Changes

### Content
- Edit `index.html` — each section is clearly labeled with comments and IDs.
- Add new sections by copying the pattern of existing sections.

### Styling
- Edit `styles.css` — colors are defined as CSS custom properties at the top of the file.
- Responsive breakpoints: 768px (tablet), 1024px (desktop).

### Interactions
- Edit `script.js` — each feature is a self-contained function.
- Key features: scroll reveal, sticky nav, mobile menu, gallery lightbox, booking form.

### Images
- Add new images to `assets/images/` or `assets/images/rooms/`.
- Optimize images before adding (WebP or JPEG, ~1200px wide max).

## Deployment

The site is deployed on Netlify. Push to `main` branch and Netlify auto-deploys. Configured via `netlify.toml`.

To deploy on GitHub Pages instead:
1. Enable Pages in repo settings (source: `main` branch, root folder)
2. Update `netlify.toml` references or remove
3. Update the canonical URL and OG URLs in `index.html` `<head>`