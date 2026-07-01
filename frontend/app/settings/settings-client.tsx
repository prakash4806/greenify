"use client"

import { useSession, signOut } from "@/components/session-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AuthGuard } from "@/components/auth-guard"
import { UserAvatar } from "@/components/ui/avatar"
import { User, ShieldAlert, Monitor, Bell, Palette, Settings, ExternalLink, Calendar, Check, LogOut, KeyRound, Camera, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function SettingsContent() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Notification Preferences States
  const [emailNotif, setEmailNotif] = useState(true)
  const [scanNotif, setScanNotif] = useState(true)
  const [updateNotif, setUpdateNotif] = useState(true)

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmailNotif(localStorage.getItem("notif_email") !== "false")
      setScanNotif(localStorage.getItem("notif_scan") !== "false")
      setUpdateNotif(localStorage.getItem("notif_update") !== "false")
    }
  }, [])

  // Sync profile and auth user on session change
  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchSettingsData() {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        setAuthUser(user)

        if (user) {
          const { data, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()

          if (profileError) throw profileError
          setProfile(data)
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Settings data fetch failed:", err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSettingsData()
  }, [session?.user?.id])

  // Save Notification Preference helpers
  const handleToggle = (key: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value)
    localStorage.setItem(key, String(value))
    toast.success("Preferences updated successfully!")
  }

  const avatarUrl = profile?.avatar_url || session?.user?.image

  const formattedCreated = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  const formattedLastLogin = authUser?.last_sign_in_at
    ? new Date(authUser.last_sign_in_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A"

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !session?.user?.id) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.")
      return
    }

    setIsUploading(true)
    try {
      const supabase = createClient()
      
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop() || "jpg"
      const fileName = `${session.user.id}/avatar-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from("plant-images")
        .getPublicUrl(fileName)
      
      const publicUrl = urlData.publicUrl

      // Update profiles database table
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", session.user.id)

      if (dbError) throw dbError

      // Update state
      setProfile((prev: any) => (prev ? { ...prev, avatar_url: publicUrl } : { avatar_url: publicUrl }))
      setImageError(false)
      toast.success("Profile picture updated successfully!")
    } catch (err: any) {
      console.error("Avatar upload failed:", err)
      toast.error(err.message || "Failed to upload avatar.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
        <div className="w-full max-w-[90vw] mx-auto px-4 py-6 pt-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 animate-pulse" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      <div className="w-full max-w-[90vw] mx-auto px-4 py-6 pt-20 fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <Settings className="w-6 h-6 text-[#2C6455] dark:text-emerald-400" />
              Settings
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage your account preferences and application settings.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Information Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                  <User className="mr-1.5 h-4.5 w-4.5" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Your Google account profile details (read-only)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="flex-shrink-0 relative group">
                    <input
                      type="file"
                      ref={avatarInputRef}
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => !isUploading && avatarInputRef.current?.click()}
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-md cursor-pointer hover:opacity-85 transition-opacity relative flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${
                        isUploading ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#2C6455] dark:text-emerald-400" />
                      ) : (
                        <UserAvatar
                          src={avatarUrl}
                          name={profile?.full_name || session?.user?.name}
                          className="w-full h-full"
                        />
                      )}
                      {!isUploading && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Full Name</h3>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {profile?.full_name || session?.user?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Email Address</h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {profile?.email || session?.user?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Member Since</h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formattedCreated}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Authentication Method</h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-1">
                        Google OAuth
                      </p>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-center sm:justify-start pt-1">
                      <Badge className="text-xs py-0.5 px-2.5 bg-green-100 text-green-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-green-200 dark:border-emerald-800/40 rounded-full font-semibold shadow-sm">
                        Authenticated via Google
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                  <Palette className="mr-1.5 h-4.5 w-4.5" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-xs">
                  Customize the theme preference for the dashboard interface
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "light", label: "Light Theme", icon: "☀️" },
                    { key: "dark", label: "Dark Theme", icon: "🌙" },
                    { key: "system", label: "System Theme", icon: "💻" },
                  ].map((opt) => {
                    const isActive = theme === opt.key
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setTheme(opt.key)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                          isActive
                            ? "bg-emerald-600/10 border-emerald-500 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold scale-[1.02]"
                            : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                      >
                        <span className="text-xl mb-1">{opt.icon}</span>
                        <span className="text-xs">{opt.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 mt-1 text-emerald-500 dark:text-emerald-400" />}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                  <Bell className="mr-1.5 h-4.5 w-4.5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose how you want to receive scan alerts and general updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                {[
                  {
                    id: "notif_email",
                    state: emailNotif,
                    setter: setEmailNotif,
                    label: "Email Notifications",
                    desc: "Receive account activity alerts and weekly summaries via email.",
                  },
                  {
                    id: "notif_scan",
                    state: scanNotif,
                    setter: setScanNotif,
                    label: "Scan Result Notifications",
                    desc: "Get notified as soon as your AI plant diagnoses are finished.",
                  },
                  {
                    id: "notif_update",
                    state: updateNotif,
                    setter: setUpdateNotif,
                    label: "Disease Update Notifications",
                    desc: "Receive alerts about new plant diseases discovered in your area.",
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/40 pb-3 last:border-0 last:pb-0">
                    <div className="space-y-0.5 max-w-[80%]">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-normal">{item.desc}</p>
                    </div>
                    <Switch
                      checked={item.state}
                      onCheckedChange={(checked) => handleToggle(item.id, checked, item.setter)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data & Privacy Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                  <Monitor className="mr-1.5 h-4.5 w-4.5" />
                  Data & Privacy
                </CardTitle>
                <CardDescription className="text-xs">
                  Review terms of service, privacy regulations, or download account logs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/privacy" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-xs text-gray-700 dark:text-gray-300">
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link href="/terms" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-xs text-gray-700 dark:text-gray-300">
                  <span>Terms & Conditions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <button
                  disabled
                  className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 opacity-70 cursor-not-allowed text-xs text-gray-700 dark:text-gray-300"
                >
                  <span>Download My Data (Coming Soon)</span>
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-gray-200 dark:border-gray-700 text-gray-500">
                    Coming Soon
                  </Badge>
                </button>
              </CardContent>
            </Card>

            {/* Detailed Account Information */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                  <KeyRound className="mr-1.5 h-4.5 w-4.5" />
                  Account Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-gray-750">
                  <span className="text-gray-500 font-semibold">User Unique ID</span>
                  <span className="font-mono text-gray-900 dark:text-gray-300 select-all" title={authUser?.id}>
                    {authUser?.id ? `${authUser.id.slice(0, 8)}...` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-gray-750">
                  <span className="text-gray-500 font-semibold">Account Created</span>
                  <span className="text-gray-900 dark:text-gray-300">{formattedCreated}</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-gray-100 dark:border-gray-750">
                  <span className="text-gray-500 font-semibold">Last Sign In</span>
                  <span className="text-gray-900 dark:text-gray-300">{formattedLastLogin}</span>
                </div>
                <div className="flex justify-between pb-1 border-gray-100 dark:border-gray-750">
                  <span className="text-gray-500 font-semibold">Authentication Provider</span>
                  <span className="text-gray-900 dark:text-gray-300 uppercase font-bold">{authUser?.app_metadata?.provider || "GOOGLE"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-red-50/10 dark:bg-red-950/5 border border-red-200 dark:border-red-900/30 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-base font-bold text-red-600 dark:text-red-400">
                  <ShieldAlert className="mr-1.5 h-4.5 w-4.5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-xs text-red-600/70 dark:text-red-400/70">
                  High-risk account configurations. Use with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 dark:border-red-950/20 pb-3">
                  <div className="space-y-0.5 max-w-[75%]">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Sign Out</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Log out of your current session on this device.</p>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-xs font-semibold px-4"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    Sign Out
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[75%]">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Delete Account (Coming Soon)</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Permanently delete your profile and scan history.</p>
                  </div>
                  <Button
                    disabled
                    variant="outline"
                    size="sm"
                    className="opacity-50 cursor-not-allowed border-gray-250 text-gray-400 dark:border-gray-800 text-xs"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsClient() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}
