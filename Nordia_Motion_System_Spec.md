# Nordia Motion System – Technical Specification

## Overview
This document defines the motion design system for the **Nordia** website, focusing on smooth, high-performance animations using GSAP (GreenSock) and ScrollTrigger within a Next.js (App Router) environment. The goal is to deliver “wow” motion effects (like the **Nordia Lightfield** fake-3D parallax hero) that run fluidly even on weaker devices, without resorting to heavy WebGL/3D. All animations must degrade gracefully (supporting `prefers-reduced-motion` and low-power modes) and maintain excellent performance (60fps where possible) without harming Core Web Vitals.

---

## Best Practices for Smooth Browser Animations (DOs & DON'Ts)

- **DO** animate **transform** properties (e.g. `translate`, `scale`, `rotate`) and **opacity** instead of layout-affecting properties. Transforms and opacity are GPU-accelerated and don’t trigger reflow, so they’re much cheaper to animate. For example, use `transform: translateY()` (or GSAP’s `y`/`x` properties) rather than changing `top`/`left` position in an animation.  
- **DON’T** animate **layout or geometry properties** such as `width`, `height`, `top`, `left`, `margin`, or `padding` whenever possible. Animating these forces the browser to recalculate layout and repaint on every frame, leading to jank. A common issue: scroll-tied animations that tween `width/height` continuously; switching to scale transforms typically fixes stutter.  
- **DO** prefer **compositing** (GPU layers) for heavy animations. Animations of transforms and opacity typically run in the compositor thread, bypassing expensive paints. You can explicitly promote an element to a layer with `will-change: transform` or a 3D transform (`translateZ(0)`), but **use `will-change` sparingly**. Only apply `will-change` shortly before an element animates and remove it after; overusing it can waste memory and actually hurt performance. It should be a last resort to fix known bottlenecks.  
- **DON’T** use heavy CSS effects on animations. **Avoid filters** (e.g. blur, brightness) and **blend modes** during animations; these are notoriously slow, especially in Safari. If a design calls for a blur or complex effect, consider using a static image of the effect or limiting its usage.  
- **DO** keep the **animated area** as small as possible. The more pixels that change each frame, the more work for the browser. For example, animating a small overlay or an icon is fine, but animating a full-screen background every frame can tax the GPU. Where large visuals must animate (e.g. full-width hero parallax), minimize how much changes (subtle movements) and constrain paint regions.  
- **DO** mark non-interactive animated elements as **pointer-events: none** during animations. This prevents unnecessary hover/click hit-testing while they animate, reducing overhead.  
- **DON’T** animate elements that are **off-screen or invisible**. It’s wasteful and can degrade performance. With ScrollTrigger, fire animations only when elements enter the viewport (sensible start positions, or `ScrollTrigger.batch` for batched reveals). If an animation loops continuously (e.g. gentle background drift), pause it when the element is off-screen (GSAP control or `IntersectionObserver`).  
- **DO** stagger and orchestrate multiple animations. Rather than animating many things at once (CPU/GPU spike), start them with slight delays or sequence them in a GSAP timeline. Staggered entrances distribute work across frames and feel smoother.  
- **DON’T** run CSS transitions or other animation on an element **while GSAP is animating it**. This can cause conflicts and additional layout recalculations. For each element, pick one “owner” of motion (GSAP or CSS) to avoid double-animating.  
- **DO** use GSAP’s built-in properties and utils for performance: `x`, `y`, `scaleX`, `scaleY`, etc., instead of animating generic `transform` strings. Use `ScrollTrigger.batch()` and `ScrollTrigger.matchMedia()` for efficient, conditional motion sets (mobile vs desktop, reduced-motion vs normal) without unnecessary re-creation of triggers.  
- **DO** preload or optimize images used in animations. Large images can cause **decode or paint jank** when first appearing. Use Next.js Image optimization (responsive sizes, WebP/AVIF) for animated images. Consider lower-res placeholders (blur) and lazy-load below-the-fold images so they don’t decode all at once.  
- **DON’T** let animations block the initial page render. Load critical content first, then start animations. It’s better to render content quickly and animate after than to delay everything for choreographed entrances. Use **progressive enhancement**: static content first, motion layered on after initial paint.  
- **DO** account for **React and Next.js** specifics. Components containing GSAP must be client-side (`"use client"`). Initialize animations in `useLayoutEffect` (or GSAP React `useGSAP()` hook) and scope them via `gsap.context()` for automatic cleanup on unmount.  
- **DON’T** forget cleanup. In Next.js App Router, route transitions unmount pages; lingering ScrollTriggers and tweens can continue running or throw warnings. Use the GSAP context cleanup (`context.revert()`) or kill triggers scoped to the page/section during cleanup. Avoid global `killAll()` unless you truly intend to wipe everything.  
- **DO** call **`ScrollTrigger.refresh()`** after initialization (especially if content heights or images might shift layout). This ensures ScrollTrigger calculates correct positions and prevents early/late triggers.  
- **DON’T** ignore Safari and resolution quirks. Safari often struggles with filters and large repaint areas. Also test on 4K screens: large moving regions (parallax backgrounds) can drop frames; be ready to reduce motion complexity at very large resolutions or disable certain effects to maintain smoothness.

