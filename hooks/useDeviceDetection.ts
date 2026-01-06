"use client";

import { useSyncExternalStore } from "react";

// Breakpoint constants
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

// Media query constants
const MEDIA_QUERIES = {
  /** Touch-only device (no mouse/trackpad) */
  TOUCH_ONLY: "(hover: none) and (pointer: coarse)",
  REDUCED_MOTION: "(prefers-reduced-motion: reduce)",
} as const;

type DeviceCapabilities = Readonly<{
  isTouch: boolean;
  isMobile: boolean;
  isSlowDevice: boolean;
  prefersReducedMotion: boolean;
  useSimpleLayout: boolean;
}>;

const SERVER_SNAPSHOT: DeviceCapabilities = {
  // Default to desktop layout for SSR - horizontal scroll will render
  // Client updates immediately after hydration if needed
  isTouch: false,
  isMobile: false,
  isSlowDevice: false,
  prefersReducedMotion: false,
  useSimpleLayout: false,
} as const;

/**
 * Safe wrapper for window.matchMedia that handles errors on older browsers.
 */
function safeMatchMedia(query: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/**
 * Checks if device is touch-only (no mouse/trackpad).
 * Returns false for hybrid devices (touchscreen laptops with trackpad).
 */
function checkIsTouchOnly(): boolean {
  if (typeof window === "undefined") return false;
  // Only true if device has NO hover capability AND coarse pointer
  // This excludes hybrid laptops with touchscreens
  return safeMatchMedia(MEDIA_QUERIES.TOUCH_ONLY);
}

/**
 * Checks if user prefers reduced motion.
 */
function checkPrefersReducedMotion(): boolean {
  return safeMatchMedia(MEDIA_QUERIES.REDUCED_MOTION);
}

/**
 * Checks if device is very low-end (for disabling expensive effects like noise).
 * Very conservative - only flags truly limited devices.
 */
function checkIsVeryLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  try {
    // Only flag devices with 2 or fewer cores (single/dual core)
    const cores = navigator.hardwareConcurrency || 0;
    if (cores > 0 && cores <= 2) return true;

    // Only flag devices with 2GB or less RAM
    // @ts-expect-error - deviceMemory is Chrome/Edge only
    const memory = navigator.deviceMemory;
    if (memory && memory <= 2) return true;

    return false;
  } catch {
    return false;
  }
}

function computeCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;

  const isTouchOnly = checkIsTouchOnly();
  const prefersReducedMotion = checkPrefersReducedMotion();
  const isSmallScreen = window.innerWidth < BREAKPOINTS.MOBILE;
  const isDesktopSize = window.innerWidth >= BREAKPOINTS.TABLET;
  const isVeryLowEnd = checkIsVeryLowEnd();

  // useSimpleLayout: ONLY based on screen size and reduced motion
  // All desktops >= 1024px get horizontal scroll (including old computers)
  // Touch detection is NOT used - hybrid laptops should get horizontal scroll
  const shouldUseSimpleLayout = prefersReducedMotion || !isDesktopSize;

  // isSlowDevice: Only for disabling expensive decorative effects (noise overlay)
  // NOT used for layout decisions
  const shouldConsiderSlow = prefersReducedMotion || isTouchOnly || isSmallScreen || isVeryLowEnd;

  return {
    isTouch: isTouchOnly,
    isMobile: isTouchOnly || isSmallScreen,
    isSlowDevice: shouldConsiderSlow,
    prefersReducedMotion,
    useSimpleLayout: shouldUseSimpleLayout,
  };
}

function capabilitiesEqual(a: DeviceCapabilities, b: DeviceCapabilities): boolean {
  return (
    a.isTouch === b.isTouch &&
    a.isMobile === b.isMobile &&
    a.isSlowDevice === b.isSlowDevice &&
    a.prefersReducedMotion === b.prefersReducedMotion &&
    a.useSimpleLayout === b.useSimpleLayout
  );
}

