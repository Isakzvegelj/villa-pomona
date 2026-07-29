# Villa Pomona Website — Improvement Plan (Implementation-Ready)

Static single-page site: `index.html` (459 lines), `styles.css`, `script.js` (241 lines). Deployed on Netlify (`netlify.toml`, publish=".", no build step). All decisions below are locked — implement top-to-bottom without asking.

## Locked decisions & assumptions

- **Production domain: `https://villapomona.si/`** (robots.txt + sitemap.xml already use it; the netlify.app URLs in `index.html` og/twitter tags are stale). If the user later says the domain is different, find-replace `villapomona.si`.
- **Form backend: Netlify Forms** (site already on Netlify; no external dependency). Keep the `mailto:` fallback on failure.
- **Image format: WebP**, max width 1600px, quality 80. Keep one JPEG for og:image (social scraper compatibility).
- **Out of scope** (do NOT implement): booking engine/availability calendar, analytics, multilingual, redesign, framework migration, deleting unused image files from the repo.

## Tasks (ordered)

### 1. Fix malformed amenities grid HTML — `index.html:219–266`
`.amenities-grid` closes at line 255, then two `.amenity-card` divs (Breakfast on Demand, Self-Catering Kitchen) sit outside the grid, followed by a stray unbalanced `</div>` at line 266.
- Move the two cards inside `.amenities-grid` (before its closing tag) and delete the stray `</div>`.
- Verify: 9 `.amenity-card` elements, all inside `.amenities-grid`; run W3C validator, zero errors.

### 2. Booking form → Netlify Forms — `index.html:414`, `script.js:81–152`
HTML:
- Form tag: `<form class="contact-form" id="bookingForm" name="booking" data-netlify="true" netlify-honeypot="bot-field">`
- Add first children inside the form: `<input type="hidden" name="form-name" value="booking">` and `<p hidden><label>Don't fill this out: <input name="bot-field"></label></p>`.
JS (`initBookingForm`):
- Delete `FORM_ENDPOINT` and the JSON fetch. POST to `location.pathname` instead, `Content-Type: application/x-www-form-urlencoded`, body = `new URLSearchParams(new FormData(form))` (this automatically includes `form-name`).
- On `response.ok` → `showFormConfirmation(form)`; else → existing `mailtoFallback`. Keep everything else (date min logic, button state) unchanged.
- Note: submissions only work on the deployed Netlify site, not locally — document in PR/commit message. Verify post-deploy: Netlify dashboard → Forms → "booking" shows the entry.

### 3. Optimize images (~70MB → target <3MB total) — `assets/images/`
- Install tool: `brew install webp` (or `npm i -g sharp-cli`).
- Convert every JPG in `assets/images/` (NOT `rooms/` — unused, leave untouched):
  `cd assets/images && for f in *.jpg; do cwebp -q 80 -resize 1600 0 "$f" -o "${f%.jpg}.webp"; done`
  (`-resize 1600 0` keeps aspect ratio; images already smaller, e.g. `pool-house.jpg` 120KB, still get converted for reference uniformity.)
- Create `assets/images/og-image.jpg`: 1200×630 crop of hero-1, quality 82, ≤200KB (for social sharing only).
- Update ALL references in `index.html`: every `src="assets/images/*.jpg"` and the hero inline `style="background-image: url('assets/images/hero-1.jpg')"` → `.webp`. og:image + twitter:image (lines 12, 16) → `https://villapomona.si/assets/images/og-image.jpg`.
- Add to `<head>`: `<link rel="preload" as="image" href="assets/images/hero-1.webp" fetchpriority="high">`.
- Add `fetchpriority="high"` to the first gallery-relevant above-the-fold image if any; all others already have `loading="lazy"`.
- After verifying no remaining `.jpg` references (`grep -n "\.jpg" index.html` → only og-image.jpg), delete the original JPGs that were converted (keep `og-image.jpg`, keep `rooms/`).
- Verify: `du -sh assets/images` ≤ ~4MB; page loads correctly.

