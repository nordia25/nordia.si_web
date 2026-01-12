"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useContactForm } from "@/contexts/ContactFormContext";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";

// Animation timing constants
const ANIMATION = {
  /** Background fade duration */
  bgFade: 0.4,
  /** Menu items animation duration */
  itemsDuration: 0.6,
  /** Stagger delay between menu items */
  itemsStagger: 0.06,
  /** Footer animation duration */
  footerDuration: 0.5,
  /** Close animation duration */
  closeDuration: 0.3,
} as const;

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  href?: string;
  isContactTrigger?: boolean;
}

/** Navigation menu items - STRV style grid */
const menuItems: MenuItem[] = [
  { label: "Kdo smo", href: "#kdo-smo" },
  { label: "Storitve", href: "#works" },
  { label: "Vrednote", href: "#vrednote" },
  { label: "O nas", href: "#about" },
  { label: "Kontakt", isContactTrigger: true },
];

/** Social links */
const socialLinks = [
  { label: "LI", href: "https://linkedin.com/company/nordia", full: "LinkedIn" },
  { label: "IG", href: "https://instagram.com/nordia.si", full: "Instagram" },
];

/**
 * Full-screen navigation overlay with animated menu items.
 * Manages scroll lock and GSAP animations for open/close states.
 */
export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { openContactForm } = useContactForm();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Scroll lock management
    try {
      document.body.style.overflow = isOpen ? "hidden" : "";
    } catch {
      // Non-critical - ignore errors
    }

    // OPTIMIZED: Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (isOpen) {
      // OPTIMIZED: Skip animations for users who prefer reduced motion
      if (prefersReducedMotion) {
        gsap.set(bgRef.current, { opacity: 1 });
        gsap.set(menuItemsRef.current, { yPercent: 0, opacity: 1 });
        gsap.set(footerRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Animate in
      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(bgRef.current, {
        opacity: 1,
        duration: ANIMATION.bgFade,
        ease: "power2.out",
      });

      tl.fromTo(
        menuItemsRef.current,
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: ANIMATION.itemsDuration,
          ease: "power3.out",
          stagger: ANIMATION.itemsStagger,
        },
        "-=0.2"
      );

      tl.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: ANIMATION.footerDuration, ease: "power3.out" },
        "-=0.3"
      );
    } else {
      // OPTIMIZED: Skip close animation for reduced motion
      if (prefersReducedMotion) {
        gsap.set([menuItemsRef.current, footerRef.current, bgRef.current], { opacity: 0 });
        return;
      }

      // Animate out
      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to([menuItemsRef.current, footerRef.current], {
        opacity: 0,
        duration: ANIMATION.closeDuration,
        ease: "power2.in",
      });

      tl.to(bgRef.current, {
        opacity: 0,
        duration: ANIMATION.closeDuration,
        ease: "power2.in",
      }, "-=0.1");
    }

    return () => {
      try {
        document.body.style.overflow = "";
      } catch {
        // Non-critical - ignore errors
      }
      // OPTIMIZED: Cleanup timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isOpen, prefersReducedMotion]);

  const handleLinkClick = (item: MenuItem) => {
    onClose();
    if (item.isContactTrigger) {
      // Small delay to let navigation close animation start
      setTimeout(() => {
        openContactForm();
      }, 100);
    }
  };

  return (
    <div
      ref={navRef}
      id="main-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Glavna navigacija"
      className={`pointer-events-none fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : ""}`}
    >
      {/* Background */}
      <div
        ref={bgRef}
        className={`absolute inset-0 bg-black opacity-0 ${isOpen ? "" : "invisible"}`}
      />

      {/* Content */}
      <div
        className={`relative flex h-full flex-col ${isOpen ? "" : "invisible"}`}
      >
        {/* Header with logo and close button */}
        <header className="relative z-10 px-6 py-6 md:px-12 md:py-8">
          <div className="flex items-center justify-between">
            {/* Empty spacer for balance */}
            <div className="w-24" />

            {/* Center Logo */}
            <Link
              href="/"
              onClick={onClose}
              className="font-sans text-2xl font-medium tracking-tighter text-white md:text-3xl"
            >
              Nordia<span className="text-white/60">.</span>
            </Link>

            {/* Close button - STRV style */}
            <button
              onClick={onClose}
              className="group flex items-center gap-3"
              aria-label="Zapri meni"
            >
              <span className="hidden text-xs font-medium uppercase tracking-widest text-white/60 transition-colors duration-300 group-hover:text-white md:block">
                Zapri
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 transition-all duration-300 group-hover:border-white group-hover:bg-white">
                <svg
                  className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          </div>
        </header>

        {/* Menu items - STRV style grid */}
        <nav className="flex flex-1 items-center justify-center px-6 md:px-12" aria-label="Glavni meni">
          <div className="w-full max-w-6xl">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-16 md:gap-y-6" role="menu">
              {menuItems.map((item, index) => (
                <li
                  key={item.label}
                  ref={(el) => {
                    menuItemsRef.current[index] = el;
                  }}
                  role="none"
                  className="opacity-0"
                >
                  {item.isContactTrigger ? (
                    <button
                      onClick={() => handleLinkClick(item)}
                      role="menuitem"
                      className="group relative"
                    >
                      <span className="font-display text-[clamp(2.5rem,10vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight text-white transition-all duration-300 group-hover:text-white/60">
                        {item.label}
                      </span>
                      {/* Underline */}
                      <span className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-white transition-transform duration-500 group-hover:scale-x-110 md:-bottom-2 md:h-[4px]" />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => handleLinkClick(item)}
                      role="menuitem"
                      className="group relative"
                    >
                      <span className="font-display text-[clamp(2.5rem,10vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight text-white transition-all duration-300 group-hover:text-white/60">
                        {item.label}
                      </span>
                      {/* Underline */}
                      <span className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-white transition-transform duration-500 group-hover:scale-x-110 md:-bottom-2 md:h-[4px]" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer - STRV style */}
        <footer ref={footerRef} className="px-6 pb-6 md:px-12 md:pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left - Copyright & Social */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span className="text-xs uppercase tracking-wider text-white/40">
                © {new Date().getFullYear()} Nordia d.o.o.
              </span>
              <span className="hidden text-white/20 md:inline">/</span>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Obiščite Nordia na ${link.full} (odpre se v novem oknu)`}
                  className="text-xs uppercase tracking-wider text-white/40 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right - Legal links */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a
                href="/zasebnost"
                className="text-xs uppercase tracking-wider text-white/40 transition-colors duration-300 hover:text-white"
              >
                Zasebnost
              </a>
              <a
                href="mailto:info@nordia.si"
                className="text-xs uppercase tracking-wider text-white/40 transition-colors duration-300 hover:text-white"
              >
                info@nordia.si
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
