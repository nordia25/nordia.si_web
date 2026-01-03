"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Navigation from "./Navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  // Show after preloader
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  // Animate menu button lines
  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(line1Ref.current, {
        rotate: 45,
        y: 4,
        duration: 0.4,
        ease: "power3.inOut",
      });
      gsap.to(line2Ref.current, {
        rotate: -45,
        y: -4,
        duration: 0.4,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(line1Ref.current, {
        rotate: 0,
        y: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
      gsap.to(line2Ref.current, {
        rotate: 0,
        y: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 py-6 transition-opacity duration-700 md:py-8 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isMenuOpen ? "pointer-events-none z-[101]" : "z-40 mix-blend-difference"}`}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group relative font-sans text-xl font-medium tracking-tighter text-white md:text-2xl"
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

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`group pointer-events-auto relative flex items-center gap-4 ${
              isMenuOpen ? "text-[var(--foreground)]" : "text-white"
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
                  className={`absolute h-[1.5px] w-5 origin-center md:w-6 ${
                    isMenuOpen ? "bg-[var(--foreground)]" : "bg-white"
                  }`}
                  style={{ top: "calc(50% - 4px)" }}
                />
                <span
                  ref={line2Ref}
                  className={`absolute h-[1.5px] w-5 origin-center md:w-6 ${
                    isMenuOpen ? "bg-[var(--foreground)]" : "bg-white"
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
                      : "bg-white"
                  }`}
                  style={{ top: "calc(50% - 4px)" }}
                />
                <span
                  className={`duration-400 absolute h-[1.5px] w-5 origin-center transition-transform md:w-6 ${
                    isMenuOpen
                      ? "!top-1/2 -rotate-45 bg-[var(--foreground)]"
                      : "bg-white"
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
