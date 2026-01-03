"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface MarqueeSectionProps {
  text?: string;
  speed?: number;
  direction?: "left" | "right";
}

export default function MarqueeSection({
  text = "Digitalna doživetja",
  speed = 1,
  direction = "left",
}: MarqueeSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Intersection Observer - pause animation when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Feature detection for IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: always visible if IntersectionObserver not supported
      setIsVisible(true);
      return;
    }

    try {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(container);
      return () => observer.disconnect();
    } catch {
      // IntersectionObserver failed - assume visible
      setIsVisible(true);
    }
  }, []);

  // Pause/resume tween based on visibility
  useEffect(() => {
    if (tweenRef.current) {
      if (isVisible) {
        tweenRef.current.resume();
      } else {
        tweenRef.current.pause();
      }
    }
  }, [isVisible]);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Duplicate content for seamless loop
    const content = marquee.innerHTML;
    marquee.innerHTML = content + content;

    // Base animation
    const totalWidth = marquee.scrollWidth / 2;
    const baseSpeed = 50 * speed;
    const duration = totalWidth / baseSpeed;

    tweenRef.current = gsap.to(marquee, {
      x: direction === "left" ? -totalWidth : totalWidth,
      duration,
      ease: "none",
      repeat: -1,
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [direction, speed]);

  const words = [text, "—", text, "—", text, "—", text, "—"];

  return (
    <div
      ref={containerRef}
      className="overflow-hidden border-y border-white/10 py-16 md:py-24"
    >
      <div
        ref={marqueeRef}
        className="flex items-center whitespace-nowrap will-change-transform"
        style={{
          transform:
            direction === "right" ? `translateX(-50%)` : "translateX(0)",
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={`mx-8 font-display text-[clamp(4rem,15vw,12rem)] uppercase ${
              word === "—" ? "text-muted" : "text-foreground"
            }`}
            style={{
              WebkitTextStroke: i % 4 === 0 ? "none" : "1px currentColor",
              WebkitTextFillColor: i % 4 === 0 ? "inherit" : "transparent",
              color: "inherit",
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
