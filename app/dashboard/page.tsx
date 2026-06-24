"use client"

import { useSession } from "@/components/session-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Camera, Clock, Leaf, TrendingUp, Eye, User, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

function DashboardContent() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchDashboardData() {
      try {
        setLoading(true)
        const supabase = createClient()

        // Fetch user profile and diagnoses in parallel
        const [profileRes, diagnosesRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle(),
          supabase.from("diagnoses").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
        ])

        if (profileRes.error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Supabase Profiles fetch error:", profileRes.error)
          }
        } else {
          setProfile(profileRes.data)
        }

        if (diagnosesRes.error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Supabase Diagnoses fetch error:", diagnosesRes.error)
          }
          // Do not expose raw database/schema caching errors to the user
          setDiagnoses([])
        } else {
          setDiagnoses(diagnosesRes.data || [])
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Dashboard data fetching failed:", err)
        }
        setDiagnoses([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session?.user?.id])

  // Reset imageError state when profile avatar URL changes
  useEffect(() => {
    setImageError(false)
  }, [profile?.avatar_url, session?.user?.image])

  const totalScans = diagnoses.length
  const hasData = totalScans > 0

  // Count healthy plants case-insensitively
  const healthyPlants = hasData
    ? diagnoses.filter((d) => {
        const name = d.disease_name?.toLowerCase() || ""
        return name === "healthy" || name === "healthy plant"
      }).length
    : 0

  const issuesDetected = hasData ? totalScans - healthyPlants : 0

  // Average confidence score calculation
  const avgConfidence =
    hasData
      ? Math.round(diagnoses.reduce((acc, curr) => acc + Number(curr.confidence || 0), 0) / totalScans)
      : 0

  const recentScans = diagnoses.slice(0, 5)

  const getSeverity = (diseaseName: string) => {
    const name = diseaseName?.toLowerCase() || ""
    if (name.includes("healthy")) return "None"
    if (name.includes("late blight") || name.includes("critical")) return "Critical"
    if (name.includes("early blight") || name.includes("bacterial spot") || name.includes("high")) return "High"
    if (name.includes("powdery mildew") || name.includes("medium")) return "Medium"
    return "Low"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-none"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-none"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-none"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none"
      case "None":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-none"
    }
  }

  const getHealthTips = () => {
    if (!hasData) {
      return [
        {
          title: "Watering Guide",
          tip: "Water your plants early in the morning to reduce leaf wetness and prevent fungal diseases.",
          color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300 border-none",
        },
        {
          title: "Pest Inspection",
          tip: "Check the undersides of leaves regularly for spider mites, aphids, or whiteflies.",
          color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-none",
        },
      ]
    }

    const latestIssue = diagnoses.find((d) => {
      const name = d.disease_name?.toLowerCase() || ""
      return name !== "healthy" && name !== "healthy plant"
    })

    if (latestIssue) {
      const disease = latestIssue.disease_name
      const diseaseLower = disease.toLowerCase()
      if (diseaseLower.includes("early blight")) {
        return [
          {
            title: "Early Blight Care",
            tip: "Remove infected lower leaves immediately to stop spores from splashing onto upper foliage. Apply copper-based fungicide.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 border-none",
          },
          {
            title: "Soil Protection",
            tip: "Mulch the soil around your tomatoes to create a barrier against soil-borne Early Blight spores.",
            color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300 border-none",
          },
        ]
      } else if (diseaseLower.includes("late blight")) {
        return [
          {
            title: "Late Blight Treatment",
            tip: "Late Blight spreads rapidly in cool, wet conditions. Prune affected stems immediately and destroy them—do not compost them.",
            color: "bg-red-50/70 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-none",
          },
          {
            title: "Airflow Improvement",
            tip: "Use defensive systemic fungicides and ensure your plants have excellent air circulation.",
            color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-none",
          },
        ]
      } else if (diseaseLower.includes("bacterial spot")) {
        return [
          {
            title: "Bacterial Spot Care",
            tip: "Avoid handling wet plants, as bacterial diseases spread easily through physical contact and splashing water.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 border-none",
          },
          {
            title: "Tools Sanitation",
            tip: "Sanitize your pruning shears with rubbing alcohol between cuts to prevent spreading bacterial infections.",
            color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-none",
          },
        ]
      } else if (diseaseLower.includes("powdery mildew")) {
        return [
          {
            title: "Powdery Mildew Treatment",
            tip: "Apply neem oil or a potassium bicarbonate spray to the leaves. Powdery mildew thrives in high humidity and dry soil.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 border-none",
          },
          {
            title: "Spacing & Airflow",
            tip: "Prune crowded branches to increase sunlight penetration and air circulation throughout the canopy.",
            color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300 border-none",
          },
        ]
      } else {
        return [
          {
            title: `${disease} Treatment`,
            tip: "Prune affected leaves, avoid overhead watering, and apply an organic fungicide if symptoms persist.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 border-none",
          },
          {
            title: "Prevention Tip",
            tip: "Clean up all fallen garden debris and rotate crops next season to prevent the disease overwintering in the soil.",
            color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300 border-none",
          },
        ]
      }
    }

    return [
      {
        title: "Healthy Growth",
        tip: "Your plants are doing great! Continue maintaining your regular watering and nutrient schedules.",
        color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300 border-none",
      },
      {
        title: "Nutrient Check",
        tip: "Feed your plants with balanced organic fertilizer every 2-4 weeks during the active growing season.",
        color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-none",
      },
    ]
  }

  const tips = getHealthTips()

  const userCreatedAt = profile?.created_at || session?.user?.createdAt
  const formattedDate = userCreatedAt
    ? new Date(userCreatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  const avatarUrl = profile?.avatar_url || session?.user?.image
  const hasAvatar = avatarUrl && !imageError

  const getInitials = () => {
    const name = profile?.full_name || session?.user?.name || "User"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      <div className="w-full max-w-[90vw] mx-auto px-4 py-6 pt-20 fade-in">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Welcome back, {session?.user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Here's your plant health overview.</p>
            </div>
            <Link href="/disease-detection">
              <Button size="sm" className="h-9 text-xs bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 mt-3 md:mt-0 font-semibold shadow-sm rounded-lg">
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                New Scan
              </Button>
            </Link>
          </div>

          {/* User Info Card */}
          <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl overflow-hidden rounded-xl">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                <User className="mr-1.5 h-4.5 w-4.5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {hasAvatar ? (
                    <div className="relative w-14 h-14 md:w-16 md:h-16">
                      <img
                        src={avatarUrl}
                        alt="Profile Avatar"
                        onError={() => setImageError(true)}
                        className="rounded-full w-full h-full object-cover border-2 border-emerald-500/20 shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center font-bold text-lg md:text-xl border border-emerald-500/20 shadow-sm flex-shrink-0">
                      {getInitials()}
                    </div>
                  )}
                </div>

                {/* Account Details */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-center sm:text-left">
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
                      {formattedDate}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Auth Method</h3>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Google OAuth
                    </p>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-center sm:justify-start pt-1">
                    <Badge className="text-xs py-0.5 px-2 bg-green-100 text-green-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-green-200 dark:border-emerald-800/40 rounded-full font-semibold shadow-sm">
                      Authenticated via Google
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Scans</CardTitle>
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{totalScans}</div>
                <p className="text-[10px] text-muted-foreground">Scans recorded in total</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Healthy Plants</CardTitle>
                <Leaf className="h-3.5 w-3.5 text-green-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-green-600 dark:text-emerald-400">
                  {hasData ? healthyPlants : "—"}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  {hasData ? `${Math.round((healthyPlants / totalScans) * 100)}% of total scans` : "No data available yet"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Issues Detected</CardTitle>
                <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-orange-600">
                  {hasData ? issuesDetected : "—"}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  {hasData ? `${Math.round((issuesDetected / totalScans) * 100)}% of total scans` : "No data available yet"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Avg. Confidence</CardTitle>
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {hasData ? `${avgConfidence}%` : "—"}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  {hasData ? "Diagnosis accuracy rate" : "No data available yet"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Scans or Empty State */}
            <div className="lg:col-span-2">
              <Card className="h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl flex flex-col justify-between rounded-xl overflow-hidden">
                <div>
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                      <Clock className="mr-1.5 h-4.5 w-4.5" />
                      Recent Scans
                    </CardTitle>
                    <CardDescription className="text-xs dark:text-gray-400">Your latest plant health diagnoses</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    {!hasData ? (
                      <div className="text-center py-12 px-4 flex flex-col items-center justify-center fade-in">
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-full mb-4 border border-emerald-100 dark:border-emerald-900/10">
                          <Leaf className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                          No scans yet
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mb-5 leading-relaxed">
                          Upload a plant image to start building your diagnosis history.
                        </p>
                        <Link href="/disease-detection">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-xs font-semibold px-5 rounded-lg shadow-sm hover:shadow-md transition-all">
                            Scan Your First Plant
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentScans.map((scan) => {
                          const severity = getSeverity(scan.disease_name)
                          const scanDate = new Date(scan.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                          return (
                            <div
                              key={scan.id}
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-gray-200 dark:border-gray-700"
                            >
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                  src={scan.image_url || "/placeholder.svg"}
                                  alt={scan.plant_name}
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <h4 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white truncate">{scan.plant_name}</h4>
                                  <Badge className={`text-[10px] px-2 py-0.5 font-medium border-none ${getSeverityColor(severity)}`}>
                                    {severity === "None" ? "Healthy" : severity}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-0.5 truncate">{scan.disease_name}</p>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                                  <span>{scanDate}</span>
                                  <span>Confidence: {scan.confidence}%</span>
                                </div>
                              </div>
                              <Link href={`/disease-info/${scan.disease_name.toLowerCase().replace(/\s+/g, "-")}`}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </div>
                {hasData && (
                  <div className="p-5 pt-0 text-center">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs cursor-not-allowed opacity-50">
                      View All Scans (Limit to Latest 5)
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Quick Actions & Tips */}
            <div className="space-y-4 flex flex-col justify-between">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl flex-1">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-[#2C6455] dark:text-emerald-400">Quick Actions</CardTitle>
                  <CardDescription className="text-xs dark:text-gray-400">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <Link href="/disease-detection">
                    <Button size="sm" className="w-full h-8 text-xs justify-start bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm">
                      <Camera className="mr-1.5 h-3.5 w-3.5" />
                      Scan New Plant
                    </Button>
                  </Link>
                  <Link href="/disease-info">
                    <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start rounded-lg border-gray-200 dark:border-gray-700">
                      <Leaf className="mr-1.5 h-3.5 w-3.5" />
                      Browse Diseases
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl flex-1">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-[#2C6455] dark:text-emerald-400">Plant Health Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2.5">
                    {tips.map((item, index) => (
                      <div key={index} className={`p-2.5 rounded-lg border-none ${item.color}`}>
                        <h4 className="text-xs font-semibold mb-0.5">{item.title}</h4>
                        <p className="text-[11px] leading-relaxed">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <AuthGuard
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
          <div className="w-full max-w-[90vw] mx-auto px-4 py-6 pt-20">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header skeleton */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-2">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 animate-pulse" />
                </div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-28 mt-3 md:mt-0 animate-pulse" />
              </div>

              {/* User Info card skeleton */}
              <div className="h-40 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse p-5 flex gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </div>

              {/* Stats skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse" />
                ))}
              </div>

              {/* Lower grid skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse" />
                <div className="space-y-4">
                  <div className="h-32 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse" />
                  <div className="h-48 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </AuthGuard>
  )
}
