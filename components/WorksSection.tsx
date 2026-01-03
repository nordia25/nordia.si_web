"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  number: string;
  color: string;
  backColor: string;
  accentColor: string;
  oneLiner: string;
  bullets: string[];
  description: string;
  closingText: string;
}

// Service icons as React components
function WebsiteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="8" width="40" height="32" rx="4" />
      <line x1="4" y1="16" x2="44" y2="16" />
      <circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="22" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <rect x="10" y="22" width="12" height="12" rx="2" />
      <line x1="28" y1="22" x2="38" y2="22" />
      <line x1="28" y1="28" x2="38" y2="28" />
      <line x1="28" y1="34" x2="34" y2="34" />
    </svg>
  );
}

function EcommerceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 12h4l6 24h22l6-18H14" />
      <circle cx="18" cy="42" r="3" />
      <circle cx="34" cy="42" r="3" />
      <path d="M20 22h8M24 18v8" />
    </svg>
  );
}

function AIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="8" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
      <line x1="24" y1="6" x2="24" y2="10" />
      <line x1="24" y1="38" x2="24" y2="42" />
      <line x1="6" y1="24" x2="10" y2="24" />
      <line x1="38" y1="24" x2="42" y2="24" />
      <line x1="11.27" y1="11.27" x2="14.1" y2="14.1" />
      <line x1="33.9" y1="33.9" x2="36.73" y2="36.73" />
      <line x1="11.27" y1="36.73" x2="14.1" y2="33.9" />
      <line x1="33.9" y1="14.1" x2="36.73" y2="11.27" />
    </svg>
  );
}

function PrintingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 36V24h24v12" />
      <path d="M16 24V8h16v16" />
      <path d="M8 40h32" />
      <path d="M12 44h24" />
      <line x1="20" y1="12" x2="28" y2="12" />
      <line x1="20" y1="16" x2="28" y2="16" />
      <line x1="20" y1="20" x2="24" y2="20" />
    </svg>
  );
}

const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "premium-website": WebsiteIcon,
  "ecommerce": EcommerceIcon,
  "ai-integracija": AIIcon,
  "3d-tiskanje": PrintingIcon,
};

const PROJECTS: readonly Project[] = [
  {
    slug: "premium-website",
    title: "Premium Website",
    category: "Spletna stran",
    image: "/works/premium-website.jpg",
    number: "01",
    color: "#3b82f6",
    backColor: "#1d4ed8",
    accentColor: "#2563eb",
    oneLiner: "Spletna stran, ki prodaja — tudi ko spite.",
    description: "Potencialna stranka vas oceni v sekundi. Zgradimo stran, ki v tej sekundi zgradi zaupanje — in spremeni obiskovalce v stranke.",
    bullets: [
      "Lighthouse score 100 — bliskovito hitra",
      "SEO-first pristop za organsko rast",
      "Responsive design za vse naprave",
    ],
    closingText: "Zgradimo vam stran, ki prodaja — tiho, zanesljivo, tudi ko spite.",
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    category: "Spletna trgovina",
    image: "/works/ecommerce.jpg",
    number: "02",
    color: "#22d3ee",
    backColor: "#0e7490",
    accentColor: "#06b6d4",
    oneLiner: "Vaša trgovina, odprta 24/7.",
    description: "Medtem ko spite, vaša spletna trgovina prodaja. Zgradimo sistem, ki vodi stranko od prvega klika do plačila — brez trenja, brez izgubljenih prodaj.",
    bullets: [
      "Stripe, PayPal — varno in hitro",
      "Avtomatska sinhronizacija zalog",
      "Checkout optimiziran za konverzijo",
    ],
    closingText: "Vaši izdelki si zaslužijo platformo, ki jih zna prodati. Mi jo zgradimo.",
  },
  {
    slug: "ai-integracija",
    title: "AI Integracija",
    category: "AI Avtomatizacija",
    image: "/works/ai_integration.jpg",
    number: "03",
    color: "#a855f7",
    backColor: "#7e22ce",
    accentColor: "#9333ea",
    oneLiner: "Procesi, ki so vas upočasnjevali, zdaj delajo sami.",
    description: "Vsako podjetje ima opravila, ki požirajo čas. Razvijemo programe po meri — od avtomatizacije procesov do integracije AI v vašo obstoječo infrastrukturo. Vi rastete, sistem dela.",
    bullets: [
      "Prilagojeni programi za vaše specifične potrebe",
      "AI integracija v obstoječo trgovino ali sistem",
      "Ure ročnega dela postanejo minute",
    ],
    closingText: "Ustvarimo vam rešitve, ki avtomatizirajo zamudne procese — da se vi posvetite rasti.",
  },
  {
    slug: "3d-tiskanje",
    title: "3D Tiskanje",
    category: "3D Tiskanje",
    image: "/works/3d_printing.jpg",
    number: "04",
    color: "#94a3b8",
    backColor: "#475569",
    accentColor: "#64748b",
    oneLiner: "Od ideje do izdelka v 48 urah.",
    description: "Ideja v glavi je ena stvar. Izdelek v rokah je druga. Preizkusite koncept, preden investirate v drago proizvodnjo — popravljajte, dokler ni popolno.",
    bullets: [
      "FDM & SLA tehnologija",
      "Industrijski materiali (PLA, PETG, Resin)",
      "Iterativno prototipiranje",
    ],
    closingText: "Vašo idejo spremenimo v izdelek, ki ga lahko preizkusite — hitro, natančno, brez tveganja.",
  },
] as const;

