"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  animation?: "chars" | "words" | "lines";
  delay?: number;
  stagger?: number;
  scrollTrigger?: boolean;
}

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

      gsap.fromTo(
        elements,
        {
          y: "110%",
          rotateX: -80,
          opacity: 0,
        },
        {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          duration: 1.2,
          stagger,
          delay,
          ease: "expo.out",
        }
      );
    };

    if (scrollTrigger) {
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: animateIn,
        once: true,
      });
    } else {
      animateIn();
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [delay, stagger, scrollTrigger]);

  const renderContent = () => {
    if (animation === "chars") {
      return children.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          <span
            className="split-item inline-block"
            style={{ transformStyle: "preserve-3d" }}
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
