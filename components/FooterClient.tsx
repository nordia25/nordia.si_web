"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContactForm } from "@/contexts/ContactFormContext";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";
import type { SocialLink, LegalLink } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// Animation timing constants
const ANIMATION = {
  /** CTA word reveal duration */
  ctaDuration: 0.8,
  /** Stagger delay between items */
  stagger: 0.08,
} as const;

interface FooterClientProps {
  socialLinks: readonly SocialLink[];
  legalLinks: readonly LegalLink[];
}

/**
 * Client component for footer animations and interactivity
 */
export default function FooterClient({
  socialLinks,
  legalLinks,
}: FooterClientProps) {
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { openContactForm } = useContactForm();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // OPTIMIZED: Skip animations for users who prefer reduced motion
    if (prefersReducedMotion) {
      const words = ctaRef.current?.querySelectorAll(".word");
      if (words) gsap.set(words, { yPercent: 0, opacity: 1 });
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
              once: true,
            },
            onComplete: () => {
              words.forEach((word) => {
                gsap.set(word, { clearProps: "opacity" });
              });
            },
          }
        );
      }
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
                      className="absolute -bottom-2 left-0 h-[5px] w-full origin-left scale-x-100 bg-blue-500 transition-transform duration-500 group-hover:scale-x-105 md:-bottom-3 md:h-[8px]"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer bar - STRV style single row */}
      <div className="border-t border-white/[0.08] px-6 py-6 md:px-12">
        <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left - Copyright + Social */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs uppercase tracking-wider text-white">
              © {new Date().getFullYear()} Nordia d.o.o.
            </span>
            <span className="text-white/40">/</span>
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Obiščite Nordia na ${item.label} (odpre se v novem oknu)`}
                className="text-xs uppercase tracking-wider text-white transition-opacity duration-300 hover:opacity-60"
              >
                {item.label === "LinkedIn" ? "LI" : item.label === "Instagram" ? "IG" : item.label === "GitHub" ? "GH" : item.label}
              </a>
            ))}
          </div>

          {/* Right - Legal + Back to top */}
          <div className="flex items-center gap-x-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-wider text-white transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-white transition-opacity duration-300 hover:opacity-60"
              aria-label="Pomakni se na vrh strani"
            >
              <span>↑</span>
              <span>Na vrh</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
