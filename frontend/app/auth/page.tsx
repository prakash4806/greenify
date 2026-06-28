import type { Metadata } from "next"
import AuthClient from "./auth-client"

export const metadata: Metadata = {
  title: "Sign In | Greenify",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function AuthPage() {
  return <AuthClient />
}
