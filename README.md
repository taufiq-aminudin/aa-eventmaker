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

## V5 navigation
Landing navigation now uses separate Create, Templates, and Features pages.
