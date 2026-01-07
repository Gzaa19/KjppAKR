import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/section/HeroSection";
import { TrustedClientsSection } from "@/components/section/TrustedClientsSection";
import { ServicesSection } from "@/components/section/ServicesSection";
import { WhyChooseUsSection } from "@/components/section/WhyChooseUsSection";
import { RecentUpdatesSection } from "@/components/section/RecentUpdatesSection";
import { StatsSection } from "@/components/section/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-1">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
      </div>
      <TrustedClientsSection />
      <ServicesSection />
      <RecentUpdatesSection />
      <WhyChooseUsSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
