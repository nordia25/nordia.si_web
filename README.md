# Nordia — Premium Digitalna Agencija

Sodobna, visoko-zmogljiva spletna stran za digitalno agencijo Nordia. Zgrajena z najnovejšimi spletnimi tehnologijami za zagotavljanje vrhunske uporabniške izkušnje, gladkih animacij in bliskovite hitrosti.

![Nordia Hero](public/og-image.jpg)

## 🛠 Tehnološki Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, RSC, Streaming SSR)
- **UI Knjižnica**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animacije**: [GSAP](https://greensock.com/gsap) & [ScrollTrigger](https://greensock.com/scrolltrigger)
- **Smooth Scroll**: [Lenis](https://lenis.studio/)
- **Email**: [Resend](https://resend.com/)
- **Jezik**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Zagon Projekta

### Namestitev odvisnosti

```bash
npm install
```

### Razvojni način (Development)

```bash
npm run dev
```
Stran bo dostopna na `http://localhost:3000`.

### Produkcijski Build

```bash
npm run build
npm start
```

## ⚡ Performance Optimizacije

Projekt vsebuje napredne optimizacije za doseganje "Lighthouse 100" rezultatov in občutka native aplikacije:

- **Ultra-lightweight Placeholders**: Base64 placeholderji za slike so zamenjani z optimiziranimi 1x1 GIF-i za minimalen bundle size.
- **GSAP & Lenis Integracija**: Gladko drsenje (Lenis) sinhronizirano z GSAP ScrollTrigger za brezhibne animacije.
- **RSC & Streaming**: Kritična vsebina (Hero) se naloži takoj, ostale sekcije (Mission, Works, Team) se pretakajo (streamajo) in so "hydrated" asinhrono.
- **Resource Hints**: `preload` za kritične slike (LCP) in pisave.
- **CSS Containment**: Uporaba `contain: layout style` za izolacijo renderinga težkih sekcij.
- **GPU Acceleration**: `will-change` in `transform: translateZ(0)` za animirane elemente.
- **Bundle Analysis**: Redno preverjanje velikosti JS paketov (`npm run perf:bundle`).

## 📂 Struktura Projekta

```
/app              # Next.js App Router strani in layouti
/components       # React komponente (Server & Client)
  /icons          # Optimizirane SVG ikone
/lib
  /data           # Centralizirani podatki (Text, Links, Config)
/hooks            # Custom React hooki (useDeviceDetection, itd.)
/scripts          # Pomožna orodja (smoke test, perf check)
/public           # Statični asseti (slike, fonti)
```

## 🛡️ Kvaliteta Kode

- **Strict TypeScript**: Popolna tipizacija brez `any`.
- **ESLint & Prettier**: Konsistenten stil in preprečevanje napak.
- **Accessibility (a11y)**: `aria-labels`, `prefers-reduced-motion` podpora, semantični HTML.
- **Smoke Testing**: Avtomatiziran test (`scripts/smoke.mjs`) preveri delovanje produkcijskega strežnika pred deployem.

## 📝 Skripte

- `npm run dev`: Zažene razvojni strežnik.
- `npm run build`: Zgradi produkcijsko optimizirano aplikacijo.
- `npm run start`: Zažene produkcijski strežnik.
- `npm run lint`: Preveri kodo za napake.
- `npm run smoke`: Zgradi projekt in izvede hitri "smoke test" (preveri HTTP status kod in vsebino).
- `npm run perf:bundle`: Analizira velikost generiranih JS datotek.

---

© 2026 Nordia d.o.o. Vse pravice pridržane.
