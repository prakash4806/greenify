import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Preloader } from "@/components/preloader"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthSessionProvider } from "@/components/session-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http") ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
  : "https://greenify-web-application.vercel.app"

export const viewport = {
  themeColor: "#2c6455",
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  manifest: "/site.webmanifest",
  title: "Greenify - AI Plant Disease Detection & Diagnosis",
  description:
    "Greenify is an AI-powered plant disease detection platform that identifies crop and leaf diseases from uploaded images. Get instant diagnosis, treatment recommendations, and prevention methods using advanced machine learning.",
  applicationName: "Greenify",
  authors: [{ name: "Greenify" }],
  creator: "Greenify",
  publisher: "Greenify",
  category: "Agriculture",
  keywords: [
    "AI Plant Disease Detection",
    "Plant Disease Detection",
    "Plant Disease Classifier",
    "Crop Disease Detection",
    "Leaf Disease Detection",
    "Machine Learning Agriculture",
    "Agricultural AI",
    "Plant Health",
    "Crop Health",
    "Computer Vision",
    "Deep Learning",
    "Smart Farming",
    "Disease Diagnosis",
    "Plant AI"
  ],
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Greenify",
    title: "Greenify - AI Plant Disease Detection",
    description: "Detect plant diseases instantly using AI-powered image analysis.",
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/images/plant-hero.png",
        width: 1200,
        height: 630,
        alt: "Greenify Plant Disease Detection Banner Image"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenify - AI Plant Disease Detection",
    description: "AI-powered crop disease diagnosis and treatment recommendations.",
    images: ["/images/plant-hero.png"],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Preloader />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ScrollToTop />
            <Toaster />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
