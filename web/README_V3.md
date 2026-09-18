# AA : Event Maker — Complete Frontend v3

Flow now implemented:
Home → Create Project → Dashboard → Invitation Maker → Invitation Detail/Public Preview.

Also included:
Templates, Photo Maker, Video Maker, Design Maker, Guest Manager, Location, Planner, Memories.

This is a functional frontend prototype. Real authentication, database, cloud media, payment webhooks, WhatsApp Business API, map API, AI rendering and production invitation publishing still require backend integration.

## Mobile & production polish (this update)
- Fixed a major mobile UX bug: the nav menu used to disappear completely below 850px with no replacement. Every page now has a working hamburger menu (animated icon, keyboard/ARIA accessible) that reveals a full-width dropdown nav.
- Wired up the PWA: `manifest.webmanifest` and `sw.js` existed in the previous export but were never linked or registered on any page, so "Add to Home Screen" and offline support did not actually work. Both are now linked/registered on every page, the icon is set as favicon, and `theme-color`/Apple PWA meta tags were added.
- Fixed a service-worker bug where the asset precache list referenced a CSS file (`dashboard.css`) that wasn't actually used by any page; this would have made the entire offline cache installation fail silently. The unused file was removed and the cache list/version were corrected.
- Fixed a pre-existing broken `<section>`/`<div>` nesting bug in `video-maker.html` that could distort layout in some browsers.
- Mobile-friendliness pass: form inputs use 16px font (prevents iOS auto-zoom on focus), buttons/links/tap targets sized to ~44px minimum, grids made overflow-safe on narrow screens, large headings made fluid with `clamp()`, and the public invitation page (`invitation-detail.html`) got extra breakpoints for very small phones (≤420px).
