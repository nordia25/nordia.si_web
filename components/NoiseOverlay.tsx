"use client";

import { useEffect, useRef } from "react";
import { useIsSlowDeviceConservative } from "@/hooks/useDeviceDetection";

/**
 * Subtle animated noise texture overlay for visual depth.
 * Disabled on slow devices to reduce CPU usage.
 * Pauses animation when tab is not visible to save CPU.
 */
export default function NoiseOverlay() {
  const isSlowDevice = useIsSlowDeviceConservative();
  const noiseRef = useRef<HTMLDivElement>(null);

  // Pause animation when tab is hidden (saves CPU)
  useEffect(() => {
    const element = noiseRef.current;
    if (!element) return;

    const update = () => {
      element.classList.toggle("noise--paused", document.hidden);
    };

    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Don't render on slow devices - the constant animation is CPU intensive
  if (isSlowDevice) return null;

  return <div ref={noiseRef} className="noise" aria-hidden="true" />;
}
