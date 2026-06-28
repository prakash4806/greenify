import { HeroSection } from "@/components/hero-section"
import { OverviewSection } from "@/components/overview-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { createClient } from "@supabase/supabase-js"
import type { Metadata } from "next"
import { JsonLd, getWebAppSchema, getBreadcrumbSchema } from "@/lib/seo-utils"

export const metadata: Metadata = {
  title: "Greenify | AI Plant Disease Detection",
  description:
    "Upload plant images and receive AI-powered disease diagnosis with treatment and prevention recommendations.",
  alternatives: {
    canonical: "/",
  },
}

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let usersCount = 0
  let scansCount = 0

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
    )
    
    // Parallel exact count requests
    const [profilesRes, diagnosesRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("diagnoses").select("id", { count: "exact", head: true })
    ])
    
    usersCount = profilesRes.count ?? 0
    scansCount = diagnosesRes.count ?? 0
  } catch (err) {
    console.error("Error fetching landing page database statistics:", err)
  }

  const webAppSchema = getWebAppSchema()
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" }
  ])

  return (
    <div className="fade-in">
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      <HeroSection />
      <OverviewSection />
      <FeaturesSection />
      <StatsSection usersCount={usersCount} scansCount={scansCount} />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
