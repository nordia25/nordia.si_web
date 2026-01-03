"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  subRole: string;
  image: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface SocialPlatform {
  name: string;
  initial: string;
}

const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    name: "Nikolaj Taras Fras",
    role: "CEO - Komercialni direktor",
    subRole: "Frontend developer",
    image: "/team/taras.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/taras-fras",
      twitter: "https://twitter.com/tarasfras",
    },
  },
  {
    name: "Izak Ivančič",
    role: "CTO - Tehnični direktor",
    subRole: "Backend developer",
    image: "/team/izak.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/izak-ivancic",
      twitter: "https://twitter.com/izakivancic",
    },
  },
] as const;

const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  { name: "LinkedIn", initial: "L" },
  { name: "Twitter", initial: "X" },
] as const;

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;

    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        }
      );

      // Stagger fade in for team member cards
      const items = grid.querySelectorAll(".team-member");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            },
            delay: i * 0.15,
          }
        );
      });

    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 bg-[var(--background)] py-20 pt-40 md:py-32 md:pt-64 lg:py-40 lg:pt-80"
    >
      <div className="container-wide">
        {/* Desktop: Two-column layout - images left, content right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Left side: Team member images side by side */}
          <div
            ref={gridRef}
            className="flex gap-4 md:gap-6 lg:w-1/2"
          >
            {TEAM_MEMBERS.map((member) => (
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
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 md:group-hover:scale-105"
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
                      {SOCIAL_PLATFORMS.map((social) => {
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
                            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-black"
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
    </section>
  );
}
