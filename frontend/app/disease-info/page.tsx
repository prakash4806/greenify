import type { Metadata } from "next"
import DiseaseInfoClient from "./disease-info-client"

export const metadata: Metadata = {
  title: "Plant Disease Library | Greenify",
  description:
    "Browse detailed information about plant diseases, symptoms, treatments, and prevention techniques.",
  alternatives: {
    canonical: "/disease-info",
  },
}

import { JsonLd, getBreadcrumbSchema } from "@/lib/seo-utils"

export default function DiseaseInfoPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Disease Library", item: "/disease-info" }
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <DiseaseInfoClient />
    </>
  )
}
