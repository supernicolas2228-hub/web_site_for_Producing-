import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { StarterPackProvider } from "@/components/starter-pack/StarterPackProvider";
import { TrackingProvider } from "@/components/TrackingProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StarterPackProvider>
      <TrackingProvider />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </StarterPackProvider>
  );
}
