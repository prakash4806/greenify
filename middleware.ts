import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /settings)
  const { pathname } = request.nextUrl

  // Check if the path requires authentication
  const protectedPaths = ["/dashboard", "/settings"]
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedPath) {
    // Get the token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token, redirect to auth page
    if (!token) {
      const url = new URL("/auth", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
