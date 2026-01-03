"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/** Context type for preloader state management */
interface PreloaderContextType {
  isComplete: boolean;
  setComplete: () => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  isComplete: false,
  setComplete: () => {},
});

/**
 * Provider for preloader completion state.
 * Syncs animation timing between Preloader and other components.
 */
export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [isComplete, setIsComplete] = useState(false);

  const setComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isComplete, setComplete }}>
      {children}
    </PreloaderContext.Provider>
  );
}

/** Hook to access preloader completion state */
export function usePreloader() {
  return useContext(PreloaderContext);
}
