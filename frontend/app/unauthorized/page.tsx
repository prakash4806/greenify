import type { Metadata } from "next"
import UnauthorizedClient from "./unauthorized-client"

export const metadata: Metadata = {
  title: "Access Denied | Greenify",
  robots: {
    index: false,
    follow: false,
  },
}

export default function UnauthorizedPage() {
  return <UnauthorizedClient />
}
