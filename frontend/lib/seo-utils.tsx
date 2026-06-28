import React from "react"
import { diseaseDatabase } from "@/lib/disease-db"

// Base URL helper
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_SITE_URL
    ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http") ? process.env.NEXT_PUBLIC_SITE_URL : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
    : "https://greenify-web-application.vercel.app"
}

// JSON-LD Script Wrapper Component
export function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// 1. WebApplication Schema for Homepage
export const getWebAppSchema = () => {
  const url = getBaseUrl()
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Greenify",
    "url": url,
    "description": "AI-powered plant disease detection platform that identifies crop and leaf diseases from uploaded images.",
    "applicationCategory": "Agriculture",
    "operatingSystem": "Web Browser",
    "logo": `${url}/icon.svg`,
    "publisher": {
      "@type": "Organization",
      "name": "Greenify",
      "logo": {
        "@type": "ImageObject",
        "url": `${url}/icon.svg`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/disease-info?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

// 2. Organization Schema for About
export const getOrganizationSchema = () => {
  const url = getBaseUrl()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Greenify",
    "url": url,
    "logo": `${url}/icon.svg`,
    "description": "Greenify is an AI-powered agricultural diagnostics platform on a mission to democratize plant health management.",
    "sameAs": [
      "https://github.com/prakash4806/greenify"
    ]
  }
}

// 3. Contact Schema for Contact Page
export const getContactSchema = () => {
  const url = getBaseUrl()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Greenify",
    "url": url,
    "logo": `${url}/icon.svg`,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "email": "support@example.com",
        "contactType": "customer service",
        "availableLanguage": ["en"]
      },
      {
        "@type": "ContactPoint",
        "email": "your-email@example.com",
        "contactType": "general inquiries",
        "availableLanguage": ["en"]
      }
    ]
  }
}

// 4. MedicalCondition Schema for Disease Pages
export const getMedicalConditionSchema = (disease: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "name": disease.name,
    "description": disease.description,
    "possibleTreatment": disease.treatment.map((t: string) => ({
      "@type": "MedicalTherapy",
      "name": t
    })),
    "signOrSymptom": disease.symptoms.map((s: string) => ({
      "@type": "MedicalSignOrSymptom",
      "name": s
    })),
    "cause": disease.causes.map((c: string) => ({
      "@type": "MedicalCause",
      "name": c
    })),
    "preventiveCare": disease.prevention.map((p: string) => ({
      "@type": "MedicalTherapy",
      "name": p
    })),
    "targetPopulation": "Agricultural Crops",
    "status": {
      "@type": "MedicalConditionStage",
      "name": `${disease.severity} Risk`
    }
  }
}

// 5. BreadcrumbList Schema
export interface BreadcrumbItem {
  name: string
  item: string
}

export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const baseUrl = getBaseUrl()
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.item}`
    }))
  }
}
