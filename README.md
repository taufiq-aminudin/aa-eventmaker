<<<<<<< HEAD
# AA : Event Maker — Starter

Lightweight mobile-first web/PWA plus Android-ready Capacitor wrapper.

## Web
Open `web/index.html` directly for a visual preview, or serve it:
`python -m http.server 8080 --directory web`

## Android
Requirements: Node.js + Android Studio.
1. `cd app`
2. `npm install`
3. `npx cap add android`
4. `npx cap sync`
5. `npx cap open android`

The current starter is intentionally lightweight. It is a frontend foundation, not the production backend.

## Next production modules
Auth → Projects → Template engine → Editor → Media storage → Payment webhook → Invitation publishing → WhatsApp Business API → Guest/RSVP → QR check-in → AI services → Analytics.

## Important
Do not hard-code payment credentials or WhatsApp tokens in frontend code. Use a backend and environment secrets.
=======
# AA : Event Maker

Create. Celebrate. Remember.

Core architecture:
User → Project → Invitation / Photo / Video / Design / AI / Guests / Location / Planner / Budget / Analytics / Memories.

The template library includes wedding concept visual starting points (garden, rustic, modern minimalist, elegant white, intimate, ballroom, adat modern, festival, monochrome, pastel, sustainable, content-friendly) and regional/cultural wedding styles.

Accounts and projects are stored separately on the device. Photo/video media is stored in IndexedDB. Invitation sharing exposes public invitation details only.

For the existing Capacitor Android project, replace the existing `web/` folder with this `web/` folder and run `npx cap sync android`.
>>>>>>> 87a05b20a8d1770e8552fad94763099b5ec709cb
