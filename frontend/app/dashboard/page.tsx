import type { Metadata } from "next"
import DashboardClient from "./dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard | Greenify",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function DashboardPage() {
  return <DashboardClient />
}
