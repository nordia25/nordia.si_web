"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "SPLETNE STRANI",
  "SPLETNE TRGOVINE",
  "AI AVTOMATIZACIJE",
  "3D TISKANJE",
];

/**
 * Hero section with parallax background image
 * - Background image moves slower than scroll (parallax effect)
 * - Desktop: SVG mask cutout reveals the image
 * - Mobile: Simple overlay
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

  // Parallax effect for background
  useEffect(() => {
    const bg = bgRef.current;
    const section = sectionRef.current;
    if (!bg || !section) return;

    const ctx = gsap.context(() => {
      // Parallax: background moves UP as you scroll down (opposite direction)
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
      {/* Parallax background container - fixed but with parallax movement */}
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

      {/* Hero section content - scrolls over the parallax image */}
      <section
        ref={sectionRef}
        id="hero"
        className="relative z-10 min-h-screen"
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
          /* Mobile: Simple overlay without SVG mask */
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-center px-6">
            <h1
              className="font-display font-bold text-white uppercase"
              style={{
                fontSize: "clamp(2rem, 10vw, 4rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              DIGITALNE REŠITVE
              <br />
              <span className="text-white/60">PRIHODNOSTI</span>
            </h1>
          </div>
        )}

        {/* Services list - hidden on small mobile */}
        <div
          className="absolute bottom-8 left-6 lg:left-[8%] z-20 hidden sm:flex items-center flex-wrap gap-y-2"
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
              {service}
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-white transition-all duration-300 ease-out group-hover/service:w-full" />
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