> Guiding principle: the site must feel premium and smooth. If an effect risks jank, we simplify it.

---

## Section-by-Section Animation Timeline & Triggers

The following table outlines planned animations per section, with triggers and fallback behaviors.

| **Section** | **Animations & Effects** | **Trigger & Timing** | **Fallback (Reduced Motion & Mobile)** |
|---|---|---|---|
| **Hero (Lightfield)** | **On Load:** Reveal headline + sub with smooth fade-in + slight rise (≈20px).  
**Parallax Scroll:** Multi-layer Lightfield background moves at different speeds (faux depth).  
**Mouse Move (Desktop):** subtle reactive shift/tilt based on cursor.  
**CTA Hover:** micro feedback (scale/glow). | **Load:** start after first render (e.g. 0.3–0.6s after mount).  
**Scroll:** ScrollTrigger scrub for each layer (progress tied to scroll).  
**Mouse:** throttled listener; run only when hero in view; use quick setters to avoid per-event allocations.  
**Hover:** pointer enter/leave. | **Reduced Motion:** no parallax, no cursor motion; text appears (optionally quick fade).  
**Low-Power/Mobile:** static hero image; disable cursor logic; keep micro minimal. |
| **Why Nordia** | Title + content blocks fade in + rise; staggered reveals of 3 pillars; optional subtle section transition (divider/gradient). | ScrollTrigger on section enter (e.g. top at 80% viewport). Title first, then stagger pillars (0.1–0.2s). `once: true`. | Reduced motion: no rise/stagger; appear together or quick fade. Mobile: keep immediate readability; simplify transitions. |
| **Capabilities** | Grid cards pop in (opacity + scale 0.95→1.0) with grid stagger. Hover micro: icon nudge/rotate or card lift (transform only). Optional counters/bars animate on enter. | ScrollTrigger start ≈75–80% viewport. Batch or stagger. Hover on desktop only. Counters trigger once on enter. | Reduced motion: no counters; show final values. Hover becomes simple highlight or none. Mobile/low-power: reduce to fade only or skip per-card staggering. |
| **Process** | Story sequence: steps reveal progressively. Optional pinned “timeline” with scrub; connector line draws with scroll progress (scale/clip/SVG stroke). | ScrollTrigger pin + scrub (desktop) OR individual triggers per step (mobile). If pinned, allocate scroll distance per step and keep transforms only. | Reduced motion: no pin/scrub; simple static list. Mobile/low-power: disable pin; normal scroll with light fades; connector static or hidden. |
| **Testimonials** | Carousel crossfade or slide between 2 quotes; auto-rotate optional; pause on hover; on scroll, reveal block. Optional avatar reveal (clip/zoom). | Timer-driven transitions, but pause when off-screen (ScrollTrigger toggles play/pause). Manual prev/next triggers fast tween (~0.4–0.6s). | Reduced motion: no auto-rotate; show both quotes or manual switch without animation. Mobile/low-power: disable auto; use simple fade; keep images small. |
| **About** | Team photos fade + zoom (0.9→1.0) stagger; text reveals; optional minimal logo/graphic intro; hover name overlay on photos. | ScrollTrigger on enter. Stagger photos 0.15–0.25s. Hover overlay uses opacity. | Reduced motion: static content; keep name overlay as simple visibility toggle. Mobile: names always visible or tap-to-toggle; simplify graphics. |
| **Contact** | Section fade-in. Form focus interactions (label float/highlight). Button hover press micro (scale). Optional slight fade-out of previous section to focus contact. | ScrollTrigger on enter (simple). Focus events for inputs (fast 0.15–0.25s). Hover/click for button. | Reduced motion: minimal/instant reveals; keep functional focus state. Mobile/low-power: avoid complex focus animations (keyboard jank risk). |

