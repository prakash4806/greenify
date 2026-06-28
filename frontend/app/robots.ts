import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}`
    : "https://greenify-web-application.vercel.app"

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/settings',
        '/admin',
        '/api',
        '/auth',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
