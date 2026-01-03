"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

interface SectionDividerProps {
  /** Barva zgornje sekcije */
  fromColor?: string;
  /** Barva spodnje sekcije */
  toColor?: string;
  className?: string;
}

/**
 * Vizualni ločevalec med sekcijami z gradient fade efektom.
 */
export default function SectionDivider({
  fromColor = "#000000",
  toColor = "#000000",
  className = "",
}: SectionDividerProps) {
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
      className={`relative w-full ${className}`}
      style={{
        height: "120px",
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
      }}
    >
      {/* Centralna linija */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div
          ref={lineRef}
          className="h-px w-full origin-center bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            opacity: useSimple ? 1 : 0,
            transform: useSimple ? "scaleX(1)" : "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}
