# ZENJI UPGRADE PLAN — "concept → fashion commerce"

Decisions (user-approved): official ZENJI product photos self-hosted locally; framer-motion for motion.

## Asset strategy
- Scrape image URLs from zenji.shop (public Shopify CDN) via headless Chrome → download → `public/products/`, `public/lookbook/`.
- Catalog renames to the 6 real Origin Drop products so photos match names:
  Blue Flame, Demon Blood, Will of the Sun, Warrior Spirit, Bushido, Paradise Spirit.
- TeeArt SVG engine stays as offline/error fallback + artKeyFor tests.

## Build order
1. **Assets**: scrape, download, verify sizes (~≤250KB each, webp preferred)
2. **Data/types**: `images: { front, back? }`, featured layout hints, wishlist types
3. **Primitives**: `Reveal` (framer-motion whileInView), `Grain` overlay, `useSectionSpy`
4. **Phase 1 Hero**: full-bleed layered photo treatment, ken-burns/crossfade, overlay+scanlines,
   editorial type stack (transmission meta → headline → lede → CTAs → drop meta), parallax
5. **Phase 2/3 Cards**: front→back crossfade on hover, scale+overlay, QUICK VIEW + wishlist heart,
   badges stay readable, zero layout shift (fixed aspect boxes)
6. **Phase 4 Grid**: featured spans / asymmetry desktop; intentional 1–2 col mobile
7. **Phase 5 QuickView**: gallery + thumbs, size/qty, add, wishlist, focus trap + ESC + scroll lock,
   bottom-sheet on mobile (reuse generalized focus hook)
8. **Phase 6 Lookbook**: THE ORIGIN DROP editorial composition (large + 2 small + wide)
9. **Phase 7 Story**: 01/ORIGIN 02/THE DROP 03/THE RULES with imagery + oversized type
10. **Phase 9 Marquee**: large kinetic type, contained, reduced-motion fallback
11. **Phase 10 Nav**: Drop/Collection/Lookbook/Story + wishlist + cart, active section,
    transparent→solid, mobile drawer menu
12. **Phase 12**: wishlist context (localStorage), cart count pop animation, add feedback
13. **Tests**: keep 14 passing, add wishlist + quickview coverage
14. **QA**: typecheck, tests, build, visual QA @ 320–1440, pixel probe, a11y, console, screenshots

## Non-goals
No backend/auth/payments; no new deps beyond framer-motion; no layout-shift animations.
