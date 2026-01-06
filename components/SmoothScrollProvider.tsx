"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

// Lenis configuration optimized for ScrollTrigger compatibility
const LENIS_CONFIG = {
  /** Scroll animation duration - shorter = more responsive */
  duration: 1.0,
  /** Lag smoothing threshold in ms */
  lagThreshold: 500,
  /** Minimum frame time (33ms = 30fps floor) */
  lagMinFrameTime: 33,
} as const;

/**
 * Custom easing function for natural scroll feel.
 * Optimized for responsiveness while maintaining smoothness.
 */
function scrollEasing(t: number): number {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Provides smooth scrolling via Lenis library.
 *
 * Enabled on: ALL desktop computers (including older ones)
 * Disabled on: Mobile/tablet devices (< 1024px) or prefers-reduced-motion
 *
 * Lenis improves ScrollTrigger performance by providing consistent
 * scroll events - it should NOT be disabled based on hardware detection.
 */
export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  // Use same logic as horizontal scroll - if simple layout, skip Lenis
  const useSimple = useSimpleLayout();

  useEffect(() => {
    // Skip smooth scroll on mobile/tablet/reduced-motion
    // But keep it enabled on ALL desktops (even older ones)
    if (useSimple) {
      return;
    }

    let lenis: Lenis | null = null;

    try {
      lenis = new Lenis({
        duration: LENIS_CONFIG.duration,
        easing: scrollEasing,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        // Improve touch device handling (for hybrid laptops)
        touchMultiplier: 1.5,
      });

      // Critical: Connect Lenis to ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Use GSAP ticker for synchronized animation frames
      const tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      tickerCallbackRef.current = tickerCallback;

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(
        LENIS_CONFIG.lagThreshold,
        LENIS_CONFIG.lagMinFrameTime
      );
    } catch (error) {
      console.warn("Lenis initialization failed:", error);
    }

    return () => {
      if (tickerCallbackRef.current) {
        gsap.ticker.remove(tickerCallbackRef.current);
      }
      try {
        lenis?.destroy();
      } catch {
        // Ignore destroy errors
      }
    };
  }, [useSimple]);

  return <>{children}</>;
}