**Notes on orchestration**
- Prefer **timelines** for each section, triggered by ScrollTrigger.
- Use short, consistent durations: **0.35–0.7s** for entrances; hover **0.15–0.25s**.
- Use gentle eases (e.g. `power2.out` for reveals, `power1.inOut` for transitions).
- Avoid multiple continuous effects at once (e.g. don’t run parallax + multiple floating loops simultaneously).

---

## Fallback Strategies & Adaptive Modes

### 1) Prefers Reduced Motion
- Respect `prefers-reduced-motion: reduce`.
- Disable decorative motion: parallax, scrubs, pins, cursor-reactive motion, auto-rotating carousels.
- Keep functional UI feedback (focus states) but reduce movement (prefer opacity/color over translation).
- Implement via GSAP `matchMedia()` (define “motion” set only for `no-preference`).

### 2) Mobile Simplification
- Disable scroll pinning and long scrub sequences (often feels like scroll-jack on mobile).
- No hover-only affordances; provide tap states or always-visible labels.
- Shorter and fewer animations. Prefer **fade-only** reveals.
- Hero Lightfield collapses to **single static image** or 2-layer maximum with very subtle scroll parallax (optional).

### 3) Low-Power / Lite Mode
- Heuristics: low `deviceMemory`, low `hardwareConcurrency`, Save-Data hint, or measured low FPS during initial interaction.
- In low-power mode:
  - Disable parallax and any continuous loops.
  - Replace complex sequences with static.
  - Avoid counters and SVG stroke animations.
  - Optionally provide a manual “Motion: On/Off” toggle for user control.

### 4) Progressive Enhancement
- Content should render correctly even if GSAP never runs.
- Avoid CSS that hides content unless JS sets it intentionally.
- Always ensure final states are readable and stable without animation.

---

## Performance Success Criteria

### Target Lighthouse & Web Vitals Goals
- **Performance**: 90+ desktop, ~80+ mobile (aspirational, motion-aware).
- **LCP**: < 2.5s (hero must not block paint).
- **CLS**: < 0.1 (no layout shifts from motion; reserve space).
- **TBT**: < 150ms (no long scripting tasks during init).

### Practical Smoothness Checks
- **FPS target**: 60fps on modern hardware; avoid persistent dips under ~50fps.
- **Frame budget**: keep animation work under ~16ms per frame.
- Use Chrome DevTools Performance:
  - Verify minimal “Layout” and “Recalculate Style” during animations.
  - Confirm transforms/opacity are dominating, not paints.
- Ensure animations pause when off-screen (looping hero effects, testimonial rotation).

### Real-Device Sanity Tests
- Test on:
  - Low/mid Windows laptop (integrated GPU),
  - Older iPhone / mid Android,
  - Safari (macOS + iOS),
  - High-resolution monitors (4K).
- Pass criteria:
  - Scroll does not “stick” or lag.
  - Interactions remain responsive.
  - Reduced-motion mode feels calm and complete.

---

## “Proof” Patterns from Production (30% references → Nordia translation)

### Locomotive-style minimal motion
**What works:** restrained animation, limited fonts/colors, playful micro only (letter/typography micro-transitions), minimal heavy effects.  
**Why it works:** content loads fast; motion is layered after render; fewer moving parts reduces jank risk.  
**Translate to Nordia:** keep Lightfield as the “hero wow,” then use quiet editorial reveals + micro-interactions elsewhere.

### Immersive/Awwwards “story scroll” without WebGL
**What works:** scroll-driven storytelling via pinned sections and progressive reveals (without full 3D).  
**Why it works:** controlled sequencing and transforms-only motion can feel cinematic while staying relatively cheap.  
**Translate to Nordia:** use a lightweight pinned Process on desktop only; mobile uses linear reveals.

### Vercel/modern product sites
**What works:** progressive enhancement, subtle motion, fast initial render, clear reductions on mobile.  
**Why it works:** performance-first decisions preserve CWV, but micro motion keeps the experience premium.  
**Translate to Nordia:** treat all motion as optional layers; define breakpoints and reduced-motion variants from the start.

---

## Implementation Notes (No code, but patterns)

- Use **section-scoped GSAP contexts** so each section cleans up on unmount.
- Use `matchMedia()` to define:
  - desktop/full motion,
  - mobile simplified motion,
  - reduced motion.
- Avoid global triggers; scope and track triggers per section.
- Refresh triggers after images/layout settle (one `refresh()` after setup).
- Use batching for repeated items (capability cards, repeated text lines) to avoid many independent triggers.

---

**End of document.**
