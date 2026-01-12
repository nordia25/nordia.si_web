"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

/** Value data structure */
interface Value {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/** SVG Icons for each value */
const icons = {
  design: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      {/* Layout grid */}
      <rect x="4" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="20" width="18" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="26" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <path
        d="M14 16L4 24l10 8M34 16l10 8-10 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 8L20 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  time: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M24 12v12l8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  ),
  intuitive: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      {/* Cursor with click ripple */}
      <path
        d="M12 8L12 32L18 26L24 38L28 36L22 24L30 24L12 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="14" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <circle cx="32" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
    </svg>
  ),
  quality: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <path
        d="M24 4l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2 6-12z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M18 24l4 4 8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/** Our five core values */
const VALUES: Value[] = [
  {
    number: "01",
    title: "Vrhunski design",
    description:
      "Vsak piksel ima namen. Oblikujemo vmesnike, ki niso samo lepi — so intuitivni, funkcionalni in gradijo zaupanje od prvega klika.",
    icon: icons.design,
  },
  {
    number: "02",
    title: "Čista koda",
    description:
      "Optimizirano za hitrost, SEO in prihodnje nadgradnje. Brez tehničnega dolga, brez kompromisov. Lighthouse 100, vedno.",
    icon: icons.code,
  },
  {
    number: "03",
    title: "Prihranek časa",
    description:
      "Avtomatiziramo ponavljajoče se naloge in poenostavimo procese. Več časa za rast, manj za administracijo.",
    icon: icons.time,
  },
  {
    number: "04",
    title: "Intuitivnost",
    description:
      "Uporabniška izkušnja brez trenja. Vsaka interakcija je premišljena, vsak tok naraven. Vaši uporabniki bodo vedeli, kaj storiti — brez navodil.",
    icon: icons.intuitive,
  },
  {
    number: "05",
    title: "Kvalitetna izvedba",
    description:
      "Od prvega koncepta do končnega izdelka — brezhibna izvedba. Testiranje, optimizacija in pozornost do detajlov na vsakem koraku.",
    icon: icons.quality,
  },
];

/**
 * Premium accordion values section
 * Hover to expand items with GSAP animations
 */
export default function MissionSectionClient() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const prevActiveIndex = useRef<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // GSAP animation for description expand/collapse
  const animateDescription = useCallback((index: number, expand: boolean) => {
    const el = descriptionRefs.current[index];
    if (!el || prefersReducedMotion) return;

    if (expand) {
      // Expand with GSAP
      gsap.to(el, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      // Animate text up
      const textEl = el.querySelector('p');
      if (textEl) {
        gsap.fromTo(textEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out" }
        );
      }
    } else {
      // Collapse
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [prefersReducedMotion]);

  // Handle active index change
  useEffect(() => {
    if (prevActiveIndex.current !== activeIndex) {
      animateDescription(prevActiveIndex.current, false);
      animateDescription(activeIndex, true);
      prevActiveIndex.current = activeIndex;
    }
  }, [activeIndex, animateDescription]);

  // Initial animation for first item
  useEffect(() => {
    const el = descriptionRefs.current[0];
    if (el && !prefersReducedMotion) {
      gsap.set(el, { height: "auto", opacity: 1 });
    } else if (el && prefersReducedMotion) {
      el.style.height = "auto";
      el.style.opacity = "1";
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Skip animations for reduced motion
    if (prefersReducedMotion) {
      gsap.set(headerRef.current?.querySelectorAll(".animate-in") || [], { opacity: 1, y: 0 });
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      const headerElements = headerRef.current?.querySelectorAll(".animate-in");
      if (headerElements) {
        gsap.set(headerElements, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(headerElements, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
      }

      // Content animation
      const contentEl = contentRef.current;
      if (contentEl) {
        gsap.set(contentEl, { opacity: 0, y: 60 });
        ScrollTrigger.create({
          trigger: contentEl,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(contentEl, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="vrednote"
      ref={sectionRef}
      className="relative z-30 overflow-hidden bg-black"
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Watermark - desktop only */}
      <span
        className="pointer-events-none absolute left-6 top-16 hidden select-none font-display text-[18vw] font-bold uppercase leading-[0.8] tracking-tighter text-[#111] md:left-12 md:block"
        aria-hidden="true"
      >
        Vrednote
      </span>

      <div className="relative px-6 py-20 md:px-12 md:py-32 lg:py-40">
        <div className="mx-auto max-w-7xl">
          {/* Two-column layout */}
          <div
            ref={contentRef}
            className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24"
          >
            {/* Left Column - Header + Icon Display */}
            <div className="lg:sticky lg:top-32">
              <header ref={headerRef} className="mb-10">
                {/* Mobile label */}
                <p className="animate-in mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/40 md:hidden">
                  Naše vrednote
                </p>
                <h2 className="animate-in font-display text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[0.95] tracking-tight text-white">
                  Kar nas{" "}
                  <span className="text-blue-500">definira.</span>
                </h2>
                <p className="animate-in mt-6 max-w-md text-lg text-white/50">
                  Pet temeljnih načel, ki usmerjajo vsak projekt od prvega koncepta do uspešnega lansiranja.
                </p>
              </header>

              {/* Icon display area with draw animation */}
              <div className="relative hidden aspect-square max-w-xs lg:block">
                {VALUES.map((value, index) => (
                  <div
                    key={value.number}
                    className={`
                      absolute inset-0 flex items-center justify-center
                      text-blue-500 transition-all duration-700
                      icon-draw
                      ${activeIndex === index ? "active opacity-100 scale-100" : "opacity-0 scale-95"}
                    `}
                  >
                    <div className="h-56 w-56">
                      {value.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Accordion List */}
            <div className="flex flex-col">
              {VALUES.map((value, index) => {
                const isActive = activeIndex === index;

                return (
                  <div
                    key={value.number}
                    className="group relative"
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {/* Separator line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-white/[0.08]" />

                    {/* Active accent line - left edge */}
                    <div
                      className={`
                        absolute left-0 top-0 bottom-0 w-[2px]
                        bg-gradient-to-b from-blue-500 via-blue-500/80 to-transparent
                        transition-all duration-500
                        ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
                      `}
                      style={{ transformOrigin: "top" }}
                    />

                    {/* Accordion item */}
                    <div
                      className={`relative cursor-pointer py-8 transition-all duration-500 ${
                        isActive ? "py-10" : ""
                      }`}
                    >
                      {/* Content wrapper */}
                      <div className="relative flex items-start gap-6 pl-4">
                        {/* Number - dramatic typography */}
                        <span
                          className={`
                            font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-tight
                            transition-all duration-500
                            ${isActive
                              ? "text-blue-500 translate-x-0 opacity-100"
                              : "text-white/10 -translate-x-1 opacity-60"}
                          `}
                        >
                          {value.number}
                        </span>

                        {/* Title and description */}
                        <div className="flex-1">
                          <h3
                            className={`font-display text-2xl font-medium tracking-tight transition-colors duration-300 md:text-3xl ${
                              isActive ? "text-white" : "text-white/60"
                            }`}
                          >
                            {value.title}
                          </h3>

                          {/* Description - GSAP controlled */}
                          <div
                            ref={(el) => { descriptionRefs.current[index] = el; }}
                            className="overflow-hidden"
                            style={{ height: index === 0 ? "auto" : 0, opacity: index === 0 ? 1 : 0 }}
                          >
                            <div className="pt-4">
                              <p className="text-base leading-relaxed text-white/50 md:text-lg lg:text-xl">
                                {value.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Mobile icon */}
                        <div
                          className={`h-12 w-12 text-blue-500 transition-all duration-500 lg:hidden icon-draw ${
                            isActive ? "active opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}
                        >
                          {value.icon}
                        </div>
                      </div>
                    </div>

                    {/* Last separator */}
                    {index === VALUES.length - 1 && (
                      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
