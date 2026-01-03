"use client";

import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import CustomCursor from "./CustomCursor";
import NoiseOverlay from "./NoiseOverlay";
import SmoothScrollProvider from "./SmoothScrollProvider";
import ErrorBoundary from "./ErrorBoundary";
import { PreloaderProvider, usePreloader } from "@/contexts/PreloaderContext";

// Inner component that uses the preloader context
function AppContent({ children, showPreloader, isLoading, setIsLoading, isMounted }: {
  children: React.ReactNode;
  showPreloader: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  isMounted: boolean;
}) {
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
      {isMounted && <CustomCursor />}
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

// Safe wrapper for window.matchMedia
function safeMatchMedia(query: string): boolean {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

// Check if should skip preloader (mobile, touch, reduced motion)
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
        <AppContent
          showPreloader={showPreloader}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isMounted={isMounted}
        >
          {children}
        </AppContent>
      </PreloaderProvider>
    </ErrorBoundary>
  );
}
