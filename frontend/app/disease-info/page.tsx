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

export default function DiseaseInfoPage() {
  return <DiseaseInfoClient />
}
