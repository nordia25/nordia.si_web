# PERF_REPORT — Nordia.si (Ultra optimization + Google/Apple quality)

## Environment
- **Date**: 2026-01-05
- **OS**: macOS (darwin 25.1.0)
- **Node**: v20+
- **Next.js**: 16.0.10
- **React**: 19.2.3
- **Default bundler**: Turbopack (production builds)
- **Analyzer bundler**: Webpack (`npm run analyze`)

---

## 1) Repo map (high level)
- `app/`: Next.js App Router (`layout.tsx`, `page.tsx`, static routes like `robots.ts`, `sitemap.ts`)
- `components/`: Client UI + GSAP/Lenis (`AppWrapper`, `HeroSection`, `WorksSection`, `Footer`, etc.)
- `hooks/`: Runtime capability detection (`useDeviceDetection.ts`)
- `contexts/`: UI state (`PreloaderContext`, `ContactFormContext`)
- `public/`: Static assets (hero + works + team images)
- `scripts/`: Added measurement + smoke scripts (`smoke.mjs`, `perf-bundle.mjs`)

---

## 2) Critical paths / hotspots

### Startup (critical)
- `app/layout.tsx`: local font preload, hero image preload, `@vercel/speed-insights`
- `components/AppWrapper.tsx`: preloader gating + smooth scroll + noise overlay + contact form mounting
- `components/HeroSection.tsx`: hero `next/image` (LCP candidate) + GSAP entrance for service stripes

### Below-the-fold (deferred)
- `MissionSection`, `WorksSection`, `TeamSection`, `Footer` are dynamically imported in `app/page.tsx`

---

## 3) Measurement system (repeatable)

### Build + bundle
- **Build**: `npm run build`
- **Bundle compression totals (raw/gzip/brotli)**: `npm run perf:bundle`
- **Webpack bundle analyzer (client/edge/node)**: `npm run analyze`
  - Outputs:
    - `.next/analyze/client.html`
    - `.next/analyze/edge.html`
    - `.next/analyze/nodejs.html`

### Smoke (production)
- `npm run smoke`
  - Builds + starts `next start` on an available port and checks:
    - `/`
    - `/zasebnost`
    - `/robots.txt`
    - `/sitemap.xml`

### Lighthouse
Commands used (desktop preset, headless Chrome):
- `npx --yes lighthouse http://localhost:<PORT> --output=json --output-path=./lighthouse-report.<name>.report.json --preset=desktop --quiet --chrome-flags="--headless --no-sandbox"`
- `npx --yes lighthouse http://localhost:<PORT> --output=html --output-path=./lighthouse-report.<name>.report.html --preset=desktop --quiet --chrome-flags="--headless --no-sandbox"`

Notes:
- `lighthouse-report.report.json` in the repo is a **failed** run (runtime error `NO_FCP`). Baseline for this change set is re-captured in `lighthouse-report.baseline.report.json`.

---

## 4) Baseline vs After (measured)

### 4.1 Lighthouse (desktop preset)
| Metric | Baseline | After | Δ |
|---|---:|---:|---:|
| Performance score | 0.96 | 0.96 | 0.00 |
| FCP | 0.2s | 0.2s | ~0ms |
| LCP | 1.385s | 1.366s | -19ms |
| INP | 16ms | 23ms | +7ms |
| TBT | 0ms | 0ms | 0ms |
| CLS | 0 | 0 | 0 |

Reports:
- **Baseline**: `lighthouse-report.baseline.report.json` (served from `http://localhost:3200/`)
- **After**: `lighthouse-report.after.report.json` (served from `http://localhost:3100/`)

Interpretation:
- The site is already very fast on initial load; most wins in this change set are **steady-state CPU/battery** improvements (not strongly reflected in Lighthouse).

### 4.2 JS bundle (static chunks totals)
Measured via `npm run perf:bundle`:

| Metric | Baseline | After | Δ |
|---|---:|---:|---:|
| Total raw | 816.7 KB | 817.8 KB | +1.1 KB |
| Total gzip | 258.2 KB | 258.6 KB | +0.4 KB |
| Total brotli | 227.4 KB | 227.8 KB | +0.4 KB |

Interpretation:
- Change set targets **runtime overhead** and correctness; bundle size remained effectively unchanged (± noise).

### 4.3 Hero delivered bytes (Next Image Optimizer)
Measured via `/_next/image` with `Accept: image/avif,image/webp,*/*`:

| Variant | Baseline (q=85) | After (q=80) | Δ |
|---|---:|---:|---:|
| w=750 AVIF | 26,772 B | 23,076 B | -3,696 B (~-13.8%) |
| w=1200 AVIF | 45,244 B | 39,038 B | -6,206 B (~-13.7%) |

Interpretation:
- Source JPG is 728 KB, but **delivered AVIF is ~23–39 KB** for typical viewports.

---

## 5) Changes shipped (by category)

### Build / tooling
- **Webpack bundle analyzer workflow**: `package.json` script `analyze` uses `next build --webpack`
- **Perf tooling**: `scripts/perf-bundle.mjs` + `npm run perf:bundle`
- **Smoke test**: `scripts/smoke.mjs` + `npm run smoke`

### Runtime performance / battery
- **Footer clock**: 1s → 60s updates (HH:MM UI) to cut unnecessary re-renders
- **Device detection**: unified `useSyncExternalStore` snapshot with resize/media-query subscriptions (removes setTimeout-based hydration churn)
- **Noise overlay**:
  - Simplified keyframes + fewer steps
  - Pauses when tab is hidden (`noise--paused`)

### Assets
- Improved `next/image` `sizes` hints to prevent over-downloading
- Reduced hero image quality 85 → 80 (allowed via `next.config.mjs` `images.qualities`)

---

## 6) Performance budgets (regression guard)
Budgets are set based on current measured values (with headroom).

| Budget | Target |
|---|---|
| Total JS brotli (chunks) | ≤ 250 KB (current ~228 KB) |
| Lighthouse LCP (desktop) | ≤ 1.6s (current ~1.4s) |
| Lighthouse INP (desktop) | ≤ 200ms (current ~16–23ms) |
| Lighthouse CLS | ≤ 0.05 (current 0) |
| Lighthouse TBT | ≤ 50ms (current 0ms) |

---

## 7) Open opportunities (next best candidates)
No UI/UX changes proposed here; these are options if we want more savings.

- **Option A (safe)**: Lazy-load `ContactForm` + `Navigation` overlays (reduce initial JS)
- **Option B (aggressive)**: Further split GSAP usage (centralize + load ScrollTrigger only where needed; prefetch on idle) to reduce main-thread cost on slower devices
- Convert large `public/` JPGs to AVIF/WebP sources (reduces disk + Next image processing cost)

