"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Mouse tracking for parallax
  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      // Main 404 animation
      gsap.fromTo(
        ".hero-404",
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
        }
      );

      // Subtitle
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
        }
      );

      // Description
      gsap.fromTo(
        ".hero-description",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        }
      );

      // Buttons
      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.8,
          ease: "power3.out",
        }
      );

      // Floating elements
      gsap.fromTo(
        ".float-element",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isMounted]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6"
    >
      {/* Gradient background orbs */}
      <div
        className="pointer-events-none absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)",
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          transition: "transform 0.5s ease-out",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)",
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: "transform 0.5s ease-out",
        }}
      />

      {/* Floating geometric elements */}
      <div
        className="float-element pointer-events-none absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-cyan-500/30"
        style={{
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="float-element pointer-events-none absolute right-[15%] top-[30%] h-3 w-3 rounded-full border border-white/10"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="float-element pointer-events-none absolute bottom-[25%] left-[20%] h-1.5 w-1.5 rounded-full bg-blue-500/40"
        style={{
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="float-element pointer-events-none absolute bottom-[35%] right-[10%] h-4 w-4 rounded-full border border-cyan-500/20"
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="float-element pointer-events-none absolute right-[25%] top-[15%] h-px w-16 rotate-45 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          transform: `rotate(45deg) translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="float-element pointer-events-none absolute bottom-[20%] left-[15%] h-px w-12 -rotate-45 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        style={{
          transform: `rotate(-45deg) translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* 404 Typography */}
        <div
          className="hero-404 relative mb-6 opacity-0"
          style={{
            transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* Shadow layer */}
          <div className="absolute inset-0 select-none font-display text-[150px] font-bold leading-none text-white/[0.02] blur-sm md:text-[220px] lg:text-[300px]">
            404
          </div>

          {/* Main text with gradient */}
          <h1 className="relative select-none font-display text-[150px] font-bold leading-none md:text-[220px] lg:text-[300px]">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 25%, #22d3ee 50%, #3b82f6 75%, rgba(255,255,255,0.8) 100%)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 8s ease infinite",
              }}
            >
              404
            </span>
          </h1>

          {/* Decorative line under 404 */}
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent md:w-48" />
        </div>

        {/* Subtitle */}
        <h2 className="hero-subtitle mb-4 font-display text-xl tracking-wide opacity-0 md:text-2xl lg:text-3xl">
          Stran ne obstaja
        </h2>

        {/* Description */}
        <p className="hero-description mx-auto mb-10 max-w-md text-sm leading-relaxed text-white/50 opacity-0 md:text-base">
          Iskana stran je bila premaknjena ali ne obstaja. Vrnite se na domačo
          stran ali nas kontaktirajte za pomoč.
        </p>

        {/* Buttons */}
        <div className="hero-buttons flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row">
          <Link
            href="/"
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 font-medium text-black transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <svg
              className="relative z-10 h-4 w-4 rotate-180 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Nazaj domov
            </span>
          </Link>

          <a
            href="mailto:info@nordia.si"
            className="group relative overflow-hidden rounded-full border border-white/20 px-8 py-4 font-medium transition-all duration-300 hover:border-white/40"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-cyan-400">
              Kontaktirajte nas
            </span>
          </a>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-8 top-8 hidden md:block">
        <div className="h-16 w-px bg-gradient-to-b from-white/20 to-transparent" />
        <div className="absolute left-0 top-0 h-px w-16 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 hidden md:block">
        <div className="absolute bottom-0 right-0 h-16 w-px bg-gradient-to-t from-white/20 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-16 bg-gradient-to-l from-white/20 to-transparent" />
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
          Nordia
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
