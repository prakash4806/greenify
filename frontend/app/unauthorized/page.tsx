import type { Metadata } from "next"
import UnauthorizedClient from "./unauthorized-client"

export const metadata: Metadata = {
  title: "Access Denied | Greenify",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function UnauthorizedPage() {
  return <UnauthorizedClient />
}
