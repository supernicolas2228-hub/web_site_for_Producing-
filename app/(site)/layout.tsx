import { AnchorSmoothScroll } from "@/components/AnchorSmoothScroll";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SiteBackdrop } from "@/components/SiteBackdrop";
import { SitePreloader } from "@/components/SitePreloader";
import { StarterPackProvider } from "@/components/starter-pack/StarterPackProvider";
import { TrackingProvider } from "@/components/TrackingProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <StarterPackProvider>
      <SitePreloader />
      <SiteBackdrop />
      <div className="relative z-[1] notranslate" translate="no" lang="ru" dir="ltr">
        <AnchorSmoothScroll />
        <TrackingProvider />
        <Navbar />
        <main className="relative overflow-x-clip">{children}</main>
        <Footer />
      </div>
    </StarterPackProvider>
  );
}
