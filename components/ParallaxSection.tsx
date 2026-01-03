"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[70vh] overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 -top-[15%] h-[130%] w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.3)), url('/works/parallax.gif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#1a1a1a",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="px-4 text-center font-display text-display-hero uppercase">
          Motion
        </h2>
      </div>
    </section>
  );
}