let currentSnapshot: DeviceCapabilities = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();
let stopListening: (() => void) | null = null;

function ensureInitialized() {
  if (initialized) return;
  if (typeof window === "undefined") return;
  currentSnapshot = computeCapabilities();
  initialized = true;
}

function updateSnapshotAndNotify() {
  ensureInitialized();
  const next = computeCapabilities();
  if (capabilitiesEqual(currentSnapshot, next)) return;
  currentSnapshot = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1 && typeof window !== "undefined") {
    ensureInitialized();

    const onChange = () => updateSnapshotAndNotify();

    // Resize affects breakpoints (mobile/tablet layout decisions)
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);

    // Media query changes (reduced motion / touch-only)
    const mqs: MediaQueryList[] = [];
    try {
      mqs.push(window.matchMedia(MEDIA_QUERIES.REDUCED_MOTION));
      mqs.push(window.matchMedia(MEDIA_QUERIES.TOUCH_ONLY));
    } catch {
      // ignore
    }

    mqs.forEach((mq) => {
      try {
        mq.addEventListener("change", onChange);
      } catch {
        // Older Safari
        mq.addListener(onChange);
      }
    });

    stopListening = () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
      mqs.forEach((mq) => {
        try {
          mq.removeEventListener("change", onChange);
        } catch {
          mq.removeListener(onChange);
        }
      });
    };

    // Trigger update after hydration to sync client state
    // This ensures component re-renders if SSR snapshot differs from client
    queueMicrotask(() => {
      const clientSnapshot = computeCapabilities();
      if (!capabilitiesEqual(currentSnapshot, clientSnapshot)) {
        currentSnapshot = clientSnapshot;
        listeners.forEach((l) => l());
      }
    });
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && stopListening) {
      stopListening();
      stopListening = null;
    }
  };
}

function getSnapshot(): DeviceCapabilities {
  ensureInitialized();
  return currentSnapshot;
}

function getServerSnapshot(): DeviceCapabilities {
  return SERVER_SNAPSHOT;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Detects if user prefers reduced motion.
 * SSR-safe: returns false by default.
 */
export function usePrefersReducedMotion(): boolean {
  return useDeviceCapabilities().prefersReducedMotion;
}

/**
 * Detects if the device is a touch device (mobile/tablet).
 * SSR-safe: returns true by default to hide cursor initially.
 */
export function useIsTouchDevice(): boolean {
  return useDeviceCapabilities().isTouch;
}

/**
 * Detects if the device is mobile (touch + small screen).
 * SSR-safe: returns false by default.
 */
export function useIsMobile(): boolean {
  return useDeviceCapabilities().isMobile;
}

/**
 * Detects if the device is likely slow (mobile, tablet, low-end hardware, or prefers reduced motion).
 * SSR-safe: returns false by default.
 */
export function useIsSlowDevice(): boolean {
  return useDeviceCapabilities().isSlowDevice;
}

/**
 * Detects if the device is likely slow - with default true to avoid flash.
 * Used for components that should be hidden on slow devices (like NoiseOverlay).
 * SSR-safe: returns true by default (conservative approach).
 */
export function useIsSlowDeviceConservative(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => getSnapshot().isSlowDevice,
    () => true
  );
}

/**
 * Detects if we should use simple layout (mobile, touch-only tablets, or prefers-reduced-motion).
 * SSR-safe: returns true by default (simple layout for SSR).
 *
 * Horizontal scroll is enabled for ALL desktop computers (old and new), including:
 * - Any device with mouse/trackpad hover capability
 * - Hybrid laptops with touch screens (they have hover from trackpad)
 *
 * Simple layout is used only for:
 * - Touch-only devices (phones, tablets without mouse)
 * - Small screens (< 1024px)
 * - Users who prefer reduced motion
 */
export function useSimpleLayout(): boolean {
  return useDeviceCapabilities().useSimpleLayout;
}
