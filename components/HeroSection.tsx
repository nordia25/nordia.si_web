"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import MagneticButton from "./MagneticButton";
import ArrowIcon from "./icons/ArrowIcon";
import { usePreloader } from "@/contexts/PreloaderContext";
import { useContactForm } from "@/contexts/ContactFormContext";

// Service data with refined styling
const services = [
  { name: "Spletne strani", color: "#2563eb" },
  { name: "AI avtomatizacije", color: "#a855f7" },
  { name: "3D tiskanje", color: "#06b6d4" },
];

/**
 * ServiceStripes component - Premium editorial design
 * Refined typography with subtle interactions
 */
function ServiceStripes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isComplete } = usePreloader();

  useEffect(() => {
    if (!containerRef.current || !isComplete) return;

    const items = containerRef.current.querySelectorAll(".service-item");

    // Premium stagger entrance
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }
    );
  }, [isComplete]);

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
      {services.map((service) => (
        <div
          key={service.name}
          className="service-item group relative flex items-center cursor-pointer opacity-0"
        >
          {/* Service name */}
          <span className="text-base md:text-lg font-normal text-gray-600 tracking-wide transition-all duration-500 group-hover:text-gray-900">
            {service.name}
          </span>

          {/* Underline accent */}
          <span
            className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 ease-out group-hover:w-full"
            style={{ backgroundColor: service.color }}
          />
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { openContactForm } = useContactForm();

  return (
    <section
      id="hero"
      ref={heroRef}
      className="fixed left-0 right-0 top-0 z-0 flex min-h-screen overflow-hidden bg-[#e8e8e8]"
    >
      {/* Split Layout Container */}
      <div className="flex w-full min-h-screen">

        {/* Left Side - Editorial Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full px-8 md:px-16 lg:px-20 xl:px-28 py-20 lg:py-0">
            <div className="max-w-xl">

              {/* Main Headline - Bold Editorial Asymmetric */}
              <h1 className="font-display font-bold text-[clamp(3rem,8vw,6rem)] tracking-[-0.04em] text-gray-900 mb-10">
                <span
                  className="block text-[#2563eb]"
                  style={{ lineHeight: 1.1 }}
                >
                  Ustvarjeno
                </span>
                <span
                  className="block text-gray-900 ml-[2em]"
                  style={{ marginTop: "-0.15em", lineHeight: 1.1 }}
                >
                  drugače.
                </span>
              </h1>

              {/* Subtitle */}
              <div className="mb-10 ml-[2em] max-w-lg">
                <p className="text-xl md:text-2xl lg:text-3xl font-light leading-snug">
                  <span className="text-gray-900">Slovensko</span>{" "}
                  <span className="text-gray-900">podjetje</span>{" "}
                  <span className="text-gray-700">za</span>{" "}
                  <span className="text-gray-700">digitalne</span>{" "}
                  <span className="text-gray-700">rešitve</span>
                </p>
                <p className="mt-2 text-lg md:text-xl text-gray-600 font-light italic text-center">
                  Od zasnove do izvedbe, brez kompromisov.
                </p>
              </div>

              {/* Services - Editorial Stripes */}
              <div className="mb-12 ml-[2em] max-w-lg">
                <ServiceStripes />
              </div>

              {/* CTAs - Premium Style */}
              <div className="flex flex-row items-center justify-center gap-6 ml-[2em] max-w-lg">
                {/* Primary CTA - Refined */}
                <MagneticButton
                  onClick={openContactForm}
                  className="group/cta relative !overflow-hidden !rounded-full !border-0 !bg-transparent !p-0"
                  strength={0.25}
                >
                  <span className="relative flex items-center gap-4 rounded-full bg-gray-900 px-8 py-4 transition-all duration-500 group-hover/cta:bg-gray-800">
                    <span className="text-[15px] font-medium text-white tracking-wide">
                      Začnimo projekt
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 transition-all duration-500 group-hover/cta:bg-white/20">
                      <ArrowIcon
                        className="h-4 w-4 text-white transition-transform duration-500 group-hover/cta:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </span>
                </MagneticButton>

                {/* Secondary CTA - Minimal */}
                <a
                  href="#works"
                  className="group/secondary flex items-center gap-3 py-4 text-gray-500 hover:text-gray-900 transition-all duration-500"
                >
                  <span className="text-[15px] font-medium tracking-wide">Naše delo</span>
                  <ArrowIcon
                    className="h-4 w-4 transition-all duration-500 group-hover/secondary:translate-x-1"
                    strokeWidth={2}
                  />
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/works/nordia-hero-us.jpg"
              alt="Nordia Hero"
              fill
              className="object-cover"
              sizes="50vw"
              priority
              quality={85}
            />
          </div>
        </div>

      </div>

      {/* Mobile Image - Shows below content on mobile */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-[40vh] flex items-center justify-center p-6">
        <div className="relative w-[85%] max-w-md h-full rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/works/nordia-hero-us.jpg"
            alt="Nordia Hero"
            fill
            className="object-cover"
            sizes="85vw"
            quality={85}
          />
        </div>
      </div>
    </section>
  );
}
