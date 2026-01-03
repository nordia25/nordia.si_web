"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const fillTextRef = useRef<SVGTextElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const taglineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      const textElement = textRef.current;
      const fillTextElement = fillTextRef.current;

      if (!textElement || !fillTextElement) return;

      // Get the length of the text stroke for animation
      const textLength = textElement.getComputedTextLength();

      // Initial state
      gsap.set(textElement, {
        strokeDasharray: textLength,
        strokeDashoffset: textLength,
        opacity: 1,
      });
      gsap.set(fillTextElement, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      });
      gsap.set(taglineRef.current, { opacity: 0, y: 20 });
      gsap.set(taglineFillRef.current, { clipPath: "inset(0 100% 0 0)" });

      // 1. Fade in tagline container
      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power3.out",
      });

      // 2. Draw the stroke (outline)
      tl.to(
        textElement,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.15"
      );

      // 3. Animate tagline fill from left to right (illumination effect)
      tl.to(
        taglineFillRef.current,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power2.inOut",
        },
        "<"
      );

      // 4. Fill reveals from left to right
      tl.to(
        fillTextElement,
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.5,
          ease: "power3.inOut",
        },
        "-=0.3"
      );

      // 5. Fade out stroke
      tl.to(
        textElement,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // 6. Hold briefly
      tl.to({}, { duration: 0.15 });

      // 7. Slide everything up and out
      tl.to(preloaderRef.current, {
        yPercent: -100,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete,
      });
    }, preloaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      {/* Center content */}
      <div className="flex flex-col items-center">
        {/* SVG Logo with stroke animation */}
        <svg
          ref={svgRef}
          viewBox="0 0 400 100"
          className="h-auto w-[300px] md:w-[400px]"
        >
          {/* Stroke text (draws the outline) */}
          <text
            ref={textRef}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-sans font-medium"
            style={{
              fontSize: "72px",
              fill: "none",
              stroke: "rgba(255,255,255,0.9)",
              strokeWidth: "1px",
              letterSpacing: "-0.05em",
            }}
          >
            Nordia.
          </text>

          {/* Fill text (reveals after stroke) */}
          <text
            ref={fillTextRef}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-sans font-medium"
            style={{
              fontSize: "72px",
              fill: "white",
              letterSpacing: "-0.05em",
            }}
          >
            Nordia.
          </text>
        </svg>

        {/* Tagline with progressive illumination */}
        <div ref={taglineRef} className="relative mt-2">
          {/* Base text (dimmed) */}
          <p className="font-sans text-lg font-medium tracking-tight text-white/20 md:text-xl">
            Sodobne rešitve, izdelane z občutkom za detajl.
          </p>
          {/* Fill text (illuminated, clips from left) */}
          <div
            ref={taglineFillRef}
            className="absolute inset-0"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <p className="font-sans text-lg font-medium tracking-tight text-white/70 md:text-xl">
              Sodobne rešitve, izdelane z občutkom za detajl.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
