"use client";

import { useState, useEffect } from "react";

/**
 * Detects if the device is a touch device (mobile/tablet)
 * SSR-safe: returns true by default to hide cursor initially
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      setIsTouch(
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    });
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
    queueMicrotask(() => {
      setIsMobile(
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
          window.innerWidth < 768
      );
    });
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
    queueMicrotask(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        window.innerWidth < 768;
      setIsSlow(prefersReducedMotion || isMobile);
    });
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
    queueMicrotask(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile =
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        window.innerWidth < 768;
      setIsSlow(prefersReducedMotion || isMobile);
    });
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
    queueMicrotask(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.matchMedia(
        "(hover: none) and (pointer: coarse)"
      ).matches;
      const isSmallScreen = window.innerWidth < 1024;
      setIsSimple(prefersReducedMotion || isMobile || isSmallScreen);
    });
  }, []);

  return isSimple;
}
