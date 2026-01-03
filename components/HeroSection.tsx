"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import MagneticButton from "./MagneticButton";
import ArrowIcon from "./icons/ArrowIcon";
import HeroBackground from "./HeroBackground";
import { usePreloader } from "@/contexts/PreloaderContext";
import { useIsTouchDevice } from "@/hooks/useDeviceDetection";

// Visual constants
const GRADIENT_CYAN =
  "linear-gradient(135deg, #22d3ee 0%, #06b6d4 25%, #0ea5e9 50%, #3b82f6 75%, #2563eb 100%)";

const SPOTLIGHT = {
  /** Spotlight radius for gradient/elegant text */
  SMALL: 120,
  /** Spotlight radius for outline text */
  LARGE: 150,
} as const;

const COLORS = {
  /** Dimmed text color for non-hovered state */
  TEXT_DIMMED: "#b3b3b3",
  /** Bright text color */
  TEXT_BRIGHT: "#e5e5e5",
  /** White text */
  WHITE: "#f2f2f2",
} as const;

interface TextEffectProps {
  children: string;
  className?: string;
}

/**
 * Gradient text with mouse-following spotlight effect.
 * On touch devices, displays full brightness without spotlight.
 */
function GradientText({ children, className = "" }: TextEffectProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const isTouch = useIsTouchDevice();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isTouch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const baseStyle = {
    letterSpacing: "-0.04em",
    background: GRADIENT_CYAN,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  } as const;

  // Touch devices: full brightness without spotlight
  if (isTouch) {
    return (
      <span className={`${className} inline-block cursor-default`} style={baseStyle}>
        {children}
      </span>
    );
  }

  const spotlightMask = `radial-gradient(circle ${SPOTLIGHT.SMALL}px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`;

  return (
    <span
      ref={containerRef}
      className={`${className} relative inline-block cursor-default`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ letterSpacing: "-0.04em" }}
    >
      {/* Base gradient */}
      <span style={baseStyle}>{children}</span>
      {/* Bright overlay with spotlight mask */}
      <span
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          ...baseStyle,
          filter: "brightness(1.5)",
          opacity: isHovered ? 1 : 0,
          maskImage: spotlightMask,
          WebkitMaskImage: spotlightMask,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Elegant white text with mouse-following spotlight effect.
 * On touch devices, displays bright text without spotlight.
 */
function ElegantText({ children, className = "" }: TextEffectProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const isTouch = useIsTouchDevice();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isTouch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Touch devices: bright text without spotlight
  if (isTouch) {
    return (
      <span
        className={`${className} inline-block cursor-default text-white`}
        style={{ letterSpacing: "-0.04em", color: COLORS.TEXT_BRIGHT }}
      >
        {children}
      </span>
    );
  }

  const spotlightMask = `radial-gradient(circle ${SPOTLIGHT.SMALL}px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`;

  return (
    <span
      ref={containerRef}
      className={`${className} relative inline-block cursor-default text-white`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ letterSpacing: "-0.04em", color: COLORS.TEXT_DIMMED }}
    >
      {/* Base dimmed text */}
      <span style={{ color: COLORS.TEXT_DIMMED }}>{children}</span>
      {/* Bright overlay with spotlight mask */}
      <span
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          color: "rgba(255,255,255,1)",
          opacity: isHovered ? 1 : 0,
          maskImage: spotlightMask,
          WebkitMaskImage: spotlightMask,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Outline text with mouse-following spotlight effect.
 * Editorial style with cyan-tinted stroke on hover.
 */
function OutlineText({ children, className = "" }: TextEffectProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const isTouch = useIsTouchDevice();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isTouch) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Touch devices: brighter outline without spotlight
  if (isTouch) {
    return (
      <span
        className={`${className} inline-block cursor-default`}
        style={{
          letterSpacing: "-0.04em",
          color: "rgba(255,255,255,0.5)",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.5)",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
    );
  }

  const spotlightMask = `radial-gradient(circle ${SPOTLIGHT.LARGE}px at ${mousePos.x}% ${mousePos.y}%, black 0%, transparent 100%)`;

  return (
    <span
      ref={containerRef}
      className={`${className} relative inline-block cursor-default`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ letterSpacing: "-0.04em" }}
    >
      {/* Base dimmed outline */}
      <span
        style={{
          color: "rgba(255,255,255,0.3)",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.3)",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
      {/* Bright overlay with spotlight mask - cyan tinted */}
      <span
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          color: "rgba(34,211,238,0.8)",
          WebkitTextStroke: "1.5px rgba(34,211,238,0.8)",
          WebkitTextFillColor: "transparent",
          opacity: isHovered ? 1 : 0,
          maskImage: spotlightMask,
          WebkitMaskImage: spotlightMask,
        }}
      >
        {children}
      </span>
    </span>
  );
}

interface RotatingTextProps {
  words: string[];
  className?: string;
}

/**
 * Rotating text component with GSAP animation.
 * Cycles through words with fade transitions.
 * Animation starts after preloader completes.
 */
