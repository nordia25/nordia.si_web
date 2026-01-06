import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import WorksSection from "@/components/WorksSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import AppWrapper from "@/components/AppWrapper";
import SectionSkeleton from "@/components/SectionSkeleton";
import SectionDivider from "@/components/SectionDivider";

/**
 * Home page with RSC + Streaming SSR
 *
 * Server Components fetch data on server, stream HTML as ready.
 * Suspense boundaries enable progressive loading for better UX.
 * HeroSection has no Suspense - critical for LCP.
 */
export default function Home() {
  return (
    <AppWrapper>
      <Header />
      <main>
        {/* HeroSection - No Suspense, critical for LCP */}
        <HeroSection />
        {/* Spacer for fixed hero - maintains document flow */}
        <div className="h-screen" aria-hidden="true" />

        {/* Content wrapper with dark background to cover fixed hero at bottom */}
        <div className="relative z-10 bg-[#0a0a0a]">
          <Suspense fallback={<SectionSkeleton />}>
            <MissionSection />
          </Suspense>
          <SectionDivider fromColor="#111111" toColor="#000000" />
          <Suspense fallback={<SectionSkeleton />}>
            <WorksSection />
          </Suspense>
          <SectionDivider fromColor="#000000" toColor="#111111" />
          <Suspense fallback={<SectionSkeleton />}>
            <TeamSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <Footer />
          </Suspense>
          {/* Floor to ensure hero is fully covered at bottom */}
          <div className="h-1 bg-[#0a0a0a]" aria-hidden="true" />
        </div>
      </main>
    </AppWrapper>
  );
}
