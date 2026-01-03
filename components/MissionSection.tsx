"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSimpleLayout } from "@/hooks/useDeviceDetection";

gsap.registerPlugin(ScrollTrigger);

// Code block visual
function CodeBlock() {
  return (
    <div className="font-mono text-sm md:text-base">
      <div className="mb-4 flex gap-2">
        <div className="h-3 w-3 rounded-full bg-white/10" />
        <div className="h-3 w-3 rounded-full bg-white/10" />
        <div className="h-3 w-3 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-cyan-400">performance</span>{" "}
          <span className="text-white/50">=</span>{" "}
          <span className="text-white/30">{"{"}</span>
        </div>
        <div className="pl-4">
          <span className="text-white/50">lighthouse:</span>{" "}
          <span className="text-green-400">100</span>
          <span className="text-white/30">,</span>
        </div>
        <div className="pl-4">
          <span className="text-white/50">lcp:</span>{" "}
          <span className="text-amber-400">&apos;0.8s&apos;</span>
          <span className="text-white/30">,</span>
        </div>
        <div className="pl-4">
          <span className="text-white/50">cls:</span>{" "}
          <span className="text-green-400">0</span>
          <span className="text-white/30">,</span>
        </div>
        <div className="pl-4">
          <span className="text-white/50">fid:</span>{" "}
          <span className="text-amber-400">&apos;12ms&apos;</span>
        </div>
        <div>
          <span className="text-white/30">{"}"}</span>
          <span className="text-white/40">;</span>
        </div>
        <div className="mt-4 text-white/25">// Your site, optimized.</div>
      </div>
    </div>
  );
}

// Design visual - color palette + typography
function DesignVisual() {
  return (
    <div className="space-y-4">
      {/* Color palette */}
      <div className="flex gap-2">
        <div className="h-8 w-8 rounded-lg bg-[#0a0a0a] ring-1 ring-white/10" />
        <div className="h-8 w-8 rounded-lg bg-white" />
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500" />
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
      </div>
      {/* Typography specimen */}
      <div className="space-y-1">
        <p className="font-display text-lg font-bold tracking-tight text-white/80">Aa Bb Cc</p>
        <p className="font-display text-sm font-normal tracking-tight text-white/40">Regular · Medium · Bold</p>
      </div>
    </div>
  );
}

