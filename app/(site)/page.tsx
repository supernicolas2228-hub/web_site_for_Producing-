import { About } from "@/components/sections/About";
import { CasesReviews } from "@/components/sections/CasesReviews";
import { ContactSocial } from "@/components/sections/ContactSocial";
import { FAQSection } from "@/components/sections/FAQSection";
import { ForWho } from "@/components/sections/ForWho";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { WhatIGive } from "@/components/sections/WhatIGive";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ForWho />
      <WhatIGive />
      <CasesReviews />
      <Pricing />
      <FAQSection />
      <ContactSocial />
    </>
  );
}
