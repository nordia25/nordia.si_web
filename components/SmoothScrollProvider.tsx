"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsSlowDevice } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

// Lenis configuration for smooth, natural-feeling scroll
const LENIS_CONFIG = {
  /** Scroll animation duration in seconds */
  duration: 1.2,
  /** Lag smoothing threshold in ms (helps on slower devices) */
  lagThreshold: 500,
  /** Target FPS for lag smoothing (33ms ≈ 30fps minimum) */
  lagMinFrameTime: 33,
} as const;

/**
 * Custom easing function for natural scroll feel.
 * Based on exponential decay: fast start, smooth deceleration.
 */
function scrollEasing(t: number): number {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Provides smooth scrolling via Lenis library.
 * Automatically disabled on slow/mobile devices for better performance.
 * Falls back to native scroll if initialization fails.
 */
export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  const isSlowDevice = useIsSlowDevice();

  useEffect(() => {
    // Skip smooth scroll on slow devices for better performance
    if (isSlowDevice) {
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
      });

      lenis.on("scroll", ScrollTrigger.update);

      // Store callback in ref to ensure we remove the same function on cleanup
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
      console.warn("Lenis smooth scroll failed to initialize:", error);
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
  }, [isSlowDevice]);

  return <>{children}</>;
}