### 4. Unify domain + canonical + sitemap — `index.html`, `sitemap.xml`
- `index.html` line 11: og:url → `https://villapomona.si/`.
- Add after line 11: `<link rel="canonical" href="https://villapomona.si/">`.
- Rewrite `sitemap.xml` to a single entry (fragments are ignored by search engines; current anchors `#suites`, `#wellness`, `#reservation` don't exist):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://villapomona.si/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
- `robots.txt` needs no change.

### 5. JSON-LD structured data — `index.html` `<head>`, before `</head>`
Add one `<script type="application/ld+json">` block, type `LodgingBusiness`, with:
- name "Villa Pomona", url/image/telephone `+38651603858`, email `evita.vilebled@gmail.com`
- address: PostalAddress, streetAddress "Crtomirova ulica 2", addressLocality "Bled", postalCode "4260", addressCountry "SI"
- priceRange "€170–€980"
- amenityFeature: Swimming Pool, Free Parking, Kitchen, Wi-Fi (LocationFeatureSpecification, value true)
- geo: **look up** exact lat/lng for Crtomirova ulica 2, Bled via Google Maps before adding; if not verifiable, omit `geo` entirely — do not guess coordinates.
- No `aggregateRating` (no real review data yet).

### 6. Guest count consistency — `index.html:425`
"Entire Villa" sleeps 8 but `#guests` caps at 6. Add `<option value="7">7 guests</option>` and `<option value="8">8 guests</option>`.

### 7. WhatsApp CTA — `index.html:409` area
- Make the phone number in the contact-item also a WhatsApp link: `<a href="https://wa.me/38651603858" target="_blank" rel="noopener">+386 51 603 858</a>` (keep `tel:` on a separate link or make wa.me primary — decision: wa.me primary, keep tel: link on the label text below it, same paragraph).
- Add after the `.contact-note` div: `<a href="https://wa.me/38651603858" target="_blank" rel="noopener" class="btn btn-outline" style="margin-top:20px;">Message on WhatsApp</a>`.

### 8. Accessibility pass
- `index.html`: wrap every decorative emoji entity in `<span aria-hidden="true">…</span>` (logo `&#127800;` in nav + footer, amenity icons, gf-icons, ci-icons, suite badges are text — leave those).
- Nav toggle (`index.html:30`): add `aria-expanded="false"`; in `initMobileNav` (`script.js:25–28`) set `toggle.setAttribute('aria-expanded', …)` to match the `active` class state in all three toggle/close paths.
- Lightbox (`index.html:388`): add `role="dialog" aria-modal="true" aria-label="Image gallery"`. In the lightbox IIFE (`script.js:186–241`): on open, store `document.activeElement` and focus `#lightboxClose`; on close, restore focus to the stored element.
- `styles.css`: add
  ```css
  :focus-visible { outline: 2px solid var(--green-500); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1; transform: none; transition: none; }
      .lightbox.active { animation: none; }
  }
  ```
- `script.js` `initParallax`: early-return if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

### 9. Testimonials — minimal change only
- Add `id="testimonials"` to the section (`index.html:302`).
- Do NOT rewrite the review copy; replacing placeholder quotes with real guest reviews is the content owner's task. Add an HTML comment `<!-- TODO: replace with verified guest reviews -->` above the section.

### 10. Footer year auto-update — `index.html:451`, `script.js`
- Change `&copy; 2026` to `&copy; <span id="footerYear">2026</span>`.
- In the `DOMContentLoaded` handler: `document.getElementById('footerYear').textContent = new Date().getFullYear();` (guard null).

### 11. README refresh — `README.md`
- Fix stale line counts ("styles.css 238 lines", "script.js 240 lines") — replace with actual counts or drop the numbers.
- Image list: reflect `.webp` files + `og-image.jpg` after task 3.
- Add one line: booking form uses Netlify Forms (dashboard → Forms → "booking").

## Validation (implementer must run)

1. W3C validator on final `index.html` — 0 errors.
2. `grep -n "\.jpg" index.html` → only `og-image.jpg`; `grep -n "netlify.app" index.html sitemap.xml robots.txt` → no matches.
3. `open index.html` / `npx serve .`: amenities grid shows 9 styled cards; gallery lightbox opens, keyboard/swipe works, focus returns on close; mobile nav toggles with aria-expanded; reduced-motion OS setting disables parallax/reveal.
4. Post-deploy: submit the booking form on the live site → entry appears in Netlify dashboard → Forms; mailto fallback works if fetch fails (dev-tools offline test).
5. Lighthouse (mobile, live site): Performance ≥85, Accessibility ≥95, Best Practices ≥95, SEO 100. Initial page weight <1.5MB.
6. Rich Results Test (search.google.com/test/rich-results) on live URL → LodgingBusiness parsed without errors.

## Risks / notes

- Netlify Forms requires the form to exist in the deployed HTML at deploy time — first deploy after the change registers it; don't test submissions locally.
- Deleting source JPGs is irreversible via the working tree; they remain in git history if needed.
- If `villapomona.si` is not actually live/redirecting to the Netlify site, task 4's assumption must be revisited with the user before deploy.
