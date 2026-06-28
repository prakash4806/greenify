import ScanDetailsClient from "./scan-details-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Scan Report | Greenify",
  robots: {
    index: false,
    follow: false,
  },
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ScanDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ScanDetailsClient scanId={id} />
}
