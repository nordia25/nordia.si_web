"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRIVACY_SECTIONS = [
  {
    number: "01",
    title: "Uvod",
    content: `Nordia d.o.o. ("mi", "nas" ali "naše") spoštuje vašo zasebnost in se zavezuje k zaščiti vaših osebnih podatkov. Ta politika zasebnosti pojasnjuje, kako zbiramo, uporabljamo in varujemo vaše podatke, ko obiščete našo spletno stran nordia.si.`,
  },
  {
    number: "02",
    title: "Podatki, ki jih zbiramo",
    content: `Zbiramo minimalne podatke za delovanje strani:

• Tehnični podatki: IP naslov, vrsta brskalnika, operacijski sistem, čas obiska
• Analitični podatki: anonimizirana statistika obiskov (če uporabljamo analitiko)
• Kontaktni podatki: samo če nam jih prostovoljno posredujete preko e-pošte`,
  },
  {
    number: "03",
    title: "Kako uporabljamo podatke",
    content: `Vaše podatke uporabljamo izključno za:

• Zagotavljanje delovanja spletne strani
• Izboljšanje uporabniške izkušnje
• Odgovarjanje na vaša vprašanja
• Anonimno analizo prometa

Vaših podatkov nikoli ne prodajamo tretjim osebam.`,
  },
  {
    number: "04",
    title: "Piškotki",
    content: `Naša stran uporablja samo nujne tehnične piškotke za delovanje. Ne uporabljamo sledilnih piškotkov tretjih oseb ali piškotkov za oglaševanje.

Če uporabljamo analitiko, so podatki anonimizirani in ne omogočajo identifikacije posameznika.`,
  },
  {
    number: "05",
    title: "Vaše pravice",
    content: `V skladu z GDPR imate pravico do:

• Dostopa do vaših osebnih podatkov
• Popravka netočnih podatkov
• Izbrisa vaših podatkov ("pravica do pozabe")
• Omejitve obdelave
• Prenosljivosti podatkov
• Ugovora proti obdelavi

Za uveljavljanje pravic nas kontaktirajte na info@nordia.si.`,
  },
  {
    number: "06",
    title: "Varnost podatkov",
    content: `Uporabljamo sodobne varnostne ukrepe za zaščito vaših podatkov:

• SSL/TLS šifriranje
• Varno gostovanje
• Omejen dostop do podatkov
• Redne varnostne posodobitve`,
  },
  {
    number: "07",
    title: "Kontakt",
    content: `Za vprašanja glede zasebnosti nas kontaktirajte:

Nordia d.o.o.
E-pošta: info@nordia.si

Zadnja posodobitev: December 2025`,
  },
];

export default function PrivacyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ".hero-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, delay: 0.4, ease: "power3.inOut" }
      );

      // Section animations on scroll
      const sections = document.querySelectorAll(".privacy-section");
      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 px-6 py-6 md:px-12">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-black/80"
        >
          <svg
            className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
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
          <span className="text-sm font-medium">Nazaj</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <header
        ref={heroRef}
        className="relative flex min-h-[60vh] items-end px-6 pb-16 pt-32 md:min-h-[50vh] md:px-12 md:pb-20"
      >
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-5xl">
          <p className="hero-label mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40 opacity-0">
            Pravni dokument
          </p>
          <h1 className="hero-title mb-8 font-display text-5xl leading-[0.95] tracking-tight opacity-0 md:text-7xl lg:text-8xl">
            Politika
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              zasebnosti
            </span>
          </h1>
          <div className="hero-line h-px w-full origin-left bg-gradient-to-r from-white/20 via-cyan-500/30 to-transparent" />
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/10" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/30" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 pb-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          {PRIVACY_SECTIONS.map((section, index) => (
            <article
              key={section.number}
              className="privacy-section relative border-b border-white/5 py-12 opacity-0 md:py-16"
            >
              {/* Section number */}
              <div className="mb-6 flex items-center gap-4">
                <span className="font-mono text-sm text-cyan-500">
                  {section.number}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
              </div>

              {/* Section title */}
              <h2 className="mb-6 font-display text-2xl tracking-tight md:text-3xl">
                {section.title}
              </h2>

              {/* Section content */}
              <div className="space-y-4 text-sm leading-relaxed text-white/60 md:text-base">
                {section.content.split("\n\n").map((paragraph, pIndex) => (
                  <p key={pIndex} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <p className="mb-6 text-sm text-white/30">Imate vprašanja?</p>
          <a
            href="mailto:info@nordia.si"
            className="group inline-flex items-center gap-3"
          >
            <span className="font-display text-xl transition-colors duration-300 hover:text-cyan-400 md:text-2xl">
              info@nordia.si
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-500">
              <svg
                className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
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
            </span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-mono text-xs text-white/30">
            © {new Date().getFullYear()} Nordia d.o.o.
          </span>
          <Link
            href="/"
            className="font-mono text-xs text-white/30 transition-colors duration-300 hover:text-white"
          >
            nordia.si
          </Link>
        </div>
      </footer>
    </div>
  );
}
