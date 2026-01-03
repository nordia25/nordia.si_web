"use client";

import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Hero Image - static */}
      <div className="absolute inset-[-5%]">
        <Image
          src="/nordia-hero-bg.png"
          alt=""
          fill
          priority
          quality={90}
          className="scale-[1.03] object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
      </div>

      {/* Layer 1: Base overlay - stronger on mobile */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/60 md:bg-black/55"
        aria-hidden="true"
      />

      {/* Layer 2: Center-focused darken (where text is) */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: `radial-gradient(
            ellipse 60% 50% at 50% 45%,
            rgba(0,0,0,0.3) 0%,
            rgba(0,0,0,0.1) 60%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Top/bottom fade for header + footer readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.35) 0%,
            transparent 15%,
            transparent 85%,
            rgba(0,0,0,0.4) 100%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Layer 4: Vignette for cinematic depth */}
      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: `radial-gradient(
            ellipse 90% 80% at 50% 50%,
            transparent 0%,
            rgba(0,0,0,0.25) 100%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Layer 5: Subtle brand tint */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: `linear-gradient(135deg,
            rgba(6,182,212,0.08) 0%,
            transparent 50%,
            rgba(59,130,246,0.06) 100%
          )`,
          mixBlendMode: "overlay",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
