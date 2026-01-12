"use client";

import { useEffect, useRef, useState, FormEvent, memo, useCallback } from "react";
import gsap from "gsap";
import { useContactForm } from "@/contexts/ContactFormContext";
import ArrowIcon from "./icons/ArrowIcon";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";

// Animation timing constants
const ANIMATION = {
  bgFade: 0.5,
  headlineDuration: 0.8,
  headlineStagger: 0.1,
  fieldsDuration: 0.6,
  fieldsStagger: 0.1,
  buttonDuration: 0.5,
  closeDuration: 0.4,
} as const;

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

/**
 * Premium underline input with floating label animation
 * Memoized to prevent re-renders when parent state changes but props remain same
 */
const FormField = memo(function FormField({ label, name, type = "text", value, onChange, required }: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  const baseClasses = `
    w-full bg-transparent border-0 border-b-2 border-white/20
    text-[var(--foreground)] text-lg md:text-xl lg:text-2xl
    py-4 px-0 outline-none transition-all duration-500
    focus:border-transparent
    placeholder:text-transparent
  `;

  return (
    <div className="group relative">
      {/* Floating label */}
      <label
        htmlFor={name}
        className={`
          absolute left-0 transition-all duration-500 pointer-events-none
          ${isActive
            ? "top-0 text-xs md:text-sm text-white/50 -translate-y-6"
            : "top-4 text-lg md:text-xl text-white/50"
          }
        `}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          rows={3}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={baseClasses}
        />
      )}

      {/* Gradient underline on focus */}
      <div
        className={`
          absolute bottom-0 left-0 h-[2px] w-full origin-left
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
          transition-transform duration-500 ease-out
          ${isFocused ? "scale-x-100" : "scale-x-0"}
        `}
      />
    </div>
  );
});

/**
 * Premium full-screen contact form overlay.
 * Features split layout, GSAP animations, and minimalist design.
 */
