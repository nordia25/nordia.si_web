"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PreloaderContextType {
  isComplete: boolean;
  setComplete: () => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  isComplete: false,
  setComplete: () => {},
});

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

export function usePreloader() {
  return useContext(PreloaderContext);
}