function RotatingText({ words, className = "" }: RotatingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const { isComplete } = usePreloader();

  useEffect(() => {
    if (!containerRef.current || isTouch || !isComplete) return;

    const ctx = gsap.context(() => {
      const wordElements = containerRef.current?.querySelectorAll(".rotating-word");
      if (!wordElements || wordElements.length === 0) return;

      // Initial state: all dimmed except first
      gsap.set(wordElements, { opacity: 0.15 });
      gsap.set(wordElements[0], { opacity: 1 });

      // Infinite rotation timeline
      const tl = gsap.timeline({ repeat: -1 });

      wordElements.forEach((_, i) => {
        const nextIndex = (i + 1) % words.length;
        tl.to({}, { duration: 2.5 }); // Hold
        tl.to(wordElements[i], { opacity: 0.15, duration: 0.6, ease: "power2.inOut" });
        tl.to(wordElements[nextIndex], { opacity: 1, duration: 0.6, ease: "power2.inOut" }, "<");
      });
    }, containerRef);

    return () => ctx.revert();
  }, [words.length, isTouch, isComplete]);

  return (
    <div ref={containerRef} className={`${className} text-white`}>
      {words.map((word, i) => (
        <span
          key={word}
          className="rotating-word block text-white"
          style={{
            letterSpacing: "-0.04em",
            color: COLORS.WHITE,
            opacity: i === 0 ? 1 : 0.15,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

// Rotating words data
const rotatingWords = [
  "spletne strani",
  "avtomatizirane sisteme",
  "3D modele",
  "AI rešitve",
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="fixed left-0 right-0 top-0 z-0 flex min-h-screen overflow-hidden bg-black"
    >
      {/* Background Image */}
      <HeroBackground />

      {/* Content - Full Width Editorial Grid */}
      {/* z-50 ensures content is always above background layers */}
      <div className="relative z-50 flex w-full items-center px-6 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-[1800px]">

          {/* Main Content */}
          <div className="flex min-h-screen flex-col justify-center pt-28 pb-20 md:pt-32 md:pb-24 lg:py-0">

            {/* Title Block - Horizontal layout on desktop */}
            <h1 className="mb-8 font-display lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
                {/* Static part */}
                <ElegantText className="text-[clamp(3rem,10vw,8rem)] font-medium leading-[0.95]">
                  Izdelujemo
                </ElegantText>

                {/* Rotating part */}
                <RotatingText
                  words={rotatingWords}
                  className="mt-2 text-[clamp(2rem,6vw,5rem)] font-medium leading-[1.15] text-white lg:mt-3"
                />
              </div>
            </h1>

            {/* CTAs - aligned with rotating text */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
              {/* Invisible spacer matching "Izdelujemo" width - uses visibility:hidden for GPU compatibility */}
              <span
                className="hidden lg:block text-[clamp(3rem,10vw,8rem)] font-medium leading-[0.95] invisible select-none pointer-events-none"
                aria-hidden="true"
                style={{ letterSpacing: "-0.04em" }}
              >
                Izdelujemo
              </span>

              {/* Actual CTAs */}
              <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12 md:h-[60px]">
                {/* Primary CTA - Premium with animated fill */}
                <MagneticButton
                  href="mailto:info@nordia.si"
                  className="group/cta relative !overflow-hidden !rounded-full !border-0 !bg-transparent !p-0"
                  strength={0.3}
                >
                  {/* Outer glow on hover */}
                  <span className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-700 group-hover/cta:opacity-100 bg-white/20" />

                  {/* Border container */}
                  <span className="relative block rounded-full p-px bg-gradient-to-r from-white/20 via-white/30 to-white/20 group-hover/cta:from-[#1d4ed8] group-hover/cta:via-[#1d4ed8] group-hover/cta:to-[#1d4ed8] transition-all duration-500">
                    {/* Inner button */}
                    <span className="relative flex items-center gap-4 rounded-full bg-black/90 px-10 py-5 transition-all duration-500 group-hover/cta:bg-[#1d4ed8]">
                      {/* Background overlay for smooth transition */}
                      <span className="absolute inset-0 rounded-full bg-black/80 transition-opacity duration-500 group-hover/cta:opacity-0" />

                      {/* Text */}
                      <span className="relative text-lg font-normal tracking-wide text-white/90 group-hover/cta:text-white transition-colors duration-300">
                        Začnimo projekt
                      </span>

                      {/* Arrow with enhanced animation */}
                      <span className="relative flex items-center overflow-hidden">
                        <ArrowIcon
                          className="h-5 w-5 text-white/70 transition-all duration-500 group-hover/cta:text-white group-hover/cta:translate-x-1"
                          strokeWidth={1.5}
                        />
                      </span>
                    </span>
                  </span>
                </MagneticButton>

                {/* Secondary CTA - Minimal with animated underline */}
                <a
                  href="#works"
                  className="group/secondary relative flex items-center"
                >
                  {/* Vertical accent line - taller to connect with underline */}
                  <span className="relative w-px h-14 overflow-hidden">
                    <span className="absolute inset-0 bg-white/15" />
                    <span className="absolute inset-0 bg-white translate-y-full group-hover/secondary:translate-y-0 transition-transform duration-500 ease-out" />
                  </span>

                  {/* Text container with underline that extends to arrow */}
                  <span className="relative ml-5 flex items-center">
                    <span className="text-xl tracking-wide text-white/50 transition-colors duration-300 group-hover/secondary:text-white/90">
                      Naše delo
                    </span>
                    {/* Animated underline - extends left to vertical line and right to arrow end */}
                    <span className="absolute bottom-[-15px] -left-5 h-px w-[calc(100%+3.5rem)] origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover/secondary:scale-x-100" />
                  </span>

                  {/* Arrow that slides in */}
                  <span className="relative overflow-hidden w-5 h-5 ml-4">
                    <ArrowIcon
                      className="absolute h-5 w-5 text-white/50 -translate-x-5 opacity-0 transition-all duration-500 ease-out group-hover/secondary:translate-x-0 group-hover/secondary:opacity-100 group-hover/secondary:text-white"
                      strokeWidth={1.5}
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-6 hidden items-center gap-4 md:left-12 md:flex lg:left-16">
        <span className="origin-center -rotate-90 text-xs font-medium uppercase tracking-[0.2em] text-white/25">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-white/10">
          <div className="animate-scroll-indicator absolute h-1/2 w-full bg-gradient-to-b from-cyan-400/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
