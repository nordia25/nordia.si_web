"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import gsap from "gsap";
import { useIsSlowDevice } from "@/hooks/useDeviceDetection";

function CustomCursor() {
  // Skip cursor on slow devices (mobile, touch, reduced motion, low-end)
  const isSlowDevice = useIsSlowDevice();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  const updateCursorText = useCallback((text: string) => {
    setCursorText(text);
  }, []);

  useEffect(() => {
    // Skip all cursor logic on slow devices
    if (isSlowDevice) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorTrail = cursorTrailRef.current;
    if (!cursor || !cursorDot || !cursorTrail) return;

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const animate = () => {
      // Calculate velocity
      velocity.current.x = mousePos.current.x - lastPos.current.x;
      velocity.current.y = mousePos.current.y - lastPos.current.y;
      lastPos.current = { ...mousePos.current };

      const speed = Math.sqrt(
        velocity.current.x * velocity.current.x +
          velocity.current.y * velocity.current.y
      );

      // Smooth follow for outer cursor (slower)
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.12;

      // Apply position
      gsap.set(cursor, {
        x: cursorPos.current.x,
        y: cursorPos.current.y,
      });

      // Dot follows mouse exactly
      gsap.set(cursorDot, {
        x: mousePos.current.x,
        y: mousePos.current.y,
      });

      // Trail with lag
      gsap.to(cursorTrail, {
        x: cursorPos.current.x,
        y: cursorPos.current.y,
        duration: 0.5,
        ease: "power2.out",
      });

      // Velocity-based distortion
      const angle = Math.atan2(velocity.current.y, velocity.current.x);
      const stretch = Math.min(speed * 0.015, 0.4);

      gsap.to(cursor, {
        scaleX: 1 + stretch,
        scaleY: 1 - stretch * 0.5,
        rotation: (angle * 180) / Math.PI,
        duration: 0.2,
        ease: "power2.out",
      });

      // Reset distortion when still
      if (speed < 1) {
        gsap.to(cursor, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Hover detection with event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const cursorTextEl = target.closest("[data-cursor-text]");
      if (cursorTextEl) {
        const text = cursorTextEl.getAttribute("data-cursor-text") || "";
        updateCursorText(text);
        setIsHovering(true);
        return;
      }

      if (target.closest('a, button, [role="button"], input, textarea')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (
        relatedTarget?.closest('[data-cursor-text], a, button, [role="button"]')
      ) {
        return;
      }
      setIsHovering(false);
      updateCursorText("");
    };

    // Add passive listeners for better scroll performance
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [updateCursorText, isSlowDevice]);

  // Hover animations
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    if (isHovering) {
      gsap.to(cursor, {
        width: cursorText ? 120 : 80,
        height: cursorText ? 120 : 80,
        backgroundColor: cursorText ? "rgba(255,255,255,0.95)" : "transparent",
        borderWidth: cursorText ? 0 : 1,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(cursorDot, {
        scale: cursorText ? 0 : 0.5,
        opacity: cursorText ? 0 : 0.5,
        duration: 0.3,
      });
    } else {
      gsap.to(cursor, {
        width: 56,
        height: 56,
        backgroundColor: "transparent",
        borderWidth: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(cursorDot, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      });
    }
  }, [isHovering, cursorText]);

  // Click animations
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.to(cursor, {
      scale: isClicking ? 0.85 : 1,
      duration: 0.15,
      ease: "power2.out",
    });
  }, [isClicking]);

  // Don't render anything on slow devices
  if (isSlowDevice) return null;

  return (
    <>
      {/* Trail */}
      <div
        ref={cursorTrailRef}
        className="pointer-events-none fixed left-0 top-0 z-[9996] hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 lg:block"
      />

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 mix-blend-difference lg:flex"
      >
        {cursorText && (
          <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.15em] text-black">
            {cursorText}
          </span>
        )}
      </div>

      {/* Dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference lg:block"
      />
    </>
  );
}

export default memo(CustomCursor);
