import type { Metadata } from "next"
import DiseaseDetectionClient from "./disease-detection-client"

export const metadata: Metadata = {
  title: "AI Disease Detection | Greenify",
  description:
    "Upload a leaf image and detect plant diseases instantly using AI.",
  alternatives: {
    canonical: "/disease-detection",
  },
}

import { JsonLd, getBreadcrumbSchema } from "@/lib/seo-utils"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DiseaseDetectionPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Disease Detection", item: "/disease-detection" }
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="w-full max-w-[90vw] mx-auto px-4 pt-16 -mb-16">
        <Breadcrumb items={[{ name: "Disease Detection", href: "/disease-detection" }]} />
      </div>
      <DiseaseDetectionClient />
    </>
  )
}
