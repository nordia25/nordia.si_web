"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContactForm } from "@/contexts/ContactFormContext";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Spletne strani",
  "Spletne trgovine",
  "AI avtomatizacije",
];

/**
 * Hero section with parallax background image
 * - Desktop: SVG mask cutout reveals the image with parallax
 * - Mobile: Clean black background with blue accent, no image
 *
 * Uses CSS media queries for instant correct render (no JS flash)
 */
export default function HeroSectionClient() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { openContactForm } = useContactForm();

  // Parallax effect for background - desktop only
  useEffect(() => {
    const bg = bgRef.current;
    const section = sectionRef.current;
    if (!bg || !section) return;

    // Only run on desktop
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    if (!mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      gsap.to(bg, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Parallax background - DESKTOP ONLY (CSS hidden on mobile) */}
      <div className="fixed inset-0 z-0 hidden overflow-hidden lg:block">
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ top: "0", height: "120%" }}
        >
          <Image
            src="/works/nordia-hero-bg.jpg"
            alt=""
            fill
            priority
            quality={85}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Hero section */}
      <section
        ref={sectionRef}
        id="hero"
        className="relative z-10 min-h-screen bg-black lg:bg-transparent"
        style={{ contain: "layout style paint" }}
      >
        {/* Desktop: SVG mask cutout effect - hidden on mobile */}
        <svg className="absolute inset-0 hidden h-full w-full lg:block">
          <defs>
            <mask id="textCutout">
              <rect width="100%" height="100%" fill="white" />
              <rect x="5%" y="34%" width="1.5%" height="66%" fill="black" />
              <text
                x="8%"
                y="58%"
                textAnchor="start"
                dominantBaseline="middle"
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(2.8rem, 9vw, 10rem)",
                  letterSpacing: "-0.04em",
                  fill: "black",
                }}
              >
                PRIHODNOSTI
              </text>
            </mask>
          </defs>

          <rect width="100%" height="100%" fill="black" mask="url(#textCutout)" />

          <text
            x="8%"
            y="42%"
            textAnchor="start"
            dominantBaseline="middle"
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2.8rem, 9vw, 10rem)",
              letterSpacing: "-0.04em",
              fill: "white",
            }}
          >
            DIGITALNE REŠITVE
          </text>
        </svg>

        {/* Mobile: Award-winning minimal design - hidden on desktop */}
        <div className="absolute inset-0 flex flex-col justify-between px-6 py-24 lg:hidden">
          {/* Main headline - centered vertically */}
          <div className="flex flex-1 flex-col justify-center">
            {/* Small label */}
            <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
              Digitalna agencija
            </p>

            {/* Main title */}
            <h1 className="font-display font-bold uppercase leading-[1.15] tracking-tight">
              <span
                className="block text-white"
                style={{ fontSize: "clamp(2.5rem, 13vw, 5rem)" }}
              >
                Digitalne
              </span>
              <span
                className="block text-white"
                style={{ fontSize: "clamp(2.5rem, 13vw, 5rem)" }}
              >
                rešitve
              </span>
              <span
                className="block text-blue-500"
                style={{ fontSize: "clamp(2.5rem, 13vw, 5rem)" }}
              >
                prihodnosti.
              </span>
            </h1>

            {/* Mobile CTA Button - under title */}
            <div className="cta-hero-wrapper mt-10">
              <button onClick={openContactForm} className="cta-hero group">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Pogovorimo se
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Services at bottom - vertical list */}
          <div className="flex flex-col gap-1">
            {services.map((service, i) => (
              <span
                key={i}
                className="text-xs uppercase tracking-[0.15em] text-white/50"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop CTA Button - next to PRIHODNOSTI text */}
        <div
          className="absolute right-[19%] z-20 hidden items-center lg:flex"
          style={{ top: "58%", transform: "translateY(-50%)" }}
        >
          <div className="cta-hero-wrapper">
            <button onClick={openContactForm} className="cta-hero group">
              <span className="relative z-10 flex items-center gap-3">
                Pogovorimo se
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Desktop services list - bottom */}
        <div
          className="absolute bottom-8 left-[8%] z-20 hidden lg:flex"
        >
          <div className="flex items-center" style={{ height: "clamp(2rem, 4vw, 3.5rem)" }}>
            {services.map((service, i) => (
              <span
                key={i}
                className="group/service relative cursor-pointer font-display uppercase text-white/90 transition-colors duration-300 hover:text-white"
                style={{
                  fontSize: "clamp(0.7rem, 1.68vw, 1.43rem)",
                  letterSpacing: "0.05em",
                  marginLeft: i === 0 ? 0 : "clamp(1rem, 4vw, 4rem)",
                  marginRight: "clamp(1rem, 4vw, 4rem)",
                }}
              >
                {service.toUpperCase()}
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-white transition-all duration-300 ease-out group-hover/service:w-full" />
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
