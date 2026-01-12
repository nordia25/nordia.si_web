"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";
import type { TeamMember } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// Animation timing constants - OPTIMIZED for snappier feel
const ANIMATION = {
  /** Animation duration */
  duration: 0.7,
  /** Stagger delay between items */
  stagger: 0.12,
} as const;

interface TeamSectionClientProps {
  teamMembers: readonly TeamMember[];
}

/**
 * Client component for team section animations - STRV inspired
 */
export default function TeamSectionClient({
  teamMembers,
}: TeamSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;

    if (!section || !grid) return;

    // OPTIMIZED: Skip animations for users who prefer reduced motion
    if (prefersReducedMotion) {
      gsap.set(headerRef.current, { opacity: 1, y: 0 });
      gsap.set(grid.querySelectorAll(".team-member"), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation with once: true
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION.duration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            once: true, // OPTIMIZED: Kill trigger after activation
          },
        }
      );

      // OPTIMIZED: Using batch() for team members reduces instances
      const items = grid.querySelectorAll(".team-member");
      gsap.set(items, { opacity: 0, y: 30 });

      ScrollTrigger.batch(items, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: ANIMATION.duration,
            stagger: ANIMATION.stagger,
            ease: "power3.out",
          });
        },
      });

    }, section);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-black"
    >
      {/* Watermark - desktop only */}
      <span
        className="pointer-events-none absolute left-6 top-20 hidden select-none font-display text-[20vw] font-bold uppercase leading-[0.8] tracking-tighter text-[#111] md:left-12 md:block"
        aria-hidden="true"
      >
        O nas
      </span>

      {/* Hero headline with editorial number */}
      <div className="relative px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40">
        <div className="relative">
          {/* Mobile label */}
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/30 md:hidden">
            O nas
          </p>

          {/* Main headline */}
          <h2
            ref={headerRef}
            className="max-w-5xl font-display text-[clamp(3rem,9.6vw,8.4rem)] font-medium leading-[0.9] tracking-tight text-white opacity-0"
          >
            Dva razvijalca.
            <br />
            <span className="text-white/40">Ena filozofija.</span>
          </h2>
        </div>
      </div>

      {/* Main content - editorial grid */}
      <div className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left - Pull quote */}
            <div className="lg:col-span-5">
              <blockquote className="relative">
                <span
                  className="absolute -left-2 -top-4 font-serif text-6xl text-blue-500/20 md:-left-4 md:text-7xl"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="relative text-2xl leading-[1.5] text-white/80 md:text-3xl">
                  Ne prodajava ur.
                  <br />
                  <span className="text-white/50">Prodajava rezultate.</span>
                </p>
              </blockquote>

              <p className="mt-6 text-lg leading-[1.7] text-white/40 md:text-xl">
                Vsak projekt obravnavava kot lasten izdelek. Pozornost do
                detajla ni opcija — je standard.
              </p>
            </div>

            {/* Right - Team photos */}
            <div ref={gridRef} className="lg:col-span-7">
              <div className="flex gap-4 md:gap-5">
                {teamMembers.map((member, index) => (
                  <article
                    key={member.name}
                    className={`team-member group flex-1 opacity-0 ${
                      index === 1 ? "mt-12 lg:mt-16" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-xl bg-white/5 md:rounded-2xl">
                      <div className="aspect-[3/4]">
                        <Image
                          src={member.image}
                          alt={`${member.name} - ${member.role}`}
                          fill
                          sizes="(max-width: 768px) 45vw, 30vw"
                          className="object-cover"
                          loading="lazy"
                          quality={85}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQACAwQFERITITEGQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABEQACITH/2gAMAwEAAhEDEQA/AMv8cqKd1wrI5qiKJzXRkvkcQSNjucIi1WVBD//Z"
                        />
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mt-4">
                      <h3 className="font-display text-lg font-medium text-white md:text-xl">
                        {member.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-white/40 md:text-base">
                        {member.role}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
