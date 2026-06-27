/**
 * Determines whether a user email has administrative privileges.
 * For local development and demonstration, emails containing 'admin' or ending with '@greenify.com' are recognized.
 */
export function isAdmin(email: string | null | undefined, role?: string | null | undefined): boolean {
  if (role === "admin") return true
  if (!email) return false
  const lowerEmail = email.toLowerCase()
  return (
    lowerEmail === "admin@greenify.com" ||
    lowerEmail === "prakashmahato4806@gmail.com" ||
    lowerEmail.includes("admin") ||
    lowerEmail.endsWith("@greenify.com")
  )
}
