"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowIcon from "./icons/ArrowIcon";

gsap.registerPlugin(ScrollTrigger);

interface Capability {
  number: string;
  title: string;
  titleEn: string;
  description: string;
  items: readonly string[];
  outcome: string;
}

const CAPABILITIES: readonly Capability[] = [
  {
    number: "01",
    title: "Web & Brand Systems",
    titleEn: "Web & Brand Systems",
    description:
      "Celostni sistemi za digitalno prisotnost — od pozicioniranja do izvedbe. Gradimo strukture, ki zdržijo rast in komunicirajo jasno.",
    items: [
      "Positioning + IA + copy okvir",
      "UI sistem (komponente, tipografija, ritem)",
      "Zadržan motion",
      "Performance & SEO (CWV)",
    ] as const,
    outcome: "Enterprise-ready signal + več demo/leadov",
  },
  {
    number: "02",
    title: "Automations & AI",
    titleEn: "Automations & AI",
    description:
      "Avtomatizacije, ki zmanjšajo ročno delo in pospešijo tokove. Integriramo sisteme in implementiramo AI, kjer ima smiseln ROI.",
    items: [
      "Integracije (CRM, email, podatki)",
      "Avtomatizacije procesov",
      "Pragmatičen AI (ROI-driven)",
    ] as const,
    outcome: "Manj ročnega dela + manj napak + hitrejši tokovi",
  },
] as const;

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        }
      );

      // Capability items stagger
      const items = section.querySelectorAll(".capability-accordion");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
            delay: i * 0.1,
          }
        );
      });

      // Signature label animation
      const signature = section.querySelector(".signature-label");
      if (signature) {
        gsap.fromTo(
          signature,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: signature,
              start: "top 90%",
            },
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-[var(--background)] py-40 md:py-56"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background-elevated)] to-[var(--background)]"
        aria-hidden="true"
      />

      <div className="container-wide relative">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-24 flex flex-col gap-12 opacity-0 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-8 text-xs uppercase tracking-[0.3em] text-[var(--foreground-subtle)]">
              Kaj ustvarjamo
            </p>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight text-[var(--foreground)] md:text-6xl lg:text-7xl">
              Kaj
              <br />
              <span className="opacity-40">ustvarjamo</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg">
            Dve močni disciplini. Enoten sistem.
          </p>
        </div>

        {/* Capabilities Accordion */}
        <div className="space-y-0">
          {CAPABILITIES.map((capability, index) => (
            <div
              key={capability.number}
              className="capability-accordion group/accordion relative border-t border-[var(--border)] last:border-b"
            >
              {/* Active indicator line */}
              <div
                className={`absolute bottom-0 left-0 top-0 w-[2px] bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 transition-all duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              />

              {/* Accordion Header */}
              <button
                onClick={() => handleToggle(index)}
                className="group w-full"
                aria-expanded={activeIndex === index}
                aria-controls={`capability-panel-${index}`}
                id={`capability-tab-${index}`}
              >
                <div className="flex items-center gap-6 py-8 pl-4 md:gap-12 md:py-12">
                  {/* Number */}
                  <span
                    className={`font-mono text-sm text-[var(--foreground)] transition-all duration-500 ${
                      activeIndex === index
                        ? "opacity-60"
                        : "opacity-20 group-hover:opacity-40"
                    }`}
                    aria-hidden="true"
                  >
                    {capability.number}
                  </span>

                  {/* Title */}
                  <div className="flex-1 text-left">
                    <h3
                      className={`font-display text-3xl tracking-tight text-[var(--foreground)] transition-all duration-500 md:text-5xl lg:text-6xl ${
                        activeIndex === index
                          ? "opacity-100"
                          : "opacity-60 group-hover:opacity-80"
                      }`}
                    >
                      {capability.title}
                    </h3>
                  </div>

                  {/* Toggle icon */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 ${
                      activeIndex === index
                        ? "bg-[var(--foreground)]/10 border-[var(--border-strong)]"
                        : "group-hover:bg-[var(--foreground)]/5 border-[var(--border)] group-hover:border-[var(--border-strong)]"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`h-5 w-5 text-[var(--foreground)] transition-all duration-500 ${
                        activeIndex === index
                          ? "rotate-45 opacity-70"
                          : "rotate-0 opacity-40"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Accordion Content */}
              <div
                id={`capability-panel-${index}`}
                role="region"
                aria-labelledby={`capability-tab-${index}`}
                className={`grid transition-all duration-700 ease-out ${
                  activeIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-16 pl-4 md:pb-20 md:pl-28">
                    <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                      {/* Description */}
                      <div
                        className={`transform transition-all delay-100 duration-700 ${
                          activeIndex === index
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                      >
                        <p className="mb-10 text-base leading-[1.8] text-[var(--foreground-muted)] md:text-lg">
                          {capability.description}
                        </p>

                        {/* Outcome */}
                        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-400/80">
                            Rezultat
                          </p>
                          <p className="text-base font-medium text-[var(--foreground)]">
                            {capability.outcome}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div
                        className={`transform transition-all delay-200 duration-700 ${
                          activeIndex === index
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                      >
                        <p className="mb-8 text-xs uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">
                          Vključuje
                        </p>
                        <ul className="space-y-4">
                          {capability.items.map((item, i) => (
                            <li
                              key={item}
                              className={`flex transform items-start gap-3 py-2 transition-all duration-500 ${
                                activeIndex === index
                                  ? "translate-x-0 opacity-100"
                                  : "translate-x-4 opacity-0"
                              }`}
                              style={{
                                transitionDelay:
                                  activeIndex === index
                                    ? `${200 + i * 50}ms`
                                    : "0ms",
                              }}
                            >
                              <span
                                className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                aria-hidden="true"
                              />
                              <span className="text-base text-[var(--foreground-muted)]">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nordia Lab Signature */}
        <div className="signature-label mt-20 rounded-2xl border border-white/5 bg-white/[0.02] p-8 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 font-serif text-sm uppercase italic tracking-[0.15em] text-cyan-400">
                Nordia Lab — Digital → Physical (Selected Projects)
              </p>
              <p className="max-w-xl text-base leading-relaxed text-[var(--foreground-muted)]">
                Prototipi, launch assets in brand token kot otipljiv &ldquo;craft
                layer&rdquo;.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="mb-6 text-[var(--foreground-subtle)]">
            Imate projekt v mislih?
          </p>
          <a
            href="mailto:info@nordia.si"
            className="group inline-flex items-center gap-4"
          >
            <span className="font-display text-2xl text-[var(--foreground)] transition-opacity duration-300 hover:opacity-70 md:text-3xl">
              Pogovorimo se
            </span>
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--foreground)] transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <ArrowIcon className="h-5 w-5 -rotate-45 text-[var(--background)] transition-transform duration-300 group-hover:rotate-0" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
