"use client";

import { useRef, useState, useCallback, memo } from "react";
import gsap from "gsap";
import { useIsTouchDevice } from "@/hooks/useDeviceDetection";

// Throttle interval in ms (60fps = 16ms)
const THROTTLE_MS = 16;

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glareEnabled?: boolean;
}

function TiltCard({
  children,
  className = "",
  tiltStrength = 15,
  glareEnabled = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const isTouch = useIsTouchDevice();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Throttle to 60fps to reduce layout recalcs
      const now = Date.now();
      if (now - lastMoveTime.current < THROTTLE_MS) return;
      lastMoveTime.current = now;

      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -tiltStrength;
      const rotateY = (mouseX / (rect.width / 2)) * tiltStrength;

      gsap.to(cardRef.current, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: "power2.out",
      });

      // Glare effect
      if (glareEnabled && glareRef.current) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;

        gsap.to(glareRef.current, {
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          duration: 0.3,
        });
      }
    },
    [tiltStrength, glareEnabled]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        background: "transparent",
        duration: 0.3,
      });
    }
  }, []);

  // Only add tilt handlers on non-touch devices
  const mouseHandlers = isTouch
    ? {}
    : {
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      };

  return (
    <div
      ref={cardRef}
      {...mouseHandlers}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {/* Glare effect - always rendered for hydration, hidden on touch via CSS */}
      {glareEnabled && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-10 hidden rounded-2xl md:block"
          style={{ background: "transparent" }}
        />
      )}
    </div>
  );
}

export default memo(TiltCard);
