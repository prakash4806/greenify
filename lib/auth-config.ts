// Authentication configuration and validation utilities

export interface AuthConfig {
  googleClientId: string
  googleClientSecret: string
  nextAuthSecret: string
  nextAuthUrl: string
}

export interface AuthValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  config?: Partial<AuthConfig>
}

export function validateAuthConfig(): AuthValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const config: Partial<AuthConfig> = {}

  // Check required environment variables
  if (!process.env.GOOGLE_CLIENT_ID) {
    errors.push("GOOGLE_CLIENT_ID is required")
  } else {
    config.googleClientId = process.env.GOOGLE_CLIENT_ID
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    errors.push("GOOGLE_CLIENT_SECRET is required")
  } else {
    config.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  }

  if (!process.env.NEXTAUTH_SECRET) {
    errors.push("NEXTAUTH_SECRET is required")
  } else {
    config.nextAuthSecret = process.env.NEXTAUTH_SECRET
  }

  if (!process.env.NEXTAUTH_URL) {
    warnings.push("NEXTAUTH_URL is not set, using default")
    config.nextAuthUrl = "http://localhost:3000"
  } else {
    config.nextAuthUrl = process.env.NEXTAUTH_URL
  }

  // Validate Google Client ID format
  if (config.googleClientId && !config.googleClientId.endsWith(".apps.googleusercontent.com")) {
    warnings.push("Google Client ID format may be incorrect")
  }

  // Validate NextAuth Secret length
  if (config.nextAuthSecret && config.nextAuthSecret.length < 32) {
    warnings.push("NextAuth Secret should be at least 32 characters long")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: errors.length === 0 ? (config as AuthConfig) : undefined,
  }
}

export function getAuthStatus() {
  const validation = validateAuthConfig()

  return {
    ...validation,
    canUseGoogleAuth: validation.isValid,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  }
}