// Automation visual - metrics
function AutomationVisual() {
  return (
    <div className="flex items-center gap-4">
      {/* Metric */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-medium tracking-tight text-white">847</span>
          <span className="flex items-center gap-1 text-xs text-green-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            12%
          </span>
        </div>
        <p className="text-xs text-white/40">avtomatiziranih opravil</p>
      </div>
    </div>
  );
}

export default function MissionSection() {
  const useSimple = useSimpleLayout();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const items = itemRefs.current.filter(Boolean);

      if (useSimple) {
        gsap.set([title, subtitle, ...items], { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out" });
            gsap.to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.2, ease: "power3.out" });
          },
        });
      } else {
        gsap.set(title, { opacity: 0, y: 80 });
        gsap.set(subtitle, { opacity: 0, y: 50 });
        gsap.set(items, { opacity: 0, y: 60 });

        ScrollTrigger.create({
          trigger: title,
          start: "top 80%",
          onEnter: () => {
            gsap.to(title, { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" });
            gsap.to(subtitle, { opacity: 1, y: 0, duration: 1, delay: 0.15, ease: "power3.out" });
          },
        });

        items.forEach((item, i) => {
          if (!item) return;
          ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            onEnter: () => {
              gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: i * 0.1,
                ease: "power3.out",
              });
            },
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, [useSimple]);

  return (
    <section
      id="why"
      ref={sectionRef}
      className="relative z-30 overflow-hidden rounded-t-[2rem] bg-[var(--background)] md:rounded-t-[4rem]"
      style={{
        boxShadow: "0 -30px 80px -20px rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        aria-hidden="true"
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative px-6 py-24 md:px-12 md:py-40 lg:py-48"
      >
        <div className="mx-auto max-w-7xl">

          {/* Editorial Header */}
          <div className="mb-24 md:mb-32">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400/80">
              Filozofija
            </p>

            <h2
              ref={titleRef}
              className="mb-8 font-display text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.95] tracking-tight text-[var(--foreground)]"
            >
              Razlika je
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)" }}
              >
                v detajlih.
              </span>
            </h2>

            <p
              ref={subtitleRef}
              className="max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)] md:text-xl lg:text-2xl"
            >
              Premium ni samo estetika. Je sistem, ki deluje gladko, hitro in brezhibno — tudi ko ga ne gledate.
            </p>
          </div>

          {/* Asymmetric Bento with Lines */}
          <div className="relative">

            {/* Desktop Layout */}
            <div className="hidden md:block">

              {/* Top horizontal line - fades at edges */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Main grid - 2 columns, 50/50, 2 equal rows */}
              <div className="relative grid grid-cols-2 grid-rows-2">

                {/* Vertical line between left and right - sharp, full height */}
                <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white/15" />

                {/* Left item - spans 2 rows */}
                <div
                  ref={(el) => { itemRefs.current[0] = el; }}
                  className="relative row-span-2 py-16 pr-16 lg:py-20 lg:pr-24"
                  onMouseEnter={() => setHoveredModule(0)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  {/* Background that extends to left edge */}
                  <div
                    className="pointer-events-none absolute inset-0 -left-[50vw] transition-colors duration-300"
                    style={{ backgroundColor: hoveredModule === 0 ? "rgba(255,255,255,0.07)" : "transparent" }}
                  />
                  <div className="flex h-full flex-col">
                    <span className="mb-8 inline-block font-mono text-sm text-cyan-400/60">01</span>

                    <h3 className="mb-6 font-display text-4xl font-medium tracking-tight text-[var(--foreground)] lg:text-5xl">
                      Čista koda
                    </h3>

                    <p className="mb-12 max-w-lg text-lg leading-relaxed text-[var(--foreground-muted)] lg:text-xl">
                      Optimizirano za hitrost, SEO in prihodnje nadgradnje. Brez tehničnega dolga, brez kompromisov. Vaša stran bo naložila v trenutku.
                    </p>

                    <div className="mt-auto">
                      <CodeBlock />
                    </div>
                  </div>
                </div>

                {/* Small item 1 - top right */}
                <div
                  ref={(el) => { itemRefs.current[1] = el; }}
                  className="relative flex flex-col py-16 pl-16 lg:py-20 lg:pl-24"
                  onMouseEnter={() => setHoveredModule(1)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  {/* Background that extends to right edge */}
                  <div
                    className="pointer-events-none absolute inset-0 -right-[50vw] transition-colors duration-300"
                    style={{ backgroundColor: hoveredModule === 1 ? "rgba(255,255,255,0.07)" : "transparent" }}
                  />
                  <div className="relative mb-4 flex items-baseline gap-4">
                    <span className="font-mono text-sm text-blue-400/60">02</span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-[var(--foreground)] lg:text-3xl">
                      Dober design
                    </h3>
                  </div>

                  <p className="relative text-base leading-relaxed text-[var(--foreground-muted)]">
                    Vizualna identiteta, ki izstopa in gradi zaupanje pri vsaki interakciji.
                  </p>

                  <div className="relative mt-8">
                    <DesignVisual />
                  </div>
                </div>

                {/* Horizontal line between small items - sharp, spans right column only */}
                <div className="absolute left-1/2 right-0 top-1/2 h-px bg-white/15" />

                {/* Small item 2 - bottom right */}
                <div
                  ref={(el) => { itemRefs.current[2] = el; }}
                  className="relative flex flex-col py-16 pl-16 lg:py-20 lg:pl-24"
                  onMouseEnter={() => setHoveredModule(2)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  {/* Background that extends to right edge */}
                  <div
                    className="pointer-events-none absolute inset-0 -right-[50vw] transition-colors duration-300"
                    style={{ backgroundColor: hoveredModule === 2 ? "rgba(255,255,255,0.07)" : "transparent" }}
                  />
                  <div className="relative mb-4 flex items-baseline gap-4">
                    <span className="font-mono text-sm text-purple-400/60">03</span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-[var(--foreground)] lg:text-3xl">
                      Pametna avtomatizacija
                    </h3>
                  </div>

                  <p className="relative mb-8 text-base leading-relaxed text-[var(--foreground-muted)]">
                    Manj ročnega dela, več časa za tisto, kar šteje.
                  </p>

                  <div className="relative">
                    <AutomationVisual />
                  </div>
                </div>
              </div>

              {/* Bottom horizontal line - fades at edges */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Item 1 */}
              <div
                ref={(el) => { if (!itemRefs.current[0]) itemRefs.current[0] = el; }}
                className="pb-12"
              >
                <span className="mb-4 inline-block font-mono text-xs text-cyan-400/60">01</span>
                <h3 className="mb-3 font-display text-2xl font-medium tracking-tight text-[var(--foreground)]">
                  Čista koda
                </h3>
                <p className="mb-8 text-base leading-relaxed text-[var(--foreground-muted)]">
                  Optimizirano za hitrost, SEO in prihodnje nadgradnje.
                </p>
                <CodeBlock />
              </div>

              <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Item 2 */}
              <div
                ref={(el) => { if (!itemRefs.current[1]) itemRefs.current[1] = el; }}
                className="py-12"
              >
                <span className="mb-4 inline-block font-mono text-xs text-blue-400/60">02</span>
                <h3 className="mb-3 font-display text-2xl font-medium tracking-tight text-[var(--foreground)]">
                  Dober design
                </h3>
                <p className="text-base leading-relaxed text-[var(--foreground-muted)]">
                  Vizualna identiteta, ki izstopa in gradi zaupanje.
                </p>
              </div>

              <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Item 3 */}
              <div
                ref={(el) => { if (!itemRefs.current[2]) itemRefs.current[2] = el; }}
                className="pt-12"
              >
                <span className="mb-4 inline-block font-mono text-xs text-purple-400/60">03</span>
                <h3 className="mb-3 font-display text-2xl font-medium tracking-tight text-[var(--foreground)]">
                  Pametna avtomatizacija
                </h3>
                <p className="mb-8 text-base leading-relaxed text-[var(--foreground-muted)]">
                  Manj ročnega dela, več časa za tisto, kar šteje.
                </p>
                <AutomationVisual />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
