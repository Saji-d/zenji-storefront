<div align="center">

<img src="assets/banner.svg" alt="ZENJI storefront banner" width="100%">

<p><code>Anime streetwear storefront built as a frontend assessment: React 19, TypeScript and Vite</code></p>

<p>
<a href="https://zenji-webstore.vercel.app"><img src="https://img.shields.io/badge/LIVE%20DEMO-zenji--webstore.vercel.app-fb7185?style=for-the-badge&labelColor=0B0E1A" alt="Live demo"></a>
<a href="https://github.com/Saji-d/zenji-storefront"><img src="https://img.shields.io/badge/SOURCE-GitHub-8B7CF6?style=for-the-badge&logo=github&logoColor=C084FC&labelColor=0B0E1A" alt="Source"></a>
<img src="https://img.shields.io/badge/STATUS-Frontend%20assessment-6366F1?style=for-the-badge&labelColor=0B0E1A" alt="Status: frontend assessment">
</p>

<p>
<img src="https://img.shields.io/badge/React%2019-0B0E1A?style=flat-square&logo=react&logoColor=8B7CF6" alt="React 19">
<img src="https://img.shields.io/badge/TypeScript-0B0E1A?style=flat-square&logo=typescript&logoColor=8B7CF6" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite%207-0B0E1A?style=flat-square&logo=vite&logoColor=8B7CF6" alt="Vite 7">
<img src="https://img.shields.io/badge/React%20Router%207-0B0E1A?style=flat-square&logo=reactrouter&logoColor=8B7CF6" alt="React Router 7">
<img src="https://img.shields.io/badge/Framer%20Motion-0B0E1A?style=flat-square&logo=framer&logoColor=8B7CF6" alt="Framer Motion">
<img src="https://img.shields.io/badge/Vitest-0B0E1A?style=flat-square&logo=vitest&logoColor=8B7CF6" alt="Vitest">
<img src="https://img.shields.io/badge/axe--core-0B0E1A?style=flat-square&logo=deque&logoColor=8B7CF6" alt="axe-core">
<img src="https://img.shields.io/badge/Vercel-0B0E1A?style=flat-square&logo=vercel&logoColor=8B7CF6" alt="Vercel">
</p>

<p>
<a href="#-overview">Overview</a> · <a href="#-highlights">Highlights</a> · <a href="#-preview">Preview</a> · <a href="#-architecture">Architecture</a> · <a href="#-tech-stack">Tech Stack</a> · <a href="#-getting-started">Getting Started</a> · <a href="#-project-structure">Structure</a> · <a href="#-roadmap">Roadmap</a> · <a href="#-author">Author</a>
</p>

</div>

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Overview

ZENJI is a limited-drop anime streetwear storefront: a campaign homepage, a shop, product pages, a lookbook, a cart and a wishlist. I built it as a frontend hiring assessment, so the goal was craft and polish rather than a real commerce backend.

> **Honest scope.** This is a frontend-only demo. There are no payments, accounts, orders or server. The cart and wishlist live in `localStorage`; the catalog is a small typed data file. Nothing leaves the browser.

