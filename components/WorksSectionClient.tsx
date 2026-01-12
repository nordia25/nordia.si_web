"use client";

import { useEffect, useRef, useState, memo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout, usePrefersReducedMotion } from "@/hooks/useDeviceDetection";
import { useContactForm } from "@/contexts/ContactFormContext";
import type { Project } from "@/lib/data";
import { BLUR_DATA_URL_1PX } from "@/lib/imagePlaceholders";

gsap.registerPlugin(ScrollTrigger);

// Animation timing constants
const ANIMATION = {
  /** Simple layout animation duration */
  simple: 0.6,
  /** Full layout animation duration */
  full: 0.8,
  /** Stagger delay between items */
  stagger: 0.1,
  /** Horizontal scroll scrub - lower = more responsive (0.5-1 is snappy) */
  scrub: 0.8,
} as const;

/**
 * Interactive card with 3D flip animation.
 * Shows project image on front, detailed info on back.
 * Falls back to fade transition on simple/reduced-motion mode.
 */
interface FlipCardProps {
  project: Project;
  isSimple?: boolean;
  className?: string;
  showNumber?: boolean;
  showGlow?: boolean;
}

const FlipCard = memo(function FlipCard({ project, isSimple = false, className = "", showNumber = false, showGlow = false }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
    if (e.key === "Escape" && isFlipped) {
      setIsFlipped(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <article className={`work-card group relative ${className}`}>
      {/* Number overlay - only for horizontal layout */}
      {showNumber && (
        <span
          className="absolute -left-4 -top-8 z-0 select-none font-mono text-[160px] font-bold leading-none text-white/[0.02]"
          aria-hidden="true"
        >
          {project.number}
        </span>
      )}

      {/* Glow effect on hover - only for horizontal layout */}
      {showGlow && (
        <div
          className="absolute -inset-4 -z-10 rounded-3xl opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle, ${project.color}20 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Flip container - only image area */}
      <div
        className={`relative cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
          isSimple ? "mb-6 min-h-[75vh]" : "mb-8 aspect-[8/9]"
        }`}
        style={isSimple ? undefined : { perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label={`${project.title} - klikni za več informacij`}
      >
        <div
          className="h-full w-full"
          style={isSimple ? {
            // Simple fade transition for mobile/reduced-motion - no 3D transforms
            transition: prefersReducedMotion ? "none" : "opacity 0.3s ease-out",
          } : {
            transformStyle: "preserve-3d",
            transition: prefersReducedMotion ? "none" : "transform 0.6s ease-out",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front side - image */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-[var(--card-bg)]"
            style={isSimple ? {
              // Simple visibility toggle for non-3D mode
              opacity: isFlipped ? 0 : 1,
              visibility: isFlipped ? "hidden" : "visible",
              transition: "opacity 0.3s, visibility 0.3s",
            } : {
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            <Image
              src={project.image}
              alt={`${project.title} - ${project.category}`}
              fill
              sizes={isSimple ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw" : "(max-width: 1024px) 50vw, 40vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL_1PX}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

            {/* Simple circle hover overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-500 group-hover:opacity-100 ${
                isFlipped ? "pointer-events-none" : ""
              }`}
            >
              {/* Circle with text */}
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white">
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-white">
                  Razišči
                </span>
              </div>
            </div>
          </div>

          {/* Back side - BOLD EDITORIAL DESIGN */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl bg-black"
            style={isSimple ? {
              // Simple visibility toggle for non-3D mode
              opacity: isFlipped ? 1 : 0,
              visibility: isFlipped ? "visible" : "hidden",
              transition: "opacity 0.3s, visibility 0.3s",
            } : {
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Vertical accent stripe - left edge */}
            <div
              className="absolute bottom-0 left-0 top-0 w-1"
              style={{ backgroundColor: project.color }}
              aria-hidden="true"
            />

            {/* Massive editorial number - bleeds off top */}
            <span
              className="absolute -top-6 right-4 select-none font-display text-[120px] font-bold leading-none tracking-tighter lg:-top-8 lg:right-6 lg:text-[160px]"
              style={{ color: project.color, opacity: 0.15 }}
              aria-hidden="true"
            >
              {project.number}
            </span>

            {/* Rotated category label - left side */}
            <span
              className="absolute bottom-8 left-4 origin-bottom-left -rotate-90 text-[10px] font-medium uppercase tracking-[0.3em] text-white/30 lg:bottom-10 lg:left-5"
              aria-hidden="true"
            >
              {project.category}
            </span>

            {/* Main content - asymmetric padding for editorial feel */}
            <div className="relative flex h-full flex-col pl-7 pr-5 pt-5 lg:pl-10 lg:pr-6 lg:pt-6">

              {/* Title block - oversized, dramatic */}
              <div className="mb-3 lg:mb-4">
                <h3 className="font-display text-[32px] font-bold uppercase leading-[0.85] tracking-[-0.02em] text-white lg:text-[42px]">
                  {project.title.split("|").map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h3>
              </div>

              {/* Pull quote section */}
              <div className="relative my-3 lg:my-4">
                {/* Large quotation mark */}
                <span
                  className="absolute -left-1 -top-3 font-serif text-3xl font-light leading-none lg:-top-4 lg:text-4xl"
                  style={{ color: project.color }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="pl-5 text-[19px] font-medium leading-[1.4] text-white/55 lg:pl-6 lg:text-[22px]">
                  {project.oneLiner}
                </p>
              </div>

              {/* Description - what we do & value proposition */}
              <p className="my-3 text-[17px] leading-[1.6] text-white/95 lg:my-4 lg:text-[18px]">
                {project.description}
              </p>

              {/* Horizontal rule */}
              <div className="my-2 h-px w-full bg-white/15 lg:my-3" />

              {/* Numbered bullets - editorial list style */}
              <div className="mb-3 space-y-2.5 lg:mb-4 lg:space-y-3">
                {project.bullets.map((bullet, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-3 text-[17px] leading-[1.5] text-white/95 lg:text-[18px]"
                  >
                    <span
                      className="font-mono text-[14px] font-medium tracking-tight lg:text-[15px]"
                      style={{ color: project.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Horizontal rule below bullets */}
              <div className="my-2 h-px w-full bg-white/15 lg:my-3" />

              {/* Closing text - strong call to action */}
              <p className="my-3 text-[17px] leading-[1.6] text-white/95 lg:my-4 lg:text-[18px]">
                {project.closingText}
              </p>

              {/* Bottom bar - minimal */}
              <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                <button
                  onClick={handleClose}
                  className="group/back flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white focus:outline-none lg:text-[12px]"
                  aria-label="Zapri opis"
                >
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-1 lg:h-4 lg:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>Nazaj</span>
                </button>

                {/* Minimal accent line */}
                <div
                  className="h-px w-6 lg:w-10"
                  style={{ backgroundColor: project.color, opacity: 0.6 }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content below flip - always visible */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Vertical accent line */}
        <div
          className={`w-1 flex-shrink-0 rounded-full ${isSimple ? "h-5" : "h-7 md:h-9"}`}
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        />
        <h3 className={`font-display leading-tight text-[var(--foreground)] ${isSimple ? "text-[1.75rem]" : "text-[2.15rem] md:text-[2.6rem]"}`}>
          {project.category}
        </h3>
      </div>
    </article>
  );
});

interface WorksSectionClientProps {
  projects: readonly Project[];
}

/**
 * Vertical card layout for mobile/tablets/slow devices.
 * Uses simple fade-in animations for better performance.
 */
function SimpleWorksSection({ projects }: { projects: readonly Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { openContactForm } = useContactForm();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const ctx = gsap.context(() => {
      // Simple header fade in
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION.simple,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Simple card fade in
      const cards = section.querySelectorAll(".work-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION.simple,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
            delay: i * ANIMATION.stagger,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-[var(--background)] py-20"
    >
      {/* Watermark - desktop only, behind content */}
      <span
        className="pointer-events-none absolute right-6 top-8 z-0 hidden select-none font-display text-[18vw] font-bold uppercase leading-[0.8] tracking-tighter text-[#111] md:right-12 md:block"
        aria-hidden="true"
      >
        Storitve
      </span>

      <div className="container-wide relative z-10">
        {/* Header - Editorial style */}
        <div ref={headerRef} className="mb-16">
          {/* Mobile label */}
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#666] md:hidden">
            Storitve
          </p>
          <h2 className="mb-8 font-display text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[0.95] tracking-tight text-[var(--foreground)]">
            Digitalne rešitve
            <br />
            <span className="text-[#666]">
              za ambiciozne.
            </span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg">
            Spletne strani. Trgovine. Avtomatizacije.
          </p>
        </div>

        {/* Simple grid layout - single column for full-height cards */}
        <div className="grid grid-cols-1 gap-12">
          {projects.map((work) => (
            <FlipCard key={work.slug} project={work} isSimple />
          ))}
        </div>

        {/* CTA Section */}
        <div className="py-20 md:py-28">
          <button
            onClick={openContactForm}
            className="group flex w-full flex-col gap-6 text-left lg:flex-row lg:items-center lg:justify-between lg:gap-12"
          >
            <h3 className="font-display text-[9vw] leading-[1.1] tracking-tight text-[var(--foreground)] md:text-[7vw] lg:text-[4.5vw]">
              <span className="inline-block transition-opacity duration-500 group-hover:opacity-40">
                Vas zanima katera od naših storitev?
              </span>{" "}
              <span className="inline-block opacity-40 transition-opacity duration-500 group-hover:opacity-100">
                Pišite nam.
              </span>
            </h3>
            {/* Arrow button */}
            <span className="inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] transition-all duration-500 group-hover:scale-110 group-hover:border-white/30 md:h-20 md:w-20">
              <svg
                className="h-5 w-5 -rotate-45 text-[var(--foreground)] transition-transform duration-500 group-hover:rotate-0 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}

/**
 * Horizontal scroll layout for desktop.
 * Uses GSAP ScrollTrigger for smooth horizontal scrolling effect.
 *
 * Optimized for performance on all desktop computers:
 * - Uses invalidateOnRefresh for responsive behavior
 * - Lightweight scrub value for snappy response
 * - No setTimeout delays - uses GSAP's built-in timing
 */
function HorizontalWorksSection({ projects }: { projects: readonly Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { openContactForm } = useContactForm();

  useEffect(() => {
    const section = sectionRef.current;
    const horizontal = horizontalRef.current;
    const trigger = triggerRef.current;
    const header = headerRef.current;

    if (!section || !horizontal || !trigger || !header) return;

    // Use GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Header fade in animation
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION.full,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Calculate scroll distance dynamically
      // Using a function ensures correct calculation on refresh/resize
      const getScrollDistance = () => {
        return -(horizontal.scrollWidth - window.innerWidth);
      };

      // Horizontal scroll animation
      // Key optimizations:
      // - invalidateOnRefresh: recalculates on resize
      // - Lower scrub value = more responsive
      // - anticipatePin: reduces jump when pinning starts
      gsap.to(horizontal, {
        x: getScrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          // End is calculated as scroll distance
          end: () => `+=${horizontal.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: ANIMATION.scrub,
          anticipatePin: 1,
          // Recalculate on resize - critical for responsiveness
          invalidateOnRefresh: true,
          // OPTIMIZED: Prevents runaway animations on fast scroll
          fastScrollEnd: true,
        },
      });
    }, section);

    // Refresh ScrollTrigger after a frame to ensure proper measurements
    // This replaces the setTimeout approach with GSAP's recommended method
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-[var(--background)]"
    >
      {/* Watermark - desktop only, behind content */}
      <span
        className="pointer-events-none absolute right-12 top-8 z-0 select-none font-display text-[18vw] font-bold uppercase leading-[0.8] tracking-tighter text-[#111]"
        aria-hidden="true"
      >
        Storitve
      </span>

      {/* Header - Editorial style */}
      <div className="relative z-10 pb-40 pt-8 md:pb-48 md:pt-12">
        <div ref={headerRef} className="container-wide">
          <div>
            <h2 className="mb-8 font-display text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.95] tracking-tight text-[var(--foreground)]">
              Digitalne rešitve
              <br />
              <span className="text-[#666]">
                za ambiciozne.
              </span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg lg:text-xl">
              Spletne strani. Trgovine. Avtomatizacije.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal scroll section */}
      <div ref={triggerRef} className="overflow-hidden">
        <div
          ref={horizontalRef}
          className="flex gap-10 pl-[5vw] pr-[20vw]"
          style={{ width: "fit-content" }}
        >
          {projects.map((work) => (
            <FlipCard
              key={work.slug}
              project={work}
              className="block w-[50vw] flex-shrink-0 lg:w-[40vw]"
              showNumber
              showGlow
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-wide py-24 md:py-32 lg:py-40">
        <button
          onClick={openContactForm}
          className="group flex w-full flex-col gap-6 text-left lg:flex-row lg:items-center lg:justify-between lg:gap-12"
        >
          <h3 className="font-display text-[9vw] leading-[1.1] tracking-tight text-[var(--foreground)] md:text-[7vw] lg:text-[4.5vw]">
            <span className="inline-block transition-opacity duration-500 group-hover:opacity-40">
              Vas zanima katera od naših storitev?
            </span>{" "}
            <span className="inline-block opacity-40 transition-opacity duration-500 group-hover:opacity-100">
              Pišite nam.
            </span>
          </h3>
          {/* Arrow button */}
          <span className="inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] transition-all duration-500 group-hover:scale-110 group-hover:border-white/30 md:h-20 md:w-20">
            <svg
              className="h-5 w-5 -rotate-45 text-[var(--foreground)] transition-transform duration-500 group-hover:rotate-0 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>
      </div>

    </section>
  );
}

/**
 * Client component for works section
 * Renders horizontal scroll on desktop, vertical grid on mobile/slow devices.
 */
export default function WorksSectionClient({ projects }: WorksSectionClientProps) {
  const useSimple = useSimpleLayout();

  // Use simple vertical layout for mobile/tablets/reduced motion
  if (useSimple) {
    return <SimpleWorksSection projects={projects} />;
  }

  // Use horizontal scroll on desktop
  return <HorizontalWorksSection projects={projects} />;
}
