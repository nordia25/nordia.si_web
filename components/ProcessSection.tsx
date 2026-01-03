"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  title: string;
  titleEn: string;
  description: string;
}

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & KPI",
    titleEn: "Discovery & KPI",
    description:
      "Razumevanje ciljev, metrike uspeha in konteksta. Definiramo KPI-je, ki jih bomo merili.",
  },
  {
    number: "02",
    title: "Architecture",
    titleEn: "Architecture",
    description:
      "IA, tokovi, prototip smeri. Struktura, ki omogoča rast brez razpada.",
  },
  {
    number: "03",
    title: "Design system",
    titleEn: "Design system",
    description:
      "UI + motion smernice. Komponente, tipografija, ritem — sistem, ne enkratni dizajn.",
  },
  {
    number: "04",
    title: "Build & QA",
    titleEn: "Build & QA",
    description:
      "Next.js, performance, cross-browser. Gradimo z ozirom na CWV in SEO.",
  },
  {
    number: "05",
    title: "Launch & iterate",
    titleEn: "Launch & iterate",
    description:
      "Meritve, optimizacije, iteracije. Produkt ni nikoli dokončan — raste s podatki.",
  },
] as const;

export default function ProcessSection() {
  const useSimple = useSimpleLayout();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const steps = stepsRef.current;
    const progressLine = progressLineRef.current;

    if (!section || !header || !steps || !progressLine) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
          },
        }
      );

      // Progress line animation - scrubbed on desktop, once on slow devices
      if (useSimple) {
        // Simple one-time animation for slow devices
        gsap.fromTo(
          progressLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: steps,
              start: "top 70%",
              once: true,
            },
          }
        );
      } else {
        // Scrubbed animation for desktop
        gsap.fromTo(
          progressLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: steps,
              start: "top 70%",
              end: "bottom 50%",
              scrub: 1,
            },
          }
        );
      }

      // Step items stagger
      const stepItems = steps.querySelectorAll(".process-step");
      stepItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
            delay: i * 0.1,
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [useSimple]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-[var(--background)] py-40 md:py-56"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-elevated)] to-[var(--background)]"
        aria-hidden="true"
      />

      <div className="container-wide relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-24 flex flex-col gap-12 opacity-0 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-8 text-xs uppercase tracking-[0.3em] text-[var(--foreground-subtle)]">
              Proces
            </p>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-[var(--foreground)] md:text-6xl lg:text-7xl">
              Od ideje
              <br />
              <span className="opacity-40">do produkta</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-[var(--foreground-muted)] md:text-right md:text-lg">
              Jasen proces. Vsak korak ima konkreten output.
            </p>
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-[var(--foreground-subtle)]">
                01
              </span>
              <span className="font-mono text-xs text-[var(--foreground-subtle)] opacity-50">
                —
              </span>
              <span className="font-mono text-sm text-[var(--foreground-subtle)]">
                05
              </span>
            </div>
          </div>
        </div>

        {/* Progress line */}
        <div className="mb-16 h-[2px] w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            ref={progressLineRef}
            className="h-full origin-left bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Process Steps */}
        <div ref={stepsRef} className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="process-step group relative border-t border-[var(--border)] pt-8"
            >
              {/* Step number */}
              <span className="mb-6 block font-mono text-sm text-cyan-400">
                {step.number}
              </span>

              {/* Step title */}
              <h3 className="mb-4 font-display text-xl text-[var(--foreground)] transition-colors duration-300 group-hover:text-cyan-400 md:text-2xl">
                {step.title}
              </h3>

              {/* Step description */}
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
