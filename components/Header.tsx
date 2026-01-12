"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import Navigation from "./Navigation";
import { useContactForm } from "@/contexts/ContactFormContext";

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
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const { openContactForm } = useContactForm();

  // Track scroll position and direction for header visibility
  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine header visibility based on scroll direction
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();
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

  // Memoize header className to prevent unnecessary string concatenations
  const headerClassName = useMemo(
    () =>
      `fixed left-0 right-0 top-0 py-5 transition-all duration-300 ease-out md:py-8 ${
        isMenuOpen ? "pointer-events-none z-[101] opacity-0" : "z-40 opacity-100"
      } ${isVisible || isMenuOpen ? "translate-y-0" : "-translate-y-full"}`,
    [isMenuOpen, isVisible]
  );

  return (
    <>
      <header className={headerClassName}>
        <div className="container-wide flex items-center justify-between">
          {/* Logo - left on mobile, center on desktop */}
          <Link
            href="/"
            className="group font-sans text-xl font-medium tracking-tighter text-white transition-colors duration-300 md:absolute md:left-1/2 md:-translate-x-1/2 md:text-3xl"
          >
            <span className="relative inline-block overflow-hidden">
              <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                Nordia<span className="text-white/60">.</span>
              </span>
              <span className="absolute left-0 top-full inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                Nordia<span className="text-white/60">.</span>
              </span>
            </span>
          </Link>

          {/* Desktop navigation - hidden on mobile */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#kdo-smo"
              className="group/nav relative text-gray-400 text-sm font-medium tracking-tight uppercase"
            >
              Kdo smo
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-gray-400 transition-all duration-300 ease-out group-hover/nav:w-full" />
            </Link>
            <Link
              href="#vrednote"
              className="group/nav relative text-gray-400 text-sm font-medium tracking-tight uppercase"
            >
              Vrednote
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-gray-400 transition-all duration-300 ease-out group-hover/nav:w-full" />
            </Link>
            <Link
              href="#works"
              className="group/nav relative text-gray-400 text-sm font-medium tracking-tight uppercase"
            >
              Storitve
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-gray-400 transition-all duration-300 ease-out group-hover/nav:w-full" />
            </Link>
            <Link
              href="#about"
              className="group/nav relative text-gray-400 text-sm font-medium tracking-tight uppercase"
            >
              O nas
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-gray-400 transition-all duration-300 ease-out group-hover/nav:w-full" />
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-6">
            {/* Desktop only - email & CTA */}
            <a
              href="mailto:info@nordia.si"
              className="group/mail relative hidden text-white text-sm font-medium tracking-tight uppercase md:block"
            >
              info@nordia.si
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-white transition-all duration-300 ease-out group-hover/mail:w-full" />
            </a>
            <button
              onClick={openContactForm}
              className="hidden bg-white text-black px-6 py-3 text-sm font-medium tracking-tight uppercase transition-colors duration-300 hover:bg-gray-300 md:block"
            >
              Pogovorimo se
            </button>

            {/* Menu Button - always visible */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group pointer-events-auto relative"
              aria-label={isMenuOpen ? "Zapri meni" : "Odpri meni"}
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
            >
              {/* White circle background on hover */}
              <div className="absolute inset-0 -m-2 rounded-full bg-white scale-0 transition-transform duration-300 ease-out group-hover:scale-100" />

              {/* Hamburger icon */}
              <div
                className="relative h-7 w-7 md:h-8 md:w-8"
                aria-hidden="true"
              >
                <span
                  ref={line1Ref}
                  className={`absolute h-[1.5px] w-5 origin-center transition-colors duration-300 md:w-6 left-1/2 -translate-x-1/2 ${
                    isMenuOpen ? "bg-[var(--foreground)]" : "bg-white group-hover:bg-black"
                  }`}
                  style={{ top: "calc(50% - 4px)" }}
                />
                <span
                  ref={line2Ref}
                  className={`absolute h-[1.5px] w-5 origin-center transition-colors duration-300 md:w-6 left-1/2 -translate-x-1/2 ${
                    isMenuOpen ? "bg-[var(--foreground)]" : "bg-white group-hover:bg-black"
                  }`}
                  style={{ top: "calc(50% + 4px)" }}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
