"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Preloader from "./Preloader";
import NoiseOverlay from "./NoiseOverlay";
import SmoothScrollProvider from "./SmoothScrollProvider";
import ErrorBoundary from "./ErrorBoundary";
import { PreloaderProvider, usePreloader } from "@/contexts/PreloaderContext";
import { ContactFormProvider } from "@/contexts/ContactFormContext";
// Lazy-load ContactForm - only loads when actually opened
const ContactForm = dynamic(() => import("./ContactForm"), { ssr: false });

interface AppContentProps {
  children: React.ReactNode;
  showPreloader: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isMounted: boolean;
}

/**
 * Inner component that uses the preloader context.
 * Separated to allow usePreloader hook usage within PreloaderProvider.
 */
function AppContent({ children, showPreloader, isLoading, setIsLoading, isMounted }: AppContentProps) {
  const { setComplete } = usePreloader();

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setComplete();
  };

  return (
    <>
      {showPreloader && isLoading && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}
      {isMounted && <NoiseOverlay />}
      <SmoothScrollProvider>
        {/* Content is always visible - preloader covers it with higher z-index */}
        <div style={{ isolation: "isolate" }}>{children}</div>
      </SmoothScrollProvider>
    </>
  );
}

interface AppWrapperProps {
  children: React.ReactNode;
}

/**
 * Determines if preloader should be skipped.
 * Uses device capability store for consistency with other components.
 * Skipped on: mobile devices, touch devices, or when user prefers reduced motion.
 */
function shouldSkipPreloader(): boolean {
  if (typeof window === "undefined") return true;
  // Use the same detection logic as useDeviceDetection for consistency
  try {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      "ontouchstart" in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isSmallScreen = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return isTouch || isSmallScreen || prefersReducedMotion;
  } catch {
    // Conservative fallback: skip preloader if detection fails
    return true;
  }
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset scroll position on page load to prevent browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // After hydration, check if we should show preloader
  // No setTimeout needed - device detection is synchronous and safe
  useEffect(() => {
    setIsMounted(true);
    const skipPreloader = shouldSkipPreloader();
    if (!skipPreloader) {
      setShowPreloader(true);
      setIsLoading(true);
    }
  }, []);

  return (
    <ErrorBoundary>
      <PreloaderProvider>
        <ContactFormProvider>
          <AppContent
            showPreloader={showPreloader}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isMounted={isMounted}
          >
            {children}
          </AppContent>
          {/* ContactForm lazy-loaded and only renders when context says it's open */}
          <ContactForm />
        </ContactFormProvider>
      </PreloaderProvider>
    </ErrorBoundary>
  );
}
