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

export default function DiseaseDetectionPage() {
  return <DiseaseDetectionClient />
}
