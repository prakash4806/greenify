import type { Metadata } from "next"
import AdminClient from "./admin-client"

export const metadata: Metadata = {
  title: "Admin Panel | Greenify",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function AdminPanelPage() {
  return <AdminClient />
}
