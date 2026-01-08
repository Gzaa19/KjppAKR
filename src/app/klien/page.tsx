import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientListSection } from "@/components/section/klien/ClientListSection";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { getPublishedClients } from "@/actions/client";

export default async function Klien() {
    const result = await getPublishedClients();
    const { allClients = [], bankClients = [], nonBankClients = [] } = result.success ? result.data! : {};

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <ParallaxBackground
                imageUrl="https://plus.unsplash.com/premium_photo-1661768507909-f961fcff0d45?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xpZW50fGVufDB8fDB8fHww"
                alt="Client Background"
            />

            <ClientListSection
                allClients={allClients}
                bankClients={bankClients}
                nonBankClients={nonBankClients}
            />

            <div className="relative z-10 -mt-20">
                <Footer />
            </div>
        </div>
    );
}