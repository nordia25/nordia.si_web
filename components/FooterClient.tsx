"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContactForm } from "@/contexts/ContactFormContext";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";
import type { CompanyInfo, SocialLink, NavLink, LegalLink } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// Animation timing constants - OPTIMIZED for snappier feel
const ANIMATION = {
  /** CTA word reveal duration */
  ctaDuration: 0.8,
  /** Footer items animation duration */
  itemsDuration: 0.7,
  /** Stagger delay between items */
  stagger: 0.08,
} as const;

/**
 * Format time for a given timezone.
 */
function formatTime(timezone: string): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Local time hook with 60-second update interval.
 * Only shows hours:minutes, so 1s updates are unnecessary overhead.
 * Reduces re-renders from 60/min to 1/min.
 */
function useLocalTime(timezone: string): string {
  // Initialize with current time (safe in "use client" component)
  const [time, setTime] = useState(() => formatTime(timezone));

  useEffect(() => {
    // Update every 60 seconds (not 1 second - we only show minutes)
    const interval = setInterval(() => setTime(formatTime(timezone)), 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  return time;
}

interface FooterClientProps {
  companyInfo: CompanyInfo;
  socialLinks: readonly SocialLink[];
  navLinks: readonly NavLink[];
  legalLinks: readonly LegalLink[];
}

/**
 * Client component for footer animations and interactivity
 */
export default function FooterClient({
  companyInfo,
  socialLinks,
  navLinks,
  legalLinks,
}: FooterClientProps) {
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const time = useLocalTime(companyInfo.timezone);
  const { openContactForm } = useContactForm();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // OPTIMIZED: Skip animations for users who prefer reduced motion
    if (prefersReducedMotion) {
      const words = ctaRef.current?.querySelectorAll(".word");
      if (words) gsap.set(words, { yPercent: 0, opacity: 1 });
      gsap.set(".footer-fade", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // CTA text reveal - word by word
      const words = ctaRef.current && ctaRef.current.querySelectorAll(".word");
      if (words) {
        gsap.fromTo(
          words,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: ANIMATION.ctaDuration,
            ease: "power4.out",
            stagger: ANIMATION.stagger,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              once: true, // OPTIMIZED: Kill trigger after activation
            },
            onComplete: () => {
              // Clear inline styles so CSS hover effects work
              words.forEach((word) => {
                gsap.set(word, { clearProps: "opacity" });
              });
            },
          }
        );
      }

      // Footer items
      gsap.fromTo(
        ".footer-fade",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION.itemsDuration,
          ease: "power3.out",
          stagger: ANIMATION.stagger,
          scrollTrigger: {
            trigger: ".footer-content",
            start: "top 85%",
            once: true, // OPTIMIZED: Kill trigger after activation
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer
      ref={footerRef}
      className="relative bg-black"
      role="contentinfo"
    >
      {/* Main CTA Section - Giant typography */}
      <div className="relative flex min-h-[60vh] items-center justify-center px-6 md:min-h-[70vh] md:px-12">
        <div ref={ctaRef} className="text-center">
          {/* Main headline */}
          <h2 className="font-display text-[clamp(3rem,12vw,9rem)] font-medium leading-[0.95] tracking-tight">
            <span className="word inline-block text-white">
              Imate projekt?
            </span>
          </h2>

          {/* CTA Link */}
          <div className="mt-4 md:mt-6">
            <button
              onClick={openContactForm}
              aria-label="Odpri kontaktni obrazec"
              className="group relative inline-block"
            >
              <span className="font-display text-[clamp(3rem,12vw,9rem)] font-medium leading-[0.95] tracking-tight">
                <span className="word inline-flex items-center text-blue-500">
                  <span className="mr-1 transition-transform duration-500 group-hover:translate-x-1 md:mr-2">›</span>
                  <span className="relative">
                    Začnimo
                    <span
                      className="absolute -bottom-2 left-0 h-[8px] w-full origin-left scale-x-100 bg-blue-500 transition-transform duration-500 group-hover:scale-x-105 md:-bottom-3 md:h-[12px]"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer content - Minimal dark */}
      <div className="footer-content border-t border-white/[0.08] px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Main footer grid */}
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            {/* Left - Brand & Location */}
            <div className="footer-fade md:col-span-4">
              <p className="font-display text-lg font-medium text-white">
                Nordia
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm text-white/40">
                  {companyInfo.city}
                </span>
                <time
                  className="font-mono text-sm tabular-nums text-white/40"
                  dateTime={time}
                >
                  {time}
                </time>
              </div>
            </div>

            {/* Center - Navigation */}
            <div className="footer-fade md:col-span-4">
              <nav
                className="flex flex-wrap gap-x-6 gap-y-2"
                aria-label="Footer navigacija"
              >
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right - Social */}
            <div className="footer-fade md:col-span-4 md:text-right">
              <nav
                className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end"
                aria-label="Družbena omrežja"
              >
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Obiščite Nordia na ${item.label} (odpre se v novem oknu)`}
                    className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 md:mt-16 md:flex-row md:items-center md:justify-between md:pt-10">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Nordia d.o.o.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-white/30 transition-colors duration-300 hover:text-white/60"
                >
                  {link.label}
                </a>
              ))}
              <span className="font-mono text-xs text-white/20">
                {companyInfo.coords}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
