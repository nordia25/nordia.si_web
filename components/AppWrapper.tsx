"use client";

import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import NoiseOverlay from "./NoiseOverlay";
import SmoothScrollProvider from "./SmoothScrollProvider";
import ErrorBoundary from "./ErrorBoundary";
import { PreloaderProvider, usePreloader } from "@/contexts/PreloaderContext";
import { ContactFormProvider } from "@/contexts/ContactFormContext";
import ContactForm from "./ContactForm";

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
 * Safe wrapper for window.matchMedia.
 * Note: This is intentionally duplicated from useDeviceDetection.ts because
 * shouldSkipPreloader() must run synchronously during mount, before hooks execute.
 */
function safeMatchMedia(query: string): boolean {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/**
 * Determines if preloader should be skipped.
 * Skipped on: mobile devices, touch devices, or when user prefers reduced motion.
 */
function shouldSkipPreloader(): boolean {
  if (typeof window === "undefined") return true;
  const isMobile =
    safeMatchMedia("(hover: none) and (pointer: coarse)") ||
    window.innerWidth < 768;
  const prefersReducedMotion = safeMatchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  return isMobile || prefersReducedMotion;
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
  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
      const skipPreloader = shouldSkipPreloader();
      if (!skipPreloader) {
        setShowPreloader(true);
        setIsLoading(true);
      }
    }, 0);
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
          <ContactForm />
        </ContactFormProvider>
      </PreloaderProvider>
    </ErrorBoundary>
  );
}
