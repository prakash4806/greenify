import ScanDetailsClient from "./scan-details-client"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ScanDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ScanDetailsClient scanId={id} />
}
