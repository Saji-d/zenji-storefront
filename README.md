<div align="center">

# 禅 ZENJI

### Anime streetwear storefront · React 19 + TypeScript + Vite

**A limited-drop shopping experience — browse, quick-view, size up, cart — wrapped in an editorial campaign aesthetic.**
Built as a frontend hiring assessment: no backend, no payments, pure frontend craft.

[![Live Demo](https://img.shields.io/badge/live_demo-zenji--webstore.vercel.app-ff3d3d?style=for-the-badge&labelColor=0a0a0b)](https://zenji-webstore.vercel.app)
[![Source](https://img.shields.io/badge/source-GitHub-f6f5f3?style=for-the-badge&logo=github&labelColor=0a0a0b)](https://github.com/Saji-d/zenji-storefront)

![React 19](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Vite 7](https://img.shields.io/badge/Vite_7-646cff?style=flat-square&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-27_tests-729b1b?style=flat-square&logo=vitest&logoColor=white)
![axe-core](https://img.shields.io/badge/axe--core_WCAG_AA-4a154b?style=flat-square&logo=deque&logoColor=white)

</div>

---

## ⚡ At a glance

| | | | |
|---|---|---|---|
| **Framework** React 19 | **Language** TypeScript (strict) | **Build** Vite 7 | **Routing** React Router 7 |
| **Styling** CSS Modules + tokens | **Motion** Framer Motion | **State** Context + `useReducer` | **Persistence** `localStorage` |
| **Tests** 27 · 3 suites | **A11y** axe-core scanned | **Fonts** self-hosted Fontsource | **Hosting** Vercel |

---

## ✦ What makes this interesting

> A shop that *feels* like a drop, not a spreadsheet. Every section below is implemented — nothing is mocked up.

<table>
<tr><td width="50%">

### 🛒 The full shopping flow

Ten designs, real commerce logic, zero backend.

- **Quick view** from any card — size picker inside
- **Product pages** with gallery + related designs
- **Cart drawer + cart page** — quantities, removal, subtotal, sale maths
- **Free-shipping meter** at the A$100 threshold
- **Wishlist** persisted across reloads

</td><td width="50%">

### 🎬 An editorial homepage

Campaign first, catalogue second.

- Full-bleed **hero reel** — first frame LCP-preloaded, the rest idle-mounted
- Black **tickertape marquee** closing every phrase with the 禅 mark
- **Ten-design drop wall** with sale / last-units chips
- Kinetic **word-by-word brand statement**
- **Chapter cards** — each tee washed in its own accent colour

</td></tr>
<tr><td width="50%">

### 🫧 A footer that plays back

The wordmark is a **canvas particle field**:

- Dots sampled from an offscreen text render
- Spring-return physics — scatter like marbles on first reveal
- Repels around the cursor; click-and-hold amplifies
- `aria-hidden`, frozen under reduced motion

</td><td width="50%">

### 🔍 Verified, not assumed

Beyond the unit suite, headless QA scripts:

- Screenshot **every route × six viewports** (320 → 1920px)
- Probe for **horizontal overflow**
- Run **axe-core** against WCAG 2.1 AA on key pages
- Verify product images actually decode

</td></tr>
</table>

---

## 🗺 Routes

| Route | Page | Signature detail |
|---|---|---|
| `/` | Campaign homepage | Hero reel · marquee · drop wall · kinetic type |
| `/drop` | The shop | Availability filters + sorting, animated re-layout |
| `/drop/:slug` | Product detail | Gallery · size picker · related designs |
| `/collection` | Collection index | Full run / marked down / final units |
| `/collection/:slug` | Filtered grid | — |
| `/lookbook` | Editorial gallery | Parallax lead · zigzag mosaic |
| `/story` | Brand story | The label's rules, in its voice |
| `/faq` | FAQ accordion | Grounded in the brand's real material |
| `/wishlist` | Saved designs | Persisted, badge count in header |
| `/cart` | Full-page bag | Mirror of the slide-over drawer |
| `*` | 404 | A way back, in brand |

---

## 🧭 UX & interaction

| Interaction | Detail |
|---|---|
| 🛍 **Cart drawer** | Focus-trapped dialog · ESC / overlay close · steppers · savings total |
| ⚡ **Quick view** | Bottom sheet on mobile · split panel on desktop |
| ❤️ **Wishlist** | Heart toggles everywhere · header badge · persists |
| 🔔 **Toasts** | Auto-dismissing "added" confirmation with jump-to-cart |
| 🎚 **Filters** | On sale / last units · spring-animated grid re-flow |
| 🎞 **Scroll choreography** | Scroll reveals · page transitions · scroll-aware header |
| ⌨️ **Keyboard** | Skip link · focus rings · traps + restoration · radio-group size picker |
| 🚫 **Reduced motion** | Reel, marquees, reveals, particles — all collapse to static |

---

## 📐 Responsive & performance

- **Mobile-first CSS** — audited at 320 / 375 / 390 / 430 / 768 / 1024 / 1440 / 1920px, zero horizontal overflow
- **LCP discipline** — one preloaded hero frame, the rest of the reel mounted after first paint in an idle callback
- **Lazy imagery** — below-the-fold images with async decoding
- **Self-hosted fonts** — Anton · Space Grotesk · JetBrains Mono, no runtime font requests
- **No UI framework** — the entire look is CSS Modules over a small custom-property token set

---

## 🧰 Tech stack

| Layer | Choice |
|---|---|
| Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build | [Vite 7](https://vite.dev) |
| Routing | [React Router 7](https://reactrouter.com) |
| Motion | [Framer Motion](https://motion.dev) |
| Styling | CSS Modules · design tokens |
| Fonts | `@fontsource/anton` · `@fontsource/space-grotesk` · `@fontsource/jetbrains-mono` |
| Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) + jsdom |
| QA tooling | `playwright-core` + `axe-core` |

<details>
<summary><strong>📁 Project structure</strong></summary>

```
├── docs/                    # design brief and planning notes
├── public/
│   ├── hero/                # campaign hero frames
│   ├── lookbook/            # lookbook photography
│   └── products/            # product shots (front / back / gallery)
├── scripts/                 # asset pipeline + headless QA scripts
├── src/
│   ├── components/          # Header · Footer · Hero · Marquee · ProductCard
│   │   │                    # QuickView · CartDrawer · FooterSignature · …
│   │   └── motion/          # Reveal · PageTransition
│   ├── context/             # CartContext · WishlistContext
│   ├── data/                # product catalog · FAQ content
│   ├── hooks/               # useModalFocus · useCartDrawer · useRadioGroupKeys · …
│   ├── pages/               # one module per route
│   ├── styles/              # tokens.css · global.css
│   ├── __tests__/           # vitest suites
│   ├── App.tsx              # routes + shell (drawer, toast, transitions)
│   └── main.tsx
├── index.html
└── package.json
```

</details>

---

## 🚀 Getting started

Requires **Node 18+**.

```bash
git clone https://github.com/Saji-d/zenji-storefront
cd zenji-storefront
npm install
npm run dev        # → http://localhost:5173
```

### Quality checks

```bash
npm run typecheck  # strict TS project build (tsc -b)
npm test           # 27 unit / integration tests
npm run build      # typecheck + production bundle → dist/
npm run preview    # serve the production build locally
```

<details>
<summary><strong>Headless QA (optional)</strong></summary>

Uses your installed Chrome channel:

```bash
node scripts/visual-qa.mjs    # screenshots + axe-core + overflow probe
node scripts/routes-qa.mjs    # every route × every viewport, JSON report
```

</details>

---

## ☁️ Deployment

Static Vite SPA on **Vercel** — `npm run build` emits `dist/`, SPA fallbacks via Vercel's framework preset. Runs anywhere static hosting exists.

---

## ⚠️ Limitations

> This is a **demo storefront**, deliberately scoped to frontend craft.

- No real payments, accounts or orders — the cart is client-side only
- Add-to-cart, wishlist and newsletter are demonstrations; nothing leaves your browser except `localStorage`
- Product data is a small typed catalog, not a CMS
- Photography belongs to the referenced brand and serves as placeholder material only

---

## 💠 Credits & inspiration

Design, copy voice and art direction are an **original interpretation** of the identity of [zenji.shop](https://zenji.shop) — an anime streetwear label out of Australia — built as a respectful study of how a drop-based streetwear brand could feel on the web. Not affiliated with or endorsed by ZENJI.

---

<div align="center">

**Built by [Saji-d](https://github.com/Saji-d)**

[Live demo](https://zenji-webstore.vercel.app) · [Source](https://github.com/Saji-d/zenji-storefront) · [zenji.shop](https://zenji.shop)

*Demo storefront concept for ZENJI · Original design & code · No real payments, accounts or orders.*
*Inspired by zenji.shop — not affiliated. Built as a frontend portfolio piece.*

</div>
