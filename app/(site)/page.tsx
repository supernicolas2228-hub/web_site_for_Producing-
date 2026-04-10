import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";
import { ForWho } from "@/components/sections/ForWho";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Product } from "@/components/sections/Product";
import { Reviews } from "@/components/sections/Reviews";
import { TwoPaths } from "@/components/sections/TwoPaths";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ForWho />
      <TwoPaths />
      <Product />
      <Reviews />
      <FAQ />
      <Pricing />
    </>
  );
}