The design, copy voice and art direction are an original interpretation of the identity of [zenji.shop](https://zenji.shop), an Australian anime streetwear label. It is a study of how a drop-based brand could feel on the web and is not affiliated with or endorsed by ZENJI.

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Highlights

<table width="100%">
<tr>
<td width="33%" valign="top">

**Quick view**<br/>
Open any product from its card in a bottom sheet on mobile or a split panel on desktop, with the size picker inside.

</td>
<td width="33%" valign="top">

**Cart drawer and page**<br/>
Quantity steppers, removal, sale pricing, subtotal and savings. The drawer is a focus-trapped dialog.

</td>
<td width="33%" valign="top">

**Free-shipping meter**<br/>
A progress bar toward the A$100 threshold. Orders under it use a flat A$9.99 shipping figure.

</td>
</tr>
<tr>
<td width="33%" valign="top">

**Wishlist**<br/>
Heart toggles on cards and product pages, a header badge count and persistence across reloads.

</td>
<td width="33%" valign="top">

**Editorial homepage**<br/>
Hero reel with a preloaded first frame, ticker marquee, drop wall, kinetic brand statement and chapter cards.

</td>
<td width="33%" valign="top">

**Particle footer**<br/>
The wordmark is a canvas particle field that scatters and repels around the cursor. It is hidden from assistive tech and frozen under reduced motion.

</td>
</tr>
<tr>
<td width="33%" valign="top">

**Accessibility**<br/>
Skip link, focus rings, focus traps with restoration, a keyboard-driven radio-group size picker and reduced-motion support.

</td>
<td width="33%" valign="top">

**Tested**<br/>
27 Vitest tests across 3 suites covering cart logic, the app shell and the root.

</td>
<td width="33%" valign="top">

**Audited**<br/>
Headless QA scripts screenshot every route across viewports, probe overflow and run axe-core.

</td>
</tr>
</table>

<details>
<summary><strong>Routes</strong></summary>

| Route | Page |
|---|---|
| `/` | Campaign homepage |
| `/drop` | The shop with availability filters and sorting |
| `/drop/:slug` | Product detail with gallery, size picker and related designs |
| `/collection` and `/collection/:slug` | Collection index and filtered grids |
| `/lookbook` | Editorial gallery |
| `/story` | Brand story |
| `/faq` | FAQ accordion |
| `/wishlist` | Saved designs |
| `/cart` | Full-page bag, mirroring the drawer |
| `*` | Branded 404 |

</details>

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Preview

<div align="center">
<img src="docs/preview.webp" alt="ZENJI storefront preview" width="100%">
</div>

<br/>

<table width="100%">
<tr>
<td width="50%" align="center"><img src="docs/screenshots/home-hero.webp" alt="Homepage hero"><br/><sub>Campaign hero</sub></td>
<td width="50%" align="center"><img src="docs/screenshots/shop.webp" alt="Shop page"><br/><sub>The drop (shop)</sub></td>
</tr>
<tr>
<td width="50%" align="center"><img src="docs/screenshots/product.webp" alt="Product page"><br/><sub>Product page with size picker</sub></td>
<td width="50%" align="center"><img src="docs/screenshots/lookbook.webp" alt="Lookbook"><br/><sub>Lookbook</sub></td>
</tr>
</table>

<div align="center">
<img src="docs/screenshots/mobile-home.webp" alt="Mobile homepage" width="260"><br/><sub>Mobile (375px)</sub>
</div>

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Architecture

State is plain React: two context providers own the cart (a `useReducer` store) and the wishlist, both mirrored to `localStorage`. Pages read from a typed catalog and the router wraps every page in a transition.

```mermaid
flowchart LR
  subgraph Shell["App shell (App.tsx)"]
    R[React Router 7] --> PT[PageTransition]
    H[Header] --- CD[CartDrawer]
    AT[AddedToast]
  end
  PT --> Pages["Pages: Home, Shop, Product, Collections, Lookbook, Story, FAQ, Wishlist, Cart"]
  Pages --> Cards[ProductCard] --> QV[QuickView + SizePicker]
  Data[("data/products.ts<br/>typed catalog")] --> Pages
  QV -- add --> Cart[(CartContext<br/>useReducer)]
  Cards -- toggle --> Wish[(WishlistContext)]
  Cart --> CD
  Cart <--> LS[("localStorage")]
  Wish <--> LS
  Hooks["hooks: useModalFocus, useLockBody, useRadioGroupKeys, useSectionSpy"] -.-> QV
  Hooks -.-> CD
```

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Tech Stack

| Layer | Technologies | Purpose |
|---|---|---|
| UI | React 19, TypeScript (strict) | Components and type safety |
| Build | Vite 7 | Dev server and production bundle |
| Routing | React Router 7 | Eleven routes including a 404 |
| Motion | Framer Motion | Page transitions, reveals, animated grid re-flow |
| Styling | CSS Modules and custom-property tokens | Hand-written styles, no UI framework |
| Fonts | Fontsource: Anton, Space Grotesk, JetBrains Mono | Self-hosted, no runtime font requests |
| Testing | Vitest, Testing Library, jsdom | Unit and integration tests |
| QA | playwright-core, axe-core | Screenshots, overflow probe, WCAG scans |
| Hosting | Vercel | Static SPA deployment |

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Getting Started

Requires Node.js 18 or newer. No environment variables are needed.

```bash
git clone https://github.com/Saji-d/zenji-storefront.git
cd zenji-storefront
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run typecheck  # tsc -b
npm test           # vitest run
npm run build      # typecheck + production bundle in dist/
npm run preview    # serve the production build
```

<details>
<summary><strong>Headless QA scripts (optional)</strong></summary>

The scripts in `scripts/` use `playwright-core` with your installed Chrome. They need the app to be running.

```bash
node scripts/visual-qa.mjs    # screenshots, axe-core and overflow probe
node scripts/routes-qa.mjs    # every route across several viewports
```

</details>

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Project Structure

<details>
<summary><strong>Show the tree</strong></summary>

```text
.
├── docs/                 # design brief and planning notes
├── public/               # hero frames, lookbook and product images
├── scripts/              # asset pipeline and headless QA scripts
├── src/
│   ├── components/       # Header, Footer, Hero, ProductCard, QuickView, CartDrawer, ...
│   │   └── motion/       # Reveal, PageTransition
│   ├── context/          # CartContext, WishlistContext
│   ├── data/             # product catalog and FAQ content
│   ├── hooks/            # useModalFocus, useCartDrawer, useRadioGroupKeys, ...
│   ├── pages/            # one module per route
│   ├── __tests__/        # Vitest suites
│   ├── App.tsx           # routes and shell
│   └── main.tsx
├── index.html
└── package.json
```

</details>

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Roadmap

- [x] Quick view, cart drawer, wishlist and free-shipping meter
- [x] Unit tests and automated accessibility scans
- [ ] Back the catalog with a real API or CMS
- [ ] Real checkout, accounts and order flow
- [ ] End-to-end browser tests in CI

> Photography belongs to the referenced brand and serves as placeholder material only. The source code is published for evaluation and portfolio review and has no open-source licence, so all rights are reserved.

<img src="assets/divider.svg" width="100%" alt="">

## ◈ Author

**Sajidur Rahman Sajid**: Full-Stack Developer and AI engineer from Dhaka.

<p>
<a href="https://www.sajidur.me"><img src="https://img.shields.io/badge/Portfolio-0B0E1A?style=for-the-badge&logo=googlechrome&logoColor=9B8CFA" alt="Portfolio"></a>
<a href="https://www.linkedin.com/in/sajidur-rahman-sajid/"><img src="https://img.shields.io/badge/LinkedIn-0B0E1A?style=for-the-badge&logo=linkedin&logoColor=8B7CF6" alt="LinkedIn"></a>
<a href="https://github.com/Saji-d"><img src="https://img.shields.io/badge/GitHub-0B0E1A?style=for-the-badge&logo=github&logoColor=EEF0FA" alt="GitHub"></a>
<a href="mailto:sajidsajidurrahman99@gmail.com"><img src="https://img.shields.io/badge/Email-0B0E1A?style=for-the-badge&logo=gmail&logoColor=9B8CFA" alt="Email"></a>
</p>

<sub>Built with care as a frontend portfolio piece.</sub>
