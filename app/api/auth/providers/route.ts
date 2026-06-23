import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Manual providers response to ensure it works
    const providers = {
      google: {
        id: "google",
        name: "Google",
        type: "oauth",
        signinUrl: "/api/auth/signin/google",
        callbackUrl: "/api/auth/callback/google",
      },
    }

    return NextResponse.json(providers)
  } catch (error) {
    console.error("Providers endpoint error:", error)
    return NextResponse.json(
      {
        error: "Failed to load providers",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
