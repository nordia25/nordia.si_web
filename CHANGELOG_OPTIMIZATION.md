# CHANGELOG_OPTIMIZATION — Nordia.si

## Summary
Goal: **reduce steady-state CPU/battery overhead** and improve measurement repeatability without changing UI/UX.

Key idea: the site already scores high on Lighthouse; the biggest wins are **runtime churn** reductions (re-renders, timers, unnecessary animations) + better tooling to prevent regressions.

---

## Change sets (what + why + impact + risk)

### 1) Runtime: Footer clock update interval
- **File**: `components/Footer.tsx`
- **Change**: update HH:MM clock every **60s** instead of **1s**
- **Why**: 1s updates trigger unnecessary React work forever
- **Impact**: **60x fewer updates** (60/min → 1/min)
- **Risk**: Low (UI shows only minutes)
- **Tested**: `npm run build`, `npm run smoke`, manual scroll to footer

### 2) Runtime: Device capability detection (single shared snapshot)
- **File**: `hooks/useDeviceDetection.ts`
- **Before**: multiple hooks using `setTimeout(0)` + per-hook state/effects
- **After**: shared `useSyncExternalStore` snapshot + subscriptions to:
  - `resize` / `orientationchange`
  - media query changes (`prefers-reduced-motion`, touch-only pointer query)
- **Why**: fewer mount-time renders, consistent values across components, correct updates on resize
- **Impact**: removes deferred hydration churn; improves correctness on resize
- **Risk**: Low (purely derived booleans, no UI change)
- **Tested**: `npm run build`, `npm run smoke`

### 3) Runtime/CSS: Noise overlay cheaper + paused in background tabs
- **Files**: `components/NoiseOverlay.tsx`, `app/globals.css`
- **Changes**:
  - keyframes simplified (fewer transform positions)
  - animation slowed (less work)
  - add `noise--paused` class toggled via Page Visibility API to pause `::before`
- **Why**: constant animation can waste CPU/battery; background tabs shouldn’t animate
- **Impact**: lower steady-state animation work; zero work in hidden tabs
- **Risk**: Low (subtle visual effect)
- **Tested**: manual tab hide/show; `npm run smoke`

### 4) Assets: more accurate `next/image` hints + slightly lower hero quality
- **Files**: `components/HeroSection.tsx`, `components/WorksSection.tsx`, `components/TeamSection.tsx`, `next.config.mjs`
- **Changes**:
  - better `sizes` for responsive selection (avoid over-downloading)
  - hero quality 85 → 80 (allowed via `images.qualities`)
- **Measured impact (AVIF, w=750)**:
  - baseline q=85: **26,772 B**
  - after q=80: **23,076 B** (≈ **-13.8%**)
- **Risk**: Low (quality drop is visually minimal)
- **Tested**: manual visual check; Lighthouse run (see `PERF_REPORT.md`)

### 5) Build/tooling: repeatable analysis + smoke tests
- **Files**: `package.json`, `scripts/smoke.mjs`, `scripts/perf-bundle.mjs`
- **Changes**:
  - `npm run analyze` uses `next build --webpack` (bundle analyzer compatible)
  - `npm run perf:bundle` prints raw/gzip/brotli totals for `.next/static/chunks`
  - `npm run smoke` builds + starts prod server and checks critical routes
- **Why**: prevent regressions with cheap, automated guardrails
- **Risk**: None (dev tooling only)

---

## Measured before/after (summary)
See `PERF_REPORT.md` for full methodology and artifacts.

- **Lighthouse (desktop)**: 0.96 → 0.96 (initial-load already excellent)
- **Bundle totals (brotli)**: ~227.4 KB → ~227.8 KB (no meaningful change)
- **Steady-state CPU**: reduced via timer + animation + hook churn reductions (not strongly reflected in Lighthouse)

---

## Files changed
- `package.json`
- `next.config.mjs`
- `app/globals.css`
- `hooks/useDeviceDetection.ts`
- `components/Footer.tsx`
- `components/NoiseOverlay.tsx`
- `components/HeroSection.tsx`
- `components/WorksSection.tsx`
- `components/TeamSection.tsx`
- `components/SplitText.tsx` (bug fix)
- `components/AppWrapper.tsx` (lazy-load + timeout removal)
- `scripts/smoke.mjs`
- `scripts/perf-bundle.mjs`
- `PERF_REPORT.md`

---

### 6) Bug fix: SplitText cleanup
- **File**: `components/SplitText.tsx`
- **Before**: `ScrollTrigger.getAll().forEach((t) => t.kill())` killed ALL ScrollTriggers globally
- **After**: Only kills component's own ScrollTrigger instance
- **Why**: Prevent breaking other components' animations
- **Impact**: Proper cleanup without side effects
- **Risk**: None (bug fix)
- **Tested**: `npm run smoke`, manual animation check

### 7) Lazy-load ContactForm
- **File**: `components/AppWrapper.tsx`
- **Before**: Always imported and mounted
- **After**: `dynamic()` import with `ssr: false`
- **Why**: Reduce initial bundle size (ContactForm + GSAP animations deferred)
- **Impact**: Faster initial load; component loads on first open
- **Risk**: Low (slight delay on first open acceptable)
- **Tested**: `npm run smoke`, manual form open

### 8) Remove setTimeout(0) from AppWrapper
- **File**: `components/AppWrapper.tsx`
- **Before**: `setTimeout(() => {...}, 0)` for device detection
- **After**: Synchronous device detection
- **Why**: Faster initial render, consistent with device capability store
- **Impact**: Removes unnecessary async delay
- **Risk**: None (device detection is synchronous and safe)
- **Tested**: `npm run smoke`, manual preloader check

---

## PR / commit plan (logical change sets)
1. **Instrumentation & guardrails**: `perf:bundle`, `smoke`, analyzer workflow
2. **Runtime**: footer clock + device capability store
3. **Assets**: `next/image` sizing + hero quality
4. **CSS/runtime**: noise overlay optimization + background pause
5. **Bug fixes**: SplitText cleanup + ContactForm lazy-load + AppWrapper timeout removal
6. **Regression pass**: run smoke + lighthouse; update `PERF_REPORT.md`

