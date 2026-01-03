"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ArrowIcon from "./icons/ArrowIcon";

// Animation timing constants
const ANIMATION = {
  /** Background fade duration */
  bgFade: 0.4,
  /** Menu items animation duration */
  itemsDuration: 0.6,
  /** Stagger delay between menu items */
  itemsStagger: 0.08,
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
  href: string;
  description: string;
}

/** Navigation menu items */
const menuItems: MenuItem[] = [
  { label: "Filozofija", href: "#why", description: "Naš pristop" },
  { label: "Storitve", href: "#works", description: "Kaj ustvarjamo" },
  { label: "O nas", href: "#about", description: "Kdo smo" },
  { label: "Pišite nam", href: "mailto:info@nordia.si", description: "Kontakt" },
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

  useEffect(() => {
    // Scroll lock management
    try {
      document.body.style.overflow = isOpen ? "hidden" : "";
    } catch {
      // Non-critical - ignore errors
    }

    if (isOpen) {
      // Animate in
      const tl = gsap.timeline();

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
      // Animate out
      const tl = gsap.timeline();

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
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
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
      {/* Background - visibility:hidden when closed prevents black screen on GPU failures */}
      <div
        ref={bgRef}
        className={`absolute inset-0 bg-[var(--background)] opacity-0 ${isOpen ? "" : "invisible"}`}
      />

      {/* Content - hidden by default, GSAP animates in */}
      <div
        className={`relative flex h-full flex-col ${isOpen ? "" : "invisible"}`}
      >
        {/* Spacer for header */}
        <div className="h-20 shrink-0 md:h-24" />

        {/* Menu items */}
        <nav className="flex flex-1 flex-col justify-center py-4 md:py-8" aria-label="Glavni meni">
          <div className="container-wide">
            <ul className="space-y-1 md:space-y-2" role="menu">
              {menuItems.map((item, index) => (
                <li
                  key={item.label}
                  ref={(el) => {
                    menuItemsRef.current[index] = el;
                  }}
                  role="none"
                >
                  <a
                    href={item.href}
                    onClick={handleLinkClick}
                    role="menuitem"
                    aria-label={`${item.label} - ${item.description}`}
                    className="group flex items-baseline gap-8 border-b border-[var(--border)] py-2 transition-colors duration-300 hover:border-[var(--border-strong)] md:py-4"
                  >
                    {/* Number */}
                    <span
                      className="font-mono text-sm text-[var(--foreground-subtle)] transition-opacity duration-300 group-hover:opacity-80"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Label */}
                    <span className="relative overflow-hidden">
                      <span className="inline-block font-display text-[clamp(2rem,8vw,6rem)] uppercase leading-none tracking-tight text-[var(--foreground)] transition-transform duration-500 group-hover:-translate-y-full">
                        {item.label}
                      </span>
                      <span
                        className="text-gradient-animated absolute left-0 top-full inline-block font-display text-[clamp(2rem,8vw,6rem)] uppercase leading-none tracking-tight transition-transform duration-500 group-hover:-translate-y-full"
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>

                    {/* Description - shows on hover */}
                    <span className="ml-auto hidden translate-x-4 text-sm opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-[var(--foreground-subtle)] group-hover:opacity-100 md:block">
                      {item.description}
                    </span>

                    {/* Arrow */}
                    <span
                      className="ml-8 hidden h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-300 group-hover:border-[var(--foreground)] group-hover:bg-[var(--foreground)] md:flex"
                      aria-hidden="true"
                    >
                      <ArrowIcon
                        className="h-5 w-5 -rotate-45 text-[var(--foreground-subtle)] transition-all duration-300 group-hover:rotate-0 group-hover:text-[var(--background)]"
                        strokeWidth={1.5}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div ref={footerRef} className="mt-auto shrink-0 pb-6 md:pb-10">
          <div className="container-wide">
            <div className="flex flex-col gap-8 border-t border-[var(--border)] pt-8 md:flex-row md:items-center md:justify-between">
              {/* Socials */}
              <nav className="flex gap-8" aria-label="Družbena omrežja">
                <a
                  href="https://linkedin.com/company/nordia"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Obiščite Nordia na LinkedIn (odpre se v novem oknu)"
                  className="text-sm text-[var(--foreground-subtle)] transition-colors duration-300 hover:text-[var(--foreground)]"
                >
                  LinkedIn
                </a>
              </nav>

              {/* Email */}
              <a
                href="mailto:info@nordia.si"
                aria-label="Pošljite email na info@nordia.si"
                className="group flex items-center gap-3 text-sm text-[var(--foreground-subtle)] transition-colors duration-300 hover:text-[var(--foreground)]"
              >
                <span>info@nordia.si</span>
                <ArrowIcon
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
