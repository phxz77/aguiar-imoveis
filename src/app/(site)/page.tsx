import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { CategorySection } from "@/components/home/CategorySection";
import { RegionsSection } from "@/components/home/RegionsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import {
  getFeaturedProperties,
  TESTIMONIALS,
  REGIONS,
} from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | Corretor de Imóveis Premium em São Paulo`,
  description: SITE_CONFIG.description,
};

export default function HomePage() {
  const featuredProperties = getFeaturedProperties();

  return (
    <>
      <HeroSection />
      <FeaturedProperties properties={featuredProperties} />
      <CategorySection />
      <RegionsSection regions={REGIONS} />
      <BenefitsSection />
      <TestimonialsSection testimonials={TESTIMONIALS} />
      <CTASection />
    </>
  );
}
