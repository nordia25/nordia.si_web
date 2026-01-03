"use client";

import { useIsSlowDeviceConservative } from "@/hooks/useDeviceDetection";

/**
 * Subtle animated noise texture overlay for visual depth.
 * Disabled on slow devices to reduce CPU usage.
 */
export default function NoiseOverlay() {
  const isSlowDevice = useIsSlowDeviceConservative();

  // Don't render on slow devices - the constant animation is CPU intensive
  if (isSlowDevice) return null;

  return <div className="noise" aria-hidden="true" />;
}
