"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Navigation from "./Navigation";

// Animation timing
const MENU_ANIMATION = {
  duration: 0.4,
  ease: "power3.inOut",
  /** Y offset for hamburger line transform */
  lineOffset: 4,
} as const;

/**
 * Site header with animated logo and hamburger menu.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnHero, setIsOnHero] = useState(true);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  // Track scroll position to determine if we're on hero section
  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const updateOnHero = () => {
      const heroHeight = window.innerHeight;
      const shouldBeOnHero = window.scrollY < heroHeight - 100;
      // Only update state if value actually changed
      setIsOnHero(prev => prev !== shouldBeOnHero ? shouldBeOnHero : prev);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateOnHero);
        ticking = true;
      }
    };

    updateOnHero(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Animate menu button lines
  useEffect(() => {
    const targetRotate = isMenuOpen ? 45 : 0;
    const targetY = isMenuOpen ? MENU_ANIMATION.lineOffset : 0;

    const tween1 = gsap.to(line1Ref.current, {
      rotate: targetRotate,
      y: targetY,
      duration: MENU_ANIMATION.duration,
      ease: MENU_ANIMATION.ease,
    });
    const tween2 = gsap.to(line2Ref.current, {
      rotate: -targetRotate,
      y: -targetY,
      duration: MENU_ANIMATION.duration,
      ease: MENU_ANIMATION.ease,
    });

    // OPTIMIZED: Cleanup tweens on unmount
    return () => {
      tween1.kill();
      tween2.kill();
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 py-6 md:py-8 ${
          isMenuOpen ? "pointer-events-none z-[101]" : "z-40"
        }`}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`group relative font-sans text-xl font-medium tracking-tighter transition-colors duration-300 md:text-2xl ${
              isOnHero ? "text-gray-900" : "text-white"
            }`}
          >
            <span className="relative inline-block overflow-hidden">
              <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                Nordia<span className={isOnHero ? "text-gray-900/60" : "text-white/60"}>.</span>
              </span>
              <span className="absolute left-0 top-full inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                Nordia<span className={isOnHero ? "text-gray-900/60" : "text-white/60"}>.</span>
              </span>
            </span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`group pointer-events-auto relative flex items-center gap-4 transition-colors duration-300 ${
              isMenuOpen ? "text-[var(--foreground)]" : isOnHero ? "text-gray-900" : "text-white"
            }`}
            aria-label={isMenuOpen ? "Zapri meni" : "Odpri meni"}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
          >
            {/* Menu text - slightly smaller than logo */}
            <span className="text-[15px] font-medium uppercase tracking-tighter md:text-[19px]">
              {isMenuOpen ? "Zapri" : "Meni"}
            </span>

            {/* Hamburger icon with slide effect */}
            <div
              className="relative h-7 w-7 overflow-hidden md:h-8 md:w-8"
              aria-hidden="true"
            >
              {/* First set of lines */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-full">
                <span
                  ref={line1Ref}
                  className={`absolute h-[1.5px] w-5 origin-center transition-colors duration-300 md:w-6 ${
                    isMenuOpen ? "bg-[var(--foreground)]" : isOnHero ? "bg-gray-900" : "bg-white"
                  }`}
                  style={{ top: "calc(50% - 4px)" }}
                />
                <span
                  ref={line2Ref}
                  className={`absolute h-[1.5px] w-5 origin-center transition-colors duration-300 md:w-6 ${
                    isMenuOpen ? "bg-[var(--foreground)]" : isOnHero ? "bg-gray-900" : "bg-white"
                  }`}
                  style={{ top: "calc(50% + 4px)" }}
                />
              </div>
              {/* Duplicate lines for hover */}
              <div className="absolute inset-0 flex translate-y-full flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:translate-y-0">
                <span
                  className={`duration-400 absolute h-[1.5px] w-5 origin-center transition-transform md:w-6 ${
                    isMenuOpen
                      ? "!top-1/2 rotate-45 bg-[var(--foreground)]"
                      : isOnHero ? "bg-gray-900" : "bg-white"
                  }`}
                  style={{ top: "calc(50% - 4px)" }}
                />
                <span
                  className={`duration-400 absolute h-[1.5px] w-5 origin-center transition-transform md:w-6 ${
                    isMenuOpen
                      ? "!top-1/2 -rotate-45 bg-[var(--foreground)]"
                      : isOnHero ? "bg-gray-900" : "bg-white"
                  }`}
                  style={{ top: "calc(50% + 4px)" }}
                />
              </div>
            </div>
          </button>
        </div>
      </header>

      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
