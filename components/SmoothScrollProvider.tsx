"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsSlowDevice } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
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
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      // Store the callback in a ref so we can remove the SAME function
      const tickerCallback = (time: number) => {
        if (lenis) {
          lenis.raf(time * 1000);
        }
      };
      tickerCallbackRef.current = tickerCallback;

      gsap.ticker.add(tickerCallback);

      // Enable lag smoothing for better performance on slower devices
      gsap.ticker.lagSmoothing(500, 33);
    } catch (error) {
      // Lenis failed to initialize - fall back to native scroll
      console.warn('Lenis smooth scroll failed to initialize:', error);
      lenisRef.current = null;
    }

    return () => {
      // Remove the SAME callback function we added
      if (tickerCallbackRef.current) {
        gsap.ticker.remove(tickerCallbackRef.current);
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch {
          // Ignore destroy errors
        }
      }
      lenisRef.current = null;
    };
  }, [isSlowDevice]);

  return <>{children}</>;
}
