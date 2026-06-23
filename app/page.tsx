import { HeroSection } from "@/components/hero-section"
import { OverviewSection } from "@/components/overview-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <div className="fade-in">
      <HeroSection />
      <OverviewSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
