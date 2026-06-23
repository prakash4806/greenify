// Environment variable validation
export const env = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
}

// Validate required environment variables
export function validateEnv() {
  const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET"]
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

// Check if we're in development mode
export const isDev = env.NODE_ENV === "development"
