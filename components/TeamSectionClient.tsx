"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useDeviceDetection";
import type { TeamMember, SocialPlatform } from "@/lib/data";

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
  socialPlatforms: readonly SocialPlatform[];
}

/**
 * Client component for team section animations
 */
export default function TeamSectionClient({
  teamMembers,
  socialPlatforms,
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
      className="relative z-20 bg-[#111111] py-20 pt-40 md:py-32 md:pt-64 lg:py-40 lg:pt-80"
    >
      <div className="container-wide">
        {/* Desktop: Two-column layout - images left, content right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Left side: Team member images side by side */}
          <div
            ref={gridRef}
            className="flex gap-4 md:gap-6 lg:w-1/2"
          >
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="team-member group flex-1 opacity-0"
              >
                {/* Image container with hover effects */}
                <div className="relative overflow-hidden rounded-2xl bg-[var(--card-bg)]">
                  <div className="aspect-[3/4]">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 md:group-hover:scale-105"
                      loading="lazy"
                      quality={75}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQACAwQFERITITEGQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABEQACITH/2gAMAwEAAhEDEQA/AMv8cqKd1wrI5qiKJzXRkvkcQSNjucIi1WVBD//Z"
                    />
                  </div>

                  {/* Hover overlay - gradient from bottom for contrast */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  {/* Content appears on hover */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col p-4 text-white opacity-0 transition-all duration-500 group-hover:opacity-100 md:p-6">
                    <h3 className="mb-1 font-display text-base font-medium tracking-tight md:mb-2 md:text-xl">
                      {member.name}
                    </h3>
                    <p className="text-xs text-white/80 md:text-sm">
                      {member.role}
                    </p>
                    <p className="hidden text-xs text-white/60 md:block">
                      {member.subRole}
                    </p>

                    {/* Social links - hidden on small screens */}
                    <nav
                      className="mt-3 hidden gap-2 md:flex"
                      aria-label={`Družbena omrežja - ${member.name}`}
                    >
                      {socialPlatforms.map((social) => {
                        const href =
                          social.name === "LinkedIn"
                            ? (member.socials && member.socials.linkedin)
                            : (member.socials && member.socials.twitter);
                        return (
                          <a
                            key={social.name}
                            href={href || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} na ${social.name}`}
                            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white/80 transition-all duration-200 hover:bg-white hover:text-black"
                          >
                            <span className="text-xs font-medium">
                              {social.initial}
                            </span>
                          </a>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Mobile: Content below image */}
                <div className="mt-3 md:hidden">
                  <h3 className="mb-1 font-display text-base font-medium tracking-tight text-[var(--foreground)]">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Right side: Content */}
          <header
            ref={headerRef}
            className="opacity-0 lg:w-1/2 lg:flex lg:flex-col"
          >
            {/* Title section */}
            <div>
              <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-[#a8a8a8]">
                O nas
              </p>
              <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.95] tracking-tight text-[var(--foreground)]">
                O{" "}
                <span className="text-[#9ca3af]">
                  Nordii
                </span>
              </h2>
            </div>

            {/* Content section - pushed to bottom on desktop */}
            <div className="mt-8 space-y-5 lg:mt-auto">
              <p className="text-lg leading-relaxed text-[var(--foreground-muted)] md:text-xl">
                Nordio vodiva Taras in Izak. Delava kot usklajena ekipa — najprej
                razumeva vaš cilj, nato zgradiva sistem, ki deluje tiho in zanesljivo.
              </p>
              <p className="text-lg leading-relaxed text-[var(--foreground-muted)] md:text-xl">
                Detajl ni samo estetika. Je način, kako zmanjšujeva trenje,
                gradiva zaupanje in dostaviva rešitve, ki zdržijo rast.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 text-sm text-[var(--foreground-subtle)] md:gap-6">
                <span>Manj besed, več jasnosti.</span>
                <span className="hidden md:inline">·</span>
                <span>Sistem pred improvizacijo.</span>
                <span className="hidden md:inline">·</span>
                <span>Vsak piksel šteje.</span>
              </div>
            </div>
          </header>
        </div>
      </div>
      {/* Bela linija na dnu sekcije */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
    </section>
  );
}
