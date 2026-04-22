import { About } from "@/components/sections/About";
import { ForWho } from "@/components/sections/ForWho";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { TwoPaths } from "@/components/sections/TwoPaths";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ForWho />
      <TwoPaths />
      <Pricing />
    </>
  );
}
