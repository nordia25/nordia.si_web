"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animation timing constants
const ANIMATION = {
  /** Default animation duration */
  duration: 1,
  /** Default stagger between elements */
  defaultStagger: 0.02,
} as const;

interface SplitTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  animation?: "chars" | "words" | "lines";
  delay?: number;
  stagger?: number;
  scrollTrigger?: boolean;
}

/**
 * Animated text component that splits content into chars/words/lines.
 * Each part animates in with scroll-triggered reveal effect.
 */
export default function SplitText({
  children,
  className = "",
  as: Component = "span",
  animation = "chars",
  delay = 0,
  stagger = 0.02,
  scrollTrigger = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasAnimated.current) return;

    const elements = container.querySelectorAll(".split-item");

    const animateIn = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      // Simplified animation without 3D transforms for GPU compatibility
      gsap.fromTo(
        elements,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: ANIMATION.duration,
          stagger,
          delay,
          ease: "power4.out",
        }
      );
    };

    let trigger: ScrollTrigger | null = null;

    if (scrollTrigger) {
      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: animateIn,
        once: true,
      });
    } else {
      animateIn();
    }

    return () => {
      // Only kill this component's trigger, not all ScrollTriggers globally
      if (trigger) {
        trigger.kill();
      }
    };
  }, [delay, stagger, scrollTrigger]);

  const renderContent = () => {
    if (animation === "chars") {
      return children.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <span
            className="split-item inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ));
    }

    if (animation === "words") {
      return children.split(" ").map((word, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden">
          <span className="split-item inline-block">{word}</span>
        </span>
      ));
    }

    // lines
    return children.split("\n").map((line, i) => (
      <span key={i} className="block overflow-hidden">
        <span className="split-item block">{line}</span>
      </span>
    ));
  };

  return (
    <Component ref={containerRef as any} className={className}>
      {renderContent()}
    </Component>
  );
}
