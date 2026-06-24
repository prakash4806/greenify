import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        })
      }

      const forwardedHost = request.headers.get("x-forwarded-host") // Search for host if behind proxy
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${callbackUrl}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${callbackUrl}`)
      } else {
        return NextResponse.redirect(`${origin}${callbackUrl}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=AuthCallbackError`)
}
