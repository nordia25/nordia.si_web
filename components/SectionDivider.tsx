"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

interface SectionDividerProps {
  className?: string;
}

/**
 * Vizualni ločevalec med sekcijami.
 * Gradient linija z scroll animacijo na desktopu.
 */
export default function SectionDivider({ className = "" }: SectionDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const useSimple = useSimpleLayout();

  useEffect(() => {
    if (useSimple || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, dividerRef);

    return () => ctx.revert();
  }, [useSimple]);

  return (
    <div
      ref={dividerRef}
      className={`relative w-full py-8 md:py-12 ${className}`}
      style={{ backgroundColor: "#000000" }}
    >
      <div
        ref={lineRef}
        className="h-px w-full origin-center bg-gradient-to-r from-transparent via-white/15 to-transparent"
        style={{
          opacity: useSimple ? 1 : 0,
          transform: useSimple ? "scaleX(1)" : "scaleX(0)",
        }}
      />
    </div>
  );
}
