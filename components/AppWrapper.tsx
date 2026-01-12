"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import NoiseOverlay from "./NoiseOverlay";
import SmoothScrollProvider from "./SmoothScrollProvider";
import ErrorBoundary from "./ErrorBoundary";
import { ContactFormProvider } from "@/contexts/ContactFormContext";

// Lazy-load ContactForm - only loads when actually opened
const ContactForm = dynamic(() => import("./ContactForm"), { ssr: false });

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  // Reset scroll position on page load to prevent browser scroll restoration
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <ErrorBoundary>
      <ContactFormProvider>
        {/* NoiseOverlay handles SSR internally via useIsSlowDeviceConservative */}
        <NoiseOverlay />
        <SmoothScrollProvider>
          <div style={{ isolation: "isolate" }}>{children}</div>
        </SmoothScrollProvider>
        <ContactForm />
      </ContactFormProvider>
    </ErrorBoundary>
  );
}
