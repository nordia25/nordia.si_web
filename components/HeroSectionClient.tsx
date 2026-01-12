"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Spletne strani",
  "Spletne trgovine",
  "AI avtomatizacije",
  "3D tiskanje",
];

/**
 * Hero section with parallax background image
 * - Desktop: SVG mask cutout reveals the image with parallax
 * - Mobile: Clean black background with blue accent, no image
 */
export default function HeroSectionClient() {
  const [isDesktop, setIsDesktop] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Parallax effect for background - desktop only
  useEffect(() => {
    if (!isDesktop) return;

    const bg = bgRef.current;
    const section = sectionRef.current;
    if (!bg || !section) return;

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
  }, [isDesktop]);

  return (
    <>
      {/* Parallax background - DESKTOP ONLY */}
      {isDesktop && (
        <div className="fixed inset-0 z-0 overflow-hidden">
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
      )}

      {/* Hero section */}
      <section
        ref={sectionRef}
        id="hero"
        className="relative z-10 min-h-screen bg-black lg:bg-transparent"
        style={{ contain: "layout style paint" }}
      >
        {/* Desktop: SVG mask cutout effect */}
        {isDesktop ? (
          <svg className="absolute inset-0 w-full h-full">
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
        ) : (
          /* Mobile: Award-winning minimal design */
          <div className="absolute inset-0 flex flex-col justify-between px-6 py-24">
            {/* Main headline - centered vertically */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Small label */}
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">
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
            </div>

            {/* Services at bottom - vertical list */}
            <div className="flex flex-col gap-1">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="text-xs text-white/50 uppercase tracking-[0.15em]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Desktop services list */}
        {isDesktop && (
          <div
            className="absolute bottom-8 left-[8%] z-20 flex items-center"
            style={{ height: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            {services.map((service, i) => (
              <span
                key={i}
                className="group/service relative font-display text-white/90 uppercase cursor-pointer transition-colors duration-300 hover:text-white"
                style={{
                  fontSize: "clamp(0.7rem, 1.68vw, 1.43rem)",
                  letterSpacing: "0.05em",
                  marginLeft: i === 0 ? 0 : "clamp(1rem, 4vw, 4rem)",
                  marginRight: "clamp(1rem, 4vw, 4rem)",
                }}
              >
                {service.toUpperCase()}
                <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-white transition-all duration-300 ease-out group-hover/service:w-full" />
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
