# ZENJI — Design & Implementation Brief

**One-page storefront · Frontend hiring assignment · September 2026**

---

## 1. Research summary — what makes ZENJI *feel* like ZENJI

Research sources (read-only inspection, no assets or code copied):
- https://zenji.shop/ (homepage, rendered text + metadata)
- https://zenji.shop/collection, `/drop`, `/our-story`, `/collaboration`, `/contact`, `/review`
- Public Instagram @zenji_.shop (bio: *"Anime-inspired streetwear for the fearless. Limited Edition | No restocks. Australia. Wear your story."*)

### Brand identity
- Australian anime streetwear label, **founded 2024**. Taglines: **"Wear the Arc"**, **"Wear your story"**.
- Positioning: *"for the dreamers, fighters, creators and outsiders"* — anime for **gamers and otaku**, not casual merch.
- The defining mechanic: **limited drops that never restock** ("No restocks. Ever.", "_REDACTED", "INCOMING TRANSMISSION", "THE_ORIGIN_DROP").
- Storytelling leans on **samurai discipline + neo-Tokyo**: bushido, warrior spirit, blue flame, demon blood, will of the sun.

### Typography & voice
- Heavy **all-caps display type** with slashes, arrows and double-dash rules as ornament: `ABOUT // ZENJI`, `COLLECTION // THE_ORIGIN_DROP`, `VIEW PRODUCT →`, `––DAYS`.
- Courier/mono-flavoured accents ("_REDACTED", "INCOMING TRANSMISSION") over grotesque headlines — a classified-military-file × anime aesthetic.
- Copy voice: short, declarative, dramatic. "The next chapter begins. Are you ready?"

### Color & visual language
- **Dark-first palette** (near-black backgrounds) with saturated anime accent hues per product: steel blue, crimson/CRIMSON PINK, sun gold. White text on black.
- Big poster-style hero treatments, drop-date countdown energy, percentage-off burst badges ("SALE 15% OFF").
- Product naming pattern: `<MYTHIC NAME> TEE` + a colorway in caps (e.g. `BLUE FLAME TEE — STEEL BLUE`).

### Product & commerce facts (grounding our demo data)
- 10 tee designs in "The Origin Drop", **A$39.99** standard, **A$33.99** when 15% off.
- **240gsm heavyweight cotton**, oversized fit, sizes **XS–XXL**.
- Free shipping Australia-wide over **A$100** (some pages say A$150 — we standardise on A$100 for the demo threshold).
- No restocks; every piece is limited. Support answers in 2 business days.

### What we deliberately do NOT copy
Their layout, code, photography, logo, artwork, or product photography. Everything below is an **original interpretation** of the same brand DNA, with **original SVG-generated product artwork** and original copy in the same voice.

---

## 2. Design direction (original interpretation)

**Concept: "a classified transmission from a drop that hasn't happened yet."**
The page is a signal intercepted from Neo-Tokyo — terminal readouts frame an editorial streetwear spread. Black canvas, thin rules, monospace data labels, one loud accent per product.

### Palette (tokens)
| Token | Value | Role |
|---|---|---|
| `--ink` | `#0a0a0b` | Page background |
| `--panel` | `#121216` / `#17171c` | Cards, drawer |
| `--line` | `#26262e` | Hairline rules |
| `--text` | `#f4f4f5` | Primary text |
| `--muted` | `#9a9aa5` | Secondary text |
| `--accent` | `#ff3d3d` | Brand red (CTA, badges) |
| `--gold` | `#ffb02e` | Sun gold (highlights, savings) |

Product accent hues (own artwork, own names): **Steel Blue** `#5f8dd3`, **Crimson** `#e23d3d`, **Sun Gold** `#ffb02e`, **Violet** `#8b5cf6`.

### Type
- Display: **Space Grotesk** (700) — techy grotesque for headlines, tracked tight, uppercase.
- Data/labels: **JetBrains Mono** — readouts, prices, meta labels, tracked wide.
- Body: Space Grotesk 400/500. Both fonts are Google Fonts, self-hosted via `@fontsource` packages (no runtime requests, consistent offline builds).

