"use client";

import { useState, useEffect } from "react";

// Breakpoint constants
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

// Media query constants
const MEDIA_QUERIES = {
  TOUCH: "(hover: none) and (pointer: coarse)",
  REDUCED_MOTION: "(prefers-reduced-motion: reduce)",
} as const;

/**
 * Safe wrapper for window.matchMedia that handles errors on older browsers.
 */
function safeMatchMedia(query: string): boolean {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/**
 * Checks if current device is touch-capable.
 */
function checkIsTouch(): boolean {
  return (
    safeMatchMedia(MEDIA_QUERIES.TOUCH) ||
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" &&
      "maxTouchPoints" in navigator &&
      navigator.maxTouchPoints > 0)
  );
}

/**
 * Checks if user prefers reduced motion.
 */
function checkPrefersReducedMotion(): boolean {
  return safeMatchMedia(MEDIA_QUERIES.REDUCED_MOTION);
}

/**
 * Checks if device has low hardware capabilities (older computer).
 * Detects: low CPU cores, low memory, or older Windows systems.
 */
function checkIsLowEndDevice(): boolean {
  try {
    // Check CPU cores (older computers typically have 2-4 cores)
    const cores = navigator.hardwareConcurrency || 0;
    if (cores > 0 && cores <= 4) return true;

    // Check device memory if available (Chrome/Edge only)
    // @ts-expect-error - deviceMemory is not in all browsers
    const memory = navigator.deviceMemory;
    if (memory && memory <= 4) return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Detects if user prefers reduced motion.
 * SSR-safe: returns false by default.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(checkPrefersReducedMotion());

    try {
      const mediaQuery = window.matchMedia(MEDIA_QUERIES.REDUCED_MOTION);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } catch {
      // Fallback for browsers that don't support matchMedia
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Detects if the device is a touch device (mobile/tablet).
 * SSR-safe: returns true by default to hide cursor initially.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsTouch(checkIsTouch());
    }, 0);
  }, []);

  return isTouch;
}

/**
 * Detects if the device is mobile (touch + small screen).
 * SSR-safe: returns false by default.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMobile(
        safeMatchMedia(MEDIA_QUERIES.TOUCH) ||
          window.innerWidth < BREAKPOINTS.MOBILE
      );
    }, 0);
  }, []);

  return isMobile;
}

/**
 * Detects if the device is likely slow (mobile, tablet, low-end hardware, or prefers reduced motion).
 * SSR-safe: returns false by default.
 */
export function useIsSlowDevice(): boolean {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const isMobile =
        safeMatchMedia(MEDIA_QUERIES.TOUCH) ||
        window.innerWidth < BREAKPOINTS.MOBILE;
      const isLowEnd = checkIsLowEndDevice();
      setIsSlow(checkPrefersReducedMotion() || isMobile || isLowEnd);
    }, 0);
  }, []);

  return isSlow;
}

/**
 * Detects if the device is likely slow - with default true to avoid flash.
 * Used for components that should be hidden on slow devices (like NoiseOverlay).
 * SSR-safe: returns true by default (conservative approach).
 */
export function useIsSlowDeviceConservative(): boolean {
  const [isSlow, setIsSlow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const isMobile =
        safeMatchMedia(MEDIA_QUERIES.TOUCH) ||
        window.innerWidth < BREAKPOINTS.MOBILE;
      const isLowEnd = checkIsLowEndDevice();
      setIsSlow(checkPrefersReducedMotion() || isMobile || isLowEnd);
    }, 0);
  }, []);

  return isSlow;
}

/**
 * Detects if we should use simple layout (mobile, touch, tablets, or prefers-reduced-motion).
 * SSR-safe: returns true by default (simple layout for SSR).
 */
export function useSimpleLayout(): boolean {
  const [isSimple, setIsSimple] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const isMobile = safeMatchMedia(MEDIA_QUERIES.TOUCH);
      const isSmallScreen = window.innerWidth < BREAKPOINTS.TABLET;
      setIsSimple(checkPrefersReducedMotion() || isMobile || isSmallScreen);
    }, 0);
  }, []);

  return isSimple;
}
