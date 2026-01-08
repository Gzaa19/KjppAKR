import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HeroSection from "@/components/section/home/HeroSection";
import { TrustedClientsSection } from "@/components/section/home/TrustedClientsSection";
import { ServicesSection } from "@/components/section/home/ServicesSection";
import { WhyChooseUsSection } from "@/components/section/home/WhyChooseUsSection";
import { RecentUpdatesSection } from "@/components/section/home/RecentUpdatesSection";
import { StatsSection } from "@/components/section/home/StatsSection";
import { getPublishedClients } from "@/actions/client";

export default async function Home() {
  const result = await getPublishedClients();
  const { bankClients = [], nonBankClients = [] } = result.success ? result.data! : {};

  return (
    <div className="min-h-screen bg-bg-1">
      <Navbar />
      <HeroSection />
      <TrustedClientsSection bankClients={bankClients} nonBankClients={nonBankClients} />
      <ServicesSection />
      <RecentUpdatesSection />
      <WhyChooseUsSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
