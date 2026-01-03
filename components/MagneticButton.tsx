"use client";

import { useRef, ReactNode, useCallback, memo } from "react";
import gsap from "gsap";
import { useIsTouchDevice } from "@/hooks/useDeviceDetection";

// Throttle interval in ms (60fps = 16ms)
const THROTTLE_MS = 16;

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.5,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const lastMoveTime = useRef(0);
  const isTouch = useIsTouchDevice();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Throttle to 60fps to reduce layout recalcs
      const now = Date.now();
      if (now - lastMoveTime.current < THROTTLE_MS) return;
      lastMoveTime.current = now;

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.to(textRef.current, {
        x: x * strength * 0.5,
        y: y * strength * 0.5,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)",
    });

    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  const baseClasses = `
    magnetic-btn relative inline-flex items-center justify-center
    px-8 py-4 text-sm font-medium uppercase tracking-widest
    bg-foreground text-background overflow-hidden
    transition-colors duration-300
    ${className}
  `;

  const content = (
    <span ref={textRef} className="relative z-10">
      {children}
    </span>
  );

  // Only add magnetic handlers on non-touch devices
  const mouseHandlers = isTouch
    ? {}
    : {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
      };

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`group ${baseClasses}`}
        {...mouseHandlers}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={`group ${baseClasses}`}
      onClick={onClick}
      {...mouseHandlers}
    >
      {content}
    </button>
  );
}

export default memo(MagneticButton);
