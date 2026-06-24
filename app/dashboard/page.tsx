"use client"

import { useSession } from "@/components/session-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Camera, Clock, Leaf, TrendingUp, Eye, User, Calendar, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

function DashboardContent() {
  const { data: session } = useSession()
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchDashboardData() {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data, error: dbError } = await supabase
          .from("diagnoses")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (dbError) throw dbError
        setDiagnoses(data || [])
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session?.user?.id])

  const totalScans = diagnoses.length

  // Count healthy plants case-insensitively
  const healthyPlants = diagnoses.filter((d) => {
    const name = d.disease_name?.toLowerCase() || ""
    return name === "healthy" || name === "healthy plant"
  }).length

  const issuesDetected = totalScans - healthyPlants

  // Average confidence score calculation
  const avgConfidence =
    totalScans > 0
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
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "None":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getHealthTips = () => {
    if (totalScans === 0) {
      return [
        {
          title: "Watering Guide",
          tip: "Water your plants early in the morning to reduce leaf wetness and prevent fungal diseases.",
          color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300",
        },
        {
          title: "Pest Inspection",
          tip: "Check the undersides of leaves regularly for spider mites, aphids, or whiteflies.",
          color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300",
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
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300",
          },
          {
            title: "Soil Protection",
            tip: "Mulch the soil around your tomatoes to create a barrier against soil-borne Early Blight spores.",
            color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300",
          },
        ]
      } else if (diseaseLower.includes("late blight")) {
        return [
          {
            title: "Late Blight Treatment",
            tip: "Late Blight spreads rapidly in cool, wet conditions. Prune affected stems immediately and destroy them—do not compost them.",
            color: "bg-red-50/70 dark:bg-red-950/20 text-red-800 dark:text-red-300",
          },
          {
            title: "Airflow Improvement",
            tip: "Use defensive systemic fungicides and ensure your plants have excellent air circulation.",
            color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300",
          },
        ]
      } else if (diseaseLower.includes("bacterial spot")) {
        return [
          {
            title: "Bacterial Spot Care",
            tip: "Avoid handling wet plants, as bacterial diseases spread easily through physical contact and splashing water.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300",
          },
          {
            title: "Tools Sanitation",
            tip: "Sanitize your pruning shears with rubbing alcohol between cuts to prevent spreading bacterial infections.",
            color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300",
          },
        ]
      } else if (diseaseLower.includes("powdery mildew")) {
        return [
          {
            title: "Powdery Mildew Treatment",
            tip: "Apply neem oil or a potassium bicarbonate spray to the leaves. Powdery mildew thrives in high humidity and dry soil.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300",
          },
          {
            title: "Spacing & Airflow",
            tip: "Prune crowded branches to increase sunlight penetration and air circulation throughout the canopy.",
            color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300",
          },
        ]
      } else {
        return [
          {
            title: `${disease} Treatment`,
            tip: "Prune affected leaves, avoid overhead watering, and apply an organic fungicide if symptoms persist.",
            color: "bg-orange-50/70 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300",
          },
          {
            title: "Prevention Tip",
            tip: "Clean up all fallen garden debris and rotate crops next season to prevent the disease overwintering in the soil.",
            color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300",
          },
        ]
      }
    }

    return [
      {
        title: "Healthy Growth",
        tip: "Your plants are doing great! Continue maintaining your regular watering and nutrient schedules.",
        color: "bg-green-50/70 dark:bg-emerald-950/20 text-green-800 dark:text-emerald-300",
      },
      {
        title: "Nutrient Check",
        tip: "Feed your plants with balanced organic fertilizer every 2-4 weeks during the active growing season.",
        color: "bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300",
      },
    ]
  }

  const tips = getHealthTips()

  const formattedDate = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

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
              <Button size="sm" className="h-9 text-xs bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 mt-3 md:mt-0">
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                New Scan
              </Button>
            </Link>
          </div>

          {/* User Info Card */}
          <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                <User className="mr-1.5 h-4.5 w-4.5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={session?.user?.image || "/placeholder.svg?height=48&width=48"}
                    alt={session?.user?.name || "User"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{session?.user?.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{session?.user?.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge className="text-xs py-0.5 bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-none font-medium">
                      Google Verified User
                    </Badge>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Created: {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-white/20 dark:border-gray-700/20 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                  <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Scans</CardTitle>
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{totalScans}</div>
                  <p className="text-[10px] text-muted-foreground">Scans recorded in total</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                  <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Healthy Plants</CardTitle>
                  <Leaf className="h-3.5 w-3.5 text-green-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold text-green-600 dark:text-emerald-400">{healthyPlants}</div>
                  <p className="text-[10px] text-muted-foreground">
                    {totalScans > 0 ? `${Math.round((healthyPlants / totalScans) * 100)}%` : "0%"} of total scans
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                  <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Issues Detected</CardTitle>
                  <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold text-orange-600">{issuesDetected}</div>
                  <p className="text-[10px] text-muted-foreground">
                    {totalScans > 0 ? `${Math.round((issuesDetected / totalScans) * 100)}%` : "0%"} of total scans
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                  <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Avg. Confidence</CardTitle>
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{avgConfidence}%</div>
                  <p className="text-[10px] text-muted-foreground">Diagnosis accuracy rate</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Scans */}
            <div className="lg:col-span-2">
              <Card className="h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl flex flex-col justify-between">
                <div>
                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                      <Clock className="mr-1.5 h-4.5 w-4.5" />
                      Recent Scans
                    </CardTitle>
                    <CardDescription className="text-xs dark:text-gray-400">Your latest plant health diagnoses</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-500 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    ) : recentScans.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center">
                        <Leaf className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3 animate-bounce" />
                        <p className="text-sm font-semibold max-w-sm">
                          No scans yet. Upload your first plant image to begin diagnosis.
                        </p>
                        <Link href="/disease-detection" className="mt-4">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-xs">
                            Start First Scan
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
                {recentScans.length > 0 && (
                  <div className="p-5 pt-0 text-center">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs cursor-not-allowed opacity-50">
                      View All Scans (Limit to Latest 5)
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Quick Actions & Tips */}
            <div className="space-y-4 flex flex-col">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl flex-1">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-[#2C6455] dark:text-emerald-400">Quick Actions</CardTitle>
                  <CardDescription className="text-xs dark:text-gray-400">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <Link href="/disease-detection">
                    <Button size="sm" className="w-full h-8 text-xs justify-start bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                      <Camera className="mr-1.5 h-3.5 w-3.5" />
                      Scan New Plant
                    </Button>
                  </Link>
                  <Link href="/disease-info">
                    <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                      <Leaf className="mr-1.5 h-3.5 w-3.5" />
                      Browse Diseases
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl flex-1">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-[#2C6455] dark:text-emerald-400">Plant Health Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2.5">
                    {tips.map((item, index) => (
                      <div key={index} className={`p-2.5 rounded-lg ${item.color}`}>
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
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
