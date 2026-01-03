"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 0);

    // Check if mobile - skip animation (with safe matchMedia)
    let isMobile = false;
    try {
      isMobile =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        window.innerWidth < 768;
    } catch {
      isMobile = window.innerWidth < 768;
    }
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const video = videoRef.current;
      const section = sectionRef.current;

      if (!video || !section) return;

      // Parallax effect - video moves up as you scroll, revealing bottom part
      gsap.fromTo(
        video,
        { yPercent: -30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 hidden h-[50vh] overflow-hidden md:block md:h-[60vh]"
    >
      {/* Video container */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          title="Nordia studio - kreativni proces"
          aria-label="Video ozadje s prikazom kreativnega procesa"
          className="absolute -bottom-[40%] h-[180%] w-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Vaš brskalnik ne podpira HTML5 videa.
        </video>

        {/* Subtle color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10 mix-blend-overlay" />
      </div>

      {/* Top transition - longer, smoother fade */}
      <div className="via-[var(--background)]/80 absolute left-0 right-0 top-0 z-10 h-48 bg-gradient-to-b from-[var(--background)] to-transparent" />

      {/* Bottom transition - longer, smoother fade */}
      <div className="via-[var(--background)]/80 absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-t from-[var(--background)] to-transparent" />

      {/* Side vignette for premium feel */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--glow-color)_100%)]" />
    </section>
  );
}
