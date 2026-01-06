"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowIcon from "./icons/ArrowIcon";
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
 * Local time hook with 60-second update interval.
 * Only shows hours:minutes, so 1s updates are unnecessary overhead.
 * Reduces re-renders from 60/min to 1/min.
 */
function useLocalTime(timezone: string): string {
  const [time, setTime] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const formatTime = () =>
      new Date().toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    // Set initial time
    setTime(formatTime());

    // Update every 60 seconds (not 1 second - we only show minutes)
    intervalRef.current = setInterval(() => setTime(formatTime()), 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
      className="relative bg-[var(--background)]"
      role="contentinfo"
    >
      {/* Main CTA Section - Outside the rounded container */}
      <div className="relative flex min-h-[50vh] items-center overflow-hidden md:min-h-[60vh]">
        <div className="container-wide">
          {/* Pre-title */}
          <p className="footer-fade mb-8 text-xs uppercase tracking-[0.3em] text-[var(--foreground-subtle)]">
            Začnimo
          </p>

          {/* Giant CTA - Left aligned, single row on desktop */}
          <div ref={ctaRef}>
            <button
              onClick={openContactForm}
              aria-label="Odpri kontaktni obrazec"
              className="group flex w-full flex-col gap-8 text-left lg:flex-row lg:items-center lg:justify-between lg:gap-12"
            >
              <h2 className="font-display text-[11vw] leading-[1.1] tracking-tight text-[var(--foreground)] md:text-[8vw] lg:text-[5.5vw]">
                <span className="inline-block overflow-hidden pb-2">
                  <span className="word inline-block transition-all duration-500 group-hover:opacity-40">
                    Ustvarimo
                  </span>
                </span>{" "}
                <span className="inline-block overflow-hidden pb-2">
                  <span className="word inline-block opacity-40 transition-all duration-500 group-hover:opacity-100">
                    nekaj izjemnega
                  </span>
                </span>
              </h2>

              {/* Arrow button - right side */}
              <span
                className="inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--foreground)] group-hover:bg-[var(--foreground)] md:h-24 md:w-24"
                aria-hidden="true"
              >
                <ArrowIcon
                  className="h-6 w-6 -rotate-45 text-[var(--foreground)] transition-all duration-500 group-hover:rotate-0 group-hover:text-[var(--background)] md:h-8 md:w-8"
                  strokeWidth={1.5}
                />
              </span>
            </button>
          </div>

          {/* Email - Premium style */}
          <div className="footer-fade mt-16">
            <button
              onClick={openContactForm}
              aria-label="Odpri kontaktni obrazec"
              className="group inline-flex items-center gap-6"
            >
              <span
                className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-500 group-hover:border-cyan-400/50"
                aria-hidden="true"
              >
                <span className="absolute inset-0 rounded-full bg-cyan-400/0 transition-all duration-500 group-hover:bg-cyan-400/10" />
                <svg
                  className="h-5 w-5 text-[var(--foreground-subtle)] transition-colors duration-300 group-hover:text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">
                  Pišite nam
                </span>
                <span className="relative text-xl text-[var(--foreground-muted)] transition-colors duration-300 group-hover:text-[var(--foreground)] md:text-2xl">
                  info@nordia.si
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Rounded container - svetlo siv - samo footer grid */}
      <div className="mx-4 mb-4 mt-16 overflow-hidden rounded-[2rem] bg-[#e8e8e8] md:mx-8 md:mb-8 md:mt-24 md:rounded-[2.5rem] lg:mx-12 lg:mb-12 lg:mt-32">
        {/* Inner border for premium feel */}
        <div className="shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">

          {/* Footer content */}
          <div className="footer-content px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
            <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-8">
              {/* Company Info */}
              <div className="footer-fade col-span-2 md:col-span-1">
                <h3 className="font-display text-2xl text-[#1a1a1a]">
                  Nordia d.o.o.
                </h3>
                <div className="mt-5 space-y-2">
                  <p className="text-sm">
                    <span className="text-[#666]">ID za DDV:</span>{" "}
                    <span className="font-mono text-[#1a1a1a]">
                      {companyInfo.vatId}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-[#666]">Mat. št.:</span>{" "}
                    <span className="font-mono text-[#1a1a1a]">
                      {companyInfo.regNumber}
                    </span>
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="footer-fade">
                <h3 className="mb-6 block text-xs uppercase tracking-[0.2em] text-[#1a1a1a]">
                  Navigacija
                </h3>
                <nav
                  className="flex flex-col gap-3"
                  aria-label="Footer navigacija"
                >
                  {navLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-sm text-[#666] transition-colors hover:text-[#1a1a1a]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Social */}
              <div className="footer-fade">
                <h3 className="mb-6 block text-xs uppercase tracking-[0.2em] text-[#1a1a1a]">
                  Družbena
                </h3>
                <nav
                  className="flex flex-col gap-3"
                  aria-label="Družbena omrežja"
                >
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Obiščite Nordia na ${item.label} (odpre se v novem oknu)`}
                      className="text-sm text-[#666] transition-colors hover:text-[#1a1a1a]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact */}
              <div className="footer-fade">
                <h3 className="mb-6 block text-xs uppercase tracking-[0.2em] text-[#1a1a1a]">
                  Lokacija
                </h3>
                <address className="not-italic">
                  <p className="text-sm text-[#666]">
                    {companyInfo.address}
                  </p>
                  <p className="mt-1 text-sm text-[#666]">
                    {companyInfo.country}
                  </p>
                </address>
                <div className="mt-4 flex items-center gap-3">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                  </span>
                  <span className="text-xs text-[#666]">
                    {companyInfo.city}
                  </span>
                  <time
                    className="font-mono text-xs tabular-nums text-[#666]"
                    dateTime={time}
                  >
                    {time}
                  </time>
                </div>
              </div>
            </div>
          </div>

          {/* Velik "Nordia." wordmark z bottom bar */}
          <div className="relative overflow-hidden px-4 pb-8 pt-4 md:px-8 md:pb-12 lg:px-12 lg:pb-16">
            {/* Wordmark */}
            <span
              className="block whitespace-nowrap text-center font-sans text-[24vw] font-medium leading-[0.85] text-[#1a1a1a] md:text-[18vw] lg:text-[14.4vw]"
              style={{ letterSpacing: "-0.05em" }}
              aria-hidden="true"
            >
              Nordia.
            </span>

            {/* Bottom bar - levo in desno od wordmarka */}
            <div className="mt-6 flex items-end justify-between md:mt-8">
              <p className="text-xs text-[#666]">
                © {new Date().getFullYear()} Nordia d.o.o. Vse pravice
                pridržane.
              </p>
              <div className="flex items-center gap-4">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs text-[#666] transition-colors hover:text-[#1a1a1a]"
                  >
                    {link.label}
                  </a>
                ))}
                <span className="font-mono text-xs text-[#666]">
                  {companyInfo.coords}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
