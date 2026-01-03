"use client";

import { useState, useEffect } from "react";

/**
 * Safe wrapper for window.matchMedia that handles errors on older browsers
 */
function safeMatchMedia(query: string): boolean {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/**
 * Detects if the device is a touch device (mobile/tablet)
 * SSR-safe: returns true by default to hide cursor initially
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsTouch(
        safeMatchMedia("(hover: none) and (pointer: coarse)") ||
          "ontouchstart" in window ||
          (typeof navigator !== "undefined" &&
            "maxTouchPoints" in navigator &&
            navigator.maxTouchPoints > 0)
      );
    }, 0);
  }, []);

  return isTouch;
}

/**
 * Detects if the device is mobile (touch + small screen)
 * SSR-safe: returns false by default
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMobile(
        safeMatchMedia("(hover: none) and (pointer: coarse)") ||
          window.innerWidth < 768
      );
    }, 0);
  }, []);

  return isMobile;
}

/**
 * Detects if the device is likely slow (mobile, tablet, or prefers reduced motion)
 * SSR-safe: returns false by default
 */
export function useIsSlowDevice() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const prefersReducedMotion = safeMatchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      const isMobile =
        safeMatchMedia("(hover: none) and (pointer: coarse)") ||
        window.innerWidth < 768;
      setIsSlow(prefersReducedMotion || isMobile);
    }, 0);
  }, []);

  return isSlow;
}

/**
 * Detects if the device is likely slow - with default true to avoid flash
 * Used for components that should be hidden on slow devices (like NoiseOverlay)
 * SSR-safe: returns true by default (conservative)
 */
export function useIsSlowDeviceConservative() {
  const [isSlow, setIsSlow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const prefersReducedMotion = safeMatchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      const isMobile =
        safeMatchMedia("(hover: none) and (pointer: coarse)") ||
        window.innerWidth < 768;
      setIsSlow(prefersReducedMotion || isMobile);
    }, 0);
  }, []);

  return isSlow;
}

/**
 * Detects if we should use simple layout (mobile, touch, tablets, or prefers-reduced-motion)
 * SSR-safe: returns true by default (simple layout for SSR)
 */
export function useSimpleLayout() {
  const [isSimple, setIsSimple] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const prefersReducedMotion = safeMatchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      const isMobile = safeMatchMedia("(hover: none) and (pointer: coarse)");
      const isSmallScreen = window.innerWidth < 1024;
      setIsSimple(prefersReducedMotion || isMobile || isSmallScreen);
    }, 0);
  }, []);

  return isSimple;
}
