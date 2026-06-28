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
import { Breadcrumb } from "@/components/breadcrumb"

export default function DiseaseInfoPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Disease Library", item: "/disease-info" }
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="w-full max-w-[90vw] mx-auto px-4 pt-16 -mb-16">
        <Breadcrumb items={[{ name: "Disease Library", href: "/disease-info" }]} />
      </div>
      <DiseaseInfoClient />
    </>
  )
}
