"use client";

import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import CustomCursor from "./CustomCursor";
import NoiseOverlay from "./NoiseOverlay";
import SmoothScrollProvider from "./SmoothScrollProvider";
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

// Check if should skip preloader (mobile, touch, reduced motion)
function shouldSkipPreloader(): boolean {
  if (typeof window === "undefined") return true;
  const isMobile =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return isMobile || prefersReducedMotion;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // After hydration, check if we should show preloader
  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
      const skipPreloader = shouldSkipPreloader();
      if (!skipPreloader) {
        setShowPreloader(true);
        setIsLoading(true);
      }
    });
  }, []);

  return (
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
  );
}
