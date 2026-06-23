import { NextResponse } from "next/server"
import { authOptions } from "../[...nextauth]/route"

export async function GET() {
  try {
    // Test basic functionality
    const testResult = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      authOptionsValid: !!authOptions,
      providersCount: authOptions.providers?.length || 0,
    }

    return NextResponse.json({
      success: true,
      message: "NextAuth configuration test successful",
      data: testResult,
    })
  } catch (error) {
    console.error("NextAuth test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