export default function ContactForm() {
  const { isOpen, closeContactForm } = useContactForm();
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized onChange handlers to prevent FormField re-renders
  const handleNameChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
  }, []);
  const handleEmailChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
  }, []);
  const handleMessageChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, message: value }));
  }, []);
  // Visibility state - stays true during close animation for smooth exit
  const [isVisible, setIsVisible] = useState(false);
  // Track previous open state to detect open/close transitions
  const wasOpenRef = useRef(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeContactForm();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeContactForm]);

  // GSAP animations - handles both open and close transitions
  useEffect(() => {
    // Scroll lock
    document.body.style.overflow = isOpen ? "hidden" : "";

    // Detect open transition
    const justOpened = isOpen && !wasOpenRef.current;
    wasOpenRef.current = isOpen;

    if (justOpened) {
      // Reset form state when opening
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid pattern: responding to prop change, not causing infinite loop
      setIsSuccess(false);
      setError(null);
      setFormData({ name: "", email: "", message: "" });
      setIsVisible(true);
    }

    if (isOpen) {

      // OPTIMIZED: Kill any existing timeline before creating new one
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // OPTIMIZED: Skip animations for users who prefer reduced motion
      if (prefersReducedMotion) {
        gsap.set(bgRef.current, { opacity: 1 });
        gsap.set(contentRef.current, { opacity: 1 });
        gsap.set(closeRef.current, { opacity: 1, y: 0 });
        gsap.set(headlineRefs.current.filter(Boolean), { yPercent: 0, opacity: 1 });
        gsap.set(fieldRefs.current.filter(Boolean), { y: 0, opacity: 1 });
        gsap.set(buttonRef.current, { y: 0, opacity: 1 });
        return;
      }

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Reset all element opacities
      gsap.set(contentRef.current, { opacity: 1 });
      gsap.set(bgRef.current, { opacity: 0 });

      // Background fade in
      tl.to(bgRef.current, {
        opacity: 1,
        duration: ANIMATION.bgFade,
        ease: "power2.out",
      });

      // Close button
      tl.fromTo(
        closeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.3"
      );

      // Headline lines stagger
      tl.fromTo(
        headlineRefs.current.filter(Boolean),
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: ANIMATION.headlineDuration,
          stagger: ANIMATION.headlineStagger,
          ease: "power4.out",
        },
        "-=0.2"
      );

      // Form fields stagger
      tl.fromTo(
        fieldRefs.current.filter(Boolean),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: ANIMATION.fieldsDuration,
          stagger: ANIMATION.fieldsStagger,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Submit button
      tl.fromTo(
        buttonRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: ANIMATION.buttonDuration,
          ease: "power3.out",
        },
        "-=0.3"
      );
    } else if (isVisible) {
      // OPTIMIZED: Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // OPTIMIZED: Skip close animation for reduced motion
      if (prefersReducedMotion) {
        gsap.set([contentRef.current, bgRef.current], { opacity: 0 });
        setIsVisible(false);
        return;
      }

      // Only animate out if currently visible
      const tl = gsap.timeline({
        onComplete: () => {
          // Hide only after animation completes
          setIsVisible(false);
        },
      });
      timelineRef.current = tl;

      // Fade out all content elements together
      tl.to(
        [contentRef.current, bgRef.current],
        {
          opacity: 0,
          duration: ANIMATION.closeDuration,
          ease: "power2.in",
        }
      );
    }

    return () => {
      try {
        document.body.style.overflow = "";
      } catch {
        // Non-critical
      }
      // OPTIMIZED: Cleanup timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isOpen, isVisible, prefersReducedMotion]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Napaka pri pošiljanju");
      }

      setIsSuccess(true);

      // Auto close after success
      setTimeout(() => {
        closeContactForm();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prišlo je do napake");
    } finally {
      setIsSubmitting(false);
    }
  };

  const headlineWords = ["Začnimo", "projekt."];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Kontaktni obrazec"
      className={`pointer-events-none fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : ""}`}
    >
      {/* Background */}
      <div
        ref={bgRef}
        className={`absolute inset-0 bg-[#0a0a0a] opacity-0 ${isVisible ? "" : "invisible"}`}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={`relative flex h-full flex-col ${isVisible ? "" : "invisible"}`}
      >

        {/* Close button */}
        <button
          ref={closeRef}
          onClick={closeContactForm}
          className="absolute right-6 top-6 z-10 flex items-center gap-3 text-white/60 transition-colors duration-300 hover:text-white md:right-12 md:top-8"
          aria-label="Zapri obrazec"
        >
          <span className="text-sm font-medium uppercase tracking-wider">Zapri</span>
          <div className="relative h-8 w-8">
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
          </div>
        </button>

        {/* Main content - split layout */}
        <div className="flex flex-1 flex-col md:flex-row">

          {/* Left side - Headline */}
          <div className="flex flex-1 items-center justify-center px-8 pt-24 md:px-16 md:pt-0">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(3rem,12vw,9rem)] font-medium leading-[0.9] tracking-tight">
                {headlineWords.map((word, index) => (
                  <span key={word} className="block overflow-hidden pb-2">
                    <span
                      ref={(el) => { headlineRefs.current[index] = el; }}
                      className={`inline-block ${
                        index === 0 ? "text-white" : "text-white/50"
                      }`}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h2>

              {/* Decorative line */}
              <div className="mt-8 h-px w-64 bg-[#2563eb] md:mt-12 md:w-72" />

              <p className="mt-6 text-lg text-white/50 md:mt-8 md:text-xl">
                Povejte nam o vašem projektu.
                <br />
                Odgovorimo v 24 urah.
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-1 items-center justify-center px-8 pb-12 md:px-16 md:pb-0">
            <div className="w-full max-w-lg">
              {isSuccess ? (
                // Success state
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-400">
                    <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl font-medium text-white md:text-4xl">
                    Hvala!
                  </h3>
                  <p className="mt-4 text-lg text-white/50">
                    Sporočilo je bilo poslano.
                  </p>
                </div>
              ) : (
                // Form
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}
                  <div
                    ref={(el) => { fieldRefs.current[0] = el; }}
                  >
                    <FormField
                      label="Ime"
                      name="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>

                  <div
                    ref={(el) => { fieldRefs.current[1] = el; }}
                  >
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>

                  <div
                    ref={(el) => { fieldRefs.current[2] = el; }}
                  >
                    <FormField
                      label="Sporočilo"
                      name="message"
                      type="textarea"
                      value={formData.message}
                      onChange={handleMessageChange}
                      required
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    ref={buttonRef}
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative mt-12 flex w-full items-center justify-center gap-4 overflow-hidden rounded-full border border-white/20 bg-transparent py-5 text-white transition-all duration-500 hover:border-white/40 hover:bg-white/5 disabled:opacity-50 md:py-6"
                  >
                    <span className="text-lg font-medium tracking-wide md:text-xl">
                      {isSubmitting ? "Pošiljam..." : "Pošlji sporočilo"}
                    </span>
                    {!isSubmitting && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:bg-white/20">
                        <ArrowIcon
                          className="h-5 w-5 text-white transition-transform duration-500 group-hover:translate-x-0.5"
                          strokeWidth={2}
                        />
                      </span>
                    )}
                    {isSubmitting && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="hidden shrink-0 pb-8 text-center md:block">
          <span className="text-sm text-white/50">
            Lahko nas dosežete tudi na{" "}
            <a
              href="mailto:info@nordia.si"
              className="text-white/50 underline transition-colors duration-300 hover:text-white"
            >
              info@nordia.si
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
