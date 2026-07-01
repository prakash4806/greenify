"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import { isAdmin } from "@/lib/auth-utils"

interface SessionContextType {
  session: Session | null
  user: User | null
  profileRole: string | null
  status: "authenticated" | "unauthenticated" | "loading"
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  profileRole: null,
  status: "loading",
})

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profileRole, setProfileRole] = useState<string | null>(null)
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading")
  const supabase = createClient()

  useEffect(() => {
    const syncProfile = async (u: User) => {
      try {
        const { data } = await supabase.from("profiles").upsert({
          id: u.id,
          full_name: u.user_metadata?.full_name || u.email?.split("@")[0],
          email: u.email,
          avatar_url: u.user_metadata?.avatar_url || u.user_metadata?.picture,
          // Fix: Sync the role column to "admin" if the user has administrative privileges,
          // so that Supabase Row Level Security (RLS) policies allow them to read all user profiles
          // in the Admin User Directory.
          role: isAdmin(u.email) ? "admin" : "user",
        }).select("role").maybeSingle()
        if (data) {
          setProfileRole(data.role)
        }
      } catch (err) {
        console.error("Error syncing profile:", err)
      }
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setStatus(session ? "authenticated" : "unauthenticated")
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle()
        if (data) setProfileRole(data.role)
        syncProfile(session.user)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setStatus(session ? "authenticated" : "unauthenticated")
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle()
        if (data) setProfileRole(data.role)
        syncProfile(session.user)
      } else {
        setProfileRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <SessionContext.Provider value={{ session, user, profileRole, status }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within an AuthSessionProvider")
  }
  
  return {
    data: context.session ? {
      user: {
        id: context.user?.id,
        name: context.user?.user_metadata?.full_name || context.user?.email?.split("@")[0],
        email: context.user?.email,
        image: context.user?.user_metadata?.avatar_url || context.user?.user_metadata?.picture,
        createdAt: context.user?.created_at,
        role: context.profileRole,
      }
    } : null,
    status: context.status,
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = "/"
}
