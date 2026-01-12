"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Text segments with styling info */
const TEXT_SEGMENTS = [
  { text: "Smo ", className: "text-white" },
  { text: "digitalna agencija", className: "text-[#3b82f6]" },
  { text: " z jasnim ciljem: graditi spletne rešitve, ki rastejo skupaj z vami. Sodobno, premišljeno, brez kompromisov.", className: "text-white" },
];

const FULL_TEXT = TEXT_SEGMENTS.map(s => s.text).join("");
const BASE_DELAY = 30; // base ms per character

/**
 * "Kdo smo" (Who we are) section
 * - Smooth typewriter effect
 * - Watermark background
 */
export default function KdoSmoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [charIndex, setCharIndex] = useState(0);
  const isTypingRef = useRef(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const startTimeoutRef = useRef<number | null>(null);

  // Derived state: show cursor while typing is in progress
  const showCursor = charIndex > 0 && charIndex < FULL_TEXT.length;

  // Start the typewriter animation (called from ScrollTrigger)
  const startTyping = () => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;
    lastTimeRef.current = 0;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimeRef.current;
      const delay = BASE_DELAY + Math.random() * 10 - 5;

      if (elapsed >= delay) {
        setCharIndex(prev => {
          const next = prev + 1;
          if (next >= FULL_TEXT.length) {
            isTypingRef.current = false;
            return FULL_TEXT.length;
          }
          return next;
        });
        lastTimeRef.current = timestamp;
      }

      if (isTypingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (startTimeoutRef.current) {
        window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ScrollTrigger setup
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const watermark = watermarkRef.current;
      const button = buttonRef.current;

      gsap.set(watermark, { opacity: 0, y: 40 });
      gsap.set(button, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(watermark, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.1,
            ease: "power3.out",
          });

          // Start typewriter after delay
          startTimeoutRef.current = window.setTimeout(startTyping, 400);

          // Button fades in after text completes
          gsap.to(button, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: (FULL_TEXT.length * BASE_DELAY) / 1000 + 0.6,
            ease: "power3.out",
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Render text with proper styling
  const renderText = () => {
    let remaining = charIndex;
    return TEXT_SEGMENTS.map((segment, i) => {
      if (remaining <= 0) return null;
      const chars = Math.min(remaining, segment.text.length);
      remaining -= chars;
      return (
        <span key={i} className={segment.className}>
          {segment.text.slice(0, chars)}
        </span>
      );
    });
  };

  return (
    <section
      id="kdo-smo"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-black"
    >
      {/* Watermark */}
      <span
        ref={watermarkRef}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-display text-[clamp(5.25rem,21vw,21rem)] font-bold uppercase leading-[0.9] tracking-tight text-[#111] md:whitespace-nowrap select-none"
        aria-hidden="true"
      >
        Kdo
        <br className="md:hidden" />
        {" "}smo
      </span>

      {/* Content */}
      <div className="relative px-6 md:px-12 pt-32 md:pt-48 lg:pt-64 pb-32 md:pb-48 lg:pb-64">
        <div className="ml-[5%] md:ml-[15%] lg:ml-[25%] max-w-[50.4rem]">
          {/* Main text with typewriter */}
          <p className="font-display text-[clamp(1.1rem,3vw,2.5rem)] font-medium leading-[1.4] tracking-tight min-h-[4em]">
            {renderText()}
            {showCursor && (
              <span className="cursor-blink inline-block w-[3px] h-[1em] bg-[#3b82f6] ml-0.5 align-text-bottom rounded-sm" />
            )}
          </p>

          {/* CTA Button */}
          <Link
            ref={buttonRef}
            href="#kontakt"
            className="mt-12 inline-block bg-[#3b82f6] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#2563eb]"
          >
            Pogovorimo se
          </Link>
        </div>
      </div>
    </section>
  );
}
