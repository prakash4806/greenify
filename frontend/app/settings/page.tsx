import type { Metadata } from "next"
import SettingsClient from "./settings-client"

export const metadata: Metadata = {
  title: "Settings | Greenify",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function SettingsPage() {
  return <SettingsClient />
}
