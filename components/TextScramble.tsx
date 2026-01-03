"use client";

import { useRef, useCallback } from "react";

interface TextScrambleProps {
  children: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "a" | "div";
  href?: string;
  onClick?: () => void;
}

const chars = "!<>-_\\/[]{}—=+*^?#________";

export default function TextScramble({
  children,
  className = "",
  as: Component = "span",
  href,
  onClick,
}: TextScrambleProps) {
  const textRef = useRef<HTMLElement>(null);
  const originalText = children;
  const isAnimating = useRef(false);

  const scramble = useCallback(() => {
    if (isAnimating.current || !textRef.current) return;
    isAnimating.current = true;

    const element = textRef.current;
    const length = originalText.length;
    let iteration = 0;
    const maxIterations = length * 3;

    const interval = setInterval(() => {
      element.textContent = originalText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < iteration / 3) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      iteration += 1;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        element.textContent = originalText;
        isAnimating.current = false;
      }
    }, 30);
  }, [originalText]);

  const reset = useCallback(() => {
    if (textRef.current) {
      textRef.current.textContent = originalText;
    }
  }, [originalText]);

  const props = {
    ref: textRef as React.RefObject<HTMLElement>,
    className,
    onMouseEnter: scramble,
    onMouseLeave: reset,
    onClick,
    ...(href && { href }),
  };

  return (
    <Component {...(props as React.HTMLAttributes<HTMLElement>)}>
      {children}
    </Component>
  );
}