### Layout
- Sticky header: wordmark, three nav anchors, cart button with live count badge.
- Hero: oversized stacked headline ("WORN BY THE FEARLESS"), mono subreadout, dual CTA (SHOP THE DROP / VIEW LOOKBOOK), stat strip (240 GSM · 200 UNITS · NO RESTOCKS), framed poster panel with animated SVG kanji-backdrop tee.
- Scrolling marquee strip: `WEAR THE ARC — NO RESTOCKS. EVER. — NEW DROP LIVE —` (pausable, `prefers-reduced-motion` respected).
- Collection: responsive card grid (1→2→4 cols), each card = original SVG tee render on accent-tinted panel, status chip (LAST UNITS / SELLING FAST / LIMITED), colorway, name, price w/ sale styling, expandable size selector, add-to-cart with inline "ADDED ✓" feedback.
- Story band + "The Rules" (drop mechanics) + email capture + footer.

### Cart UX
- Slide-over drawer from the right, `role="dialog"`, focus trap, ESC to close, overlay click to close.
- Line items with SVG thumbnails, quantity steppers (−/n/+), remove, per-line totals.
- **Subtotal, free-shipping progress meter (threshold A$100), and "you save" total** — matches ZENJI's real commerce logic.
- Persisted to `localStorage`; cart count is visible from every section.

### Accessibility & responsiveness
- Semantic landmarks (`header/main/section/footer`), one `h1`, logical heading order.
- Full keyboard support: visible focus rings everywhere, focus trap in drawer, focus restored on close, skip link.
- All controls are real `<button>`/`<a>` elements; size selectors are keyboard-operable radio groups with `aria-checked`.
- Icon-only buttons carry `aria-label`s; decorative art is `aria-hidden`.
- Motion respects `prefers-reduced-motion`; color contrast ≥ 4.5:1 for text.
- Breakpoints: mobile-first; grid 1→2→4 cols; hero stacks under 960px; drawer is full-width on small screens.

---

## 3. Technical stack & rationale

| Choice | Why |
|---|---|
| **Vite 7 + React 19 + TypeScript** | Fast, modern, zero-config DX; standard for hiring-assignment frontends; typecheck via `tsc --noEmit`. |
| **No UI/CSS framework** | Plain hand-written CSS with custom properties = full control over the brand look, tiny bundle, no dependency debt. CSS Modules per component. |
| **Context + `useReducer` for cart** | Canonical, dependency-free state; typed actions; `localStorage` sync in a `useEffect`. |
| **Vite SVG components** | Product art as parameterised React SVG components (unique `useId` gradients) — original, crisp at any DPI, zero asset pipeline. |
| **`@fontsource` fonts** | Self-hosted, deterministic builds, no external font requests. |

Explicitly **excluded** (per brief): backend, auth, payments, CMS, DB, Docker, UI kits, state libraries.

### Project structure
```
├── docs/BRIEF.md            ← this file
├── index.html
├── src/
│   ├── main.tsx             entry
│   ├── App.tsx              page composition
│   ├── styles/              tokens.css, global.css
│   ├── data/products.ts     typed product catalog (6 designs)
│   ├── types.ts             Product, CartItem, actions
│   ├── context/CartContext.tsx  reducer + persistence + derived totals
│   ├── hooks/useCartDrawer.ts   drawer state + focus trap + ESC handling
│   ├── components/
│   │   ├── Header.tsx / CartDrawer.tsx
│   │   ├── Hero.tsx / Marquee.tsx
│   │   ├── Collection.tsx / ProductCard.tsx / SizePicker.tsx
│   │   ├── Story.tsx / Rules.tsx / Newsletter.tsx / Footer.tsx
│   │   └── art/TeeArt.tsx   parameterised original SVG tee artwork
│   └── __tests__/           vitest: cart reducer + integration
```

### Quality gates
- `npm run typecheck` (tsc --noEmit) and `npm test` (vitest) must pass.
- Products, prices, names, and artwork are original; brand voice is inspired, not copied.
