"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ContactFormContextType {
  isOpen: boolean;
  openContactForm: () => void;
  closeContactForm: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

interface ContactFormProviderProps {
  children: ReactNode;
}

/**
 * Provider for contact form state management.
 * Controls the open/close state of the premium contact form overlay.
 */
export function ContactFormProvider({ children }: ContactFormProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openContactForm = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeContactForm = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactFormContext.Provider value={{ isOpen, openContactForm, closeContactForm }}>
      {children}
    </ContactFormContext.Provider>
  );
}

/**
 * Hook to access contact form state and controls.
 * @throws Error if used outside of ContactFormProvider
 */
export function useContactForm(): ContactFormContextType {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error("useContactForm must be used within a ContactFormProvider");
  }
  return context;
}
