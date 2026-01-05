import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AppWrapper from "@/components/AppWrapper";
import SectionSkeleton from "@/components/SectionSkeleton";
import SectionDivider from "@/components/SectionDivider";

// Dynamic imports for below-the-fold content (improves LCP/TBT)
const MissionSection = dynamic(() => import("@/components/MissionSection"), {
  loading: () => <SectionSkeleton />,
});

const WorksSection = dynamic(() => import("@/components/WorksSection"), {
  loading: () => <SectionSkeleton />,
});

const TeamSection = dynamic(() => import("@/components/TeamSection"), {
  loading: () => <SectionSkeleton />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <SectionSkeleton />,
});

export default function Home() {
  return (
    <AppWrapper>
      <Header />
      <main>
        <HeroSection />
        {/* Spacer for fixed hero - maintains document flow */}
        <div className="h-screen" aria-hidden="true" />

        {/* Content wrapper with dark background to cover fixed hero at bottom */}
        <div className="relative z-10 bg-[#0a0a0a]">
          <MissionSection />
          <SectionDivider fromColor="#111111" toColor="#000000" />
          <WorksSection />
          <SectionDivider fromColor="#000000" toColor="#111111" />
          <TeamSection />
          <Footer />
          {/* Floor to ensure hero is fully covered at bottom */}
          <div className="h-1 bg-[#0a0a0a]" aria-hidden="true" />
        </div>
      </main>
    </AppWrapper>
  );
}
