import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import KdoSmoSection from "@/components/KdoSmoSection";
import MissionSection from "@/components/MissionSection";
import WorksSection from "@/components/WorksSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import AppWrapper from "@/components/AppWrapper";
import SectionSkeleton from "@/components/SectionSkeleton";

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

        {/* KdoSmo section - outside black wrapper to show fixed background through cutout */}
        <KdoSmoSection />

        {/* Content sections */}
        <div className="relative bg-black">
          <Suspense fallback={<SectionSkeleton />}>
            <MissionSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <WorksSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <TeamSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <Footer />
          </Suspense>
        </div>
      </main>
    </AppWrapper>
  );
}
