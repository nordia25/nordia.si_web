import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AppWrapper from "@/components/AppWrapper";
import SectionSkeleton from "@/components/SectionSkeleton";

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
        <MissionSection />
        <WorksSection />
        <TeamSection />
      </main>
      <Footer />
    </AppWrapper>
  );
}
