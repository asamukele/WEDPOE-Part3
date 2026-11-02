# The Matric Dance Foundation (WEDE5020 POE)

Non-profit website helping underprivileged learners attend their matric dance.

**Live site:** _add your Netlify / GitHub Pages link here_

## Pages
index, about, service, events (new), donate, enquiry (new), contact

## Part 3 additions
- **JavaScript:** accordion FAQ (service), modal (donate), lightbox gallery and searchable/filterable/sortable event list (events), Leaflet map (contact), CSS fade/hover animations
- **Forms:** enquiry.html (returns an estimated cost/availability) and contact.html, both with JS validation, inline errors and AJAX (fetch) submission
- **SEO:** keywords, unique titles and meta descriptions, heading structure, descriptive image names and alt text, internal links, mobile-friendly layout, robots.txt, sitemap.xml, compressed images with lazy loading

## Changelog
| Date | Change | Reason |
|------|--------|--------|
| 2026-11-02 | Fixed broken responsive image paths on index.html | Part 2 feedback: images not loading |
| 2026-11-02 | Moved/renamed images into /images with descriptive names and compressed them | SEO and page speed |
| 2026-11-02 | Added meta descriptions to service, contact and donate; fixed old "MatricMoments" footer name | SEO and consistency |
| 2026-11-02 | Added events.html, enquiry.html, js/script.js, robots.txt, sitemap.xml | Part 3 requirements |
| _add_ | _Record every change made from your actual Part 2 feedback here_ | |

## Setup notes
- Replace `YOUR_FORM_ID` in js/script.js with your Formspree form ID so forms send real email. Until then they fall back to a pre-filled email.
- Replace `YOUR-USERNAME/YOUR-REPO` in robots.txt and sitemap.xml with your live URL.

## References
Leaflet. (2023) Leaflet 1.9.4. Available at: https://leafletjs.com (Accessed: 2 November 2026).
OpenStreetMap contributors. (2026) OpenStreetMap. Available at: https://www.openstreetmap.org (Accessed: 2 November 2026).
_Add your Part 2 references (References.docx) and any others you used._