// Hook for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) =>
        setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } catch {
      // Fallback for browsers that don't support matchMedia
      setPrefersReducedMotion(false);
    }
  }, []);

  return prefersReducedMotion;
}

// Helper to darken a hex color
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0);
  const B = Math.max((num & 0x0000ff) - amt, 0);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// SVG noise pattern for texture overlay
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

// FlipCard component with 3D flip animation
interface FlipCardProps {
  project: Project;
  isSimple?: boolean;
  className?: string;
  showNumber?: boolean;
  showGlow?: boolean;
}

function FlipCard({ project, isSimple = false, className = "", showNumber = false, showGlow = false }: FlipCardProps) {
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
          isSimple ? "mb-6 aspect-[4/3]" : "mb-8 aspect-[8/9]"
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
              sizes={isSimple ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 40vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQACAwQFERITITEGQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABEQACITH/2gAMAwEAAhEDEQA/AMv8cqKd1wrI5qiKJzXRkvkcQSNjucIi1WVBD//Z"
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
            className="absolute inset-0 overflow-hidden rounded-2xl bg-[#0a0a0a]"
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
                <h4 className="font-display text-[32px] font-bold uppercase leading-[0.85] tracking-[-0.02em] text-white lg:text-[42px]">
                  {project.title.split(" ").map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h4>
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
                  className="group/back flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white/35 transition-colors hover:text-white focus:outline-none lg:text-[12px]"
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
        <h3 className={`font-display leading-none text-[var(--foreground)] ${isSimple ? "text-[1.75rem]" : "text-[2.15rem] md:text-[2.6rem]"}`}>
          {project.category}
        </h3>
      </div>
    </article>
  );
}

// Simple vertical layout for mobile/tablets/slow devices
function SimpleWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
          duration: 0.6,
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
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
            delay: i * 0.1,
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
      className="relative z-20 bg-[var(--background)] py-20"
    >
      <div className="container-wide">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-[#a8a8a8]">
            Storitve
          </p>
          <h2 className="mb-8 font-display text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[0.95] tracking-tight text-[var(--foreground)]">
            Kaj{" "}
            <span className="text-[#9ca3af]">
              ustvarjamo
            </span>
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)] md:text-xl">
            Od ideje do implementacije — celovite digitalne rešitve, ki rastejo z vami.
          </p>
        </div>

        {/* Simple grid layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {PROJECTS.map((work) => (
            <FlipCard key={work.slug} project={work} isSimple />
          ))}
        </div>

        {/* CTA Section */}
        <div className="py-20 md:py-28">
          <a
            href="mailto:info@nordia.si"
            className="group flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
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
          </a>
        </div>

      </div>
    </section>
  );
}

// Full horizontal scroll layout for desktop with scroll-snap
function HorizontalWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Wait for component to mount and stabilize before initializing ScrollTrigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const section = sectionRef.current;
    const horizontal = horizontalRef.current;
    const trigger = triggerRef.current;
    const header = headerRef.current;

    if (!section || !horizontal || !trigger || !header)
      return;

    // Calculate scroll width once, after layout is stable
    const scrollWidth = horizontal.scrollWidth - window.innerWidth;

    // Don't initialize if scroll width is invalid
    if (scrollWidth <= 0) {
      console.warn(
        "WorksSection: Invalid scroll width, skipping horizontal scroll"
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Header fade in
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Horizontal scroll with fixed values (not functions)
      gsap.to(horizontal, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: `+=${scrollWidth}`,
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative z-20 bg-[var(--background)]"
    >
      {/* Header */}
      <div className="pb-40 pt-8 md:pb-48 md:pt-12">
        <div ref={headerRef} className="container-wide">
          <div>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-[#a8a8a8]">
              Storitve
            </p>
            <h2 className="mb-8 font-display text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.95] tracking-tight text-[var(--foreground)]">
              Kaj{" "}
              <span className="text-[#9ca3af]">
                ustvarjamo
              </span>
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)] md:text-xl lg:text-2xl">
              Od ideje do implementacije — celovite digitalne rešitve, ki rastejo z vami.
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
          {PROJECTS.map((work) => (
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
        <a
          href="mailto:info@nordia.si"
          className="group flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
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
        </a>
      </div>

    </section>
  );
}

// Main component - chooses between simple and horizontal layout
export default function WorksSection() {
  const useSimple = useSimpleLayout();

  // Use simple vertical layout for mobile/tablets/slow devices
  if (useSimple) {
    return <SimpleWorksSection />;
  }

  // Use horizontal scroll only on desktop with no reduced motion preference
  return <HorizontalWorksSection />;
}
