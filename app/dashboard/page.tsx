"use client"

import { useSession } from "@/components/session-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Camera, Clock, Leaf, TrendingUp, Upload, Eye, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function DashboardContent() {
  const { data: session } = useSession()

  const recentScans = [
    {
      id: 1,
      plant: "Tomato Plant",
      disease: "Early Blight",
      severity: "Medium",
      date: "2024-01-15",
      image: "/placeholder.svg?height=100&width=100",
      confidence: 89,
    },
    {
      id: 2,
      plant: "Rose Bush",
      disease: "Black Spot",
      severity: "High",
      date: "2024-01-14",
      image: "/placeholder.svg?height=100&width=100",
      confidence: 94,
    },
    {
      id: 3,
      plant: "Apple Tree",
      disease: "Healthy",
      severity: "None",
      date: "2024-01-13",
      image: "/placeholder.svg?height=100&width=100",
      confidence: 96,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "None":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
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
                <Image
                  src={session?.user?.image || "/placeholder.svg?height=48&width=48"}
                  alt={session?.user?.name || "User"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{session?.user?.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{session?.user?.email}</p>
                  <Badge className="mt-1 text-xs py-0.5 bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Premium Member
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Scans</CardTitle>
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold">24</div>
                <p className="text-[10px] text-muted-foreground">+3 from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Healthy Plants</CardTitle>
                <Leaf className="h-3.5 w-3.5 text-green-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-green-600 dark:text-emerald-400">18</div>
                <p className="text-[10px] text-muted-foreground">75% of total scans</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Issues Detected</CardTitle>
                <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-orange-600">6</div>
                <p className="text-[10px] text-muted-foreground">25% of total scans</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1.5">
                <CardTitle className="text-xs font-semibold text-gray-600 dark:text-gray-400">Avg. Confidence</CardTitle>
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold">92%</div>
                <p className="text-[10px] text-muted-foreground">High accuracy rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Scans */}
            <div className="lg:col-span-2">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="flex items-center text-base font-bold text-[#2C6455] dark:text-emerald-400">
                    <Clock className="mr-1.5 h-4.5 w-4.5" />
                    Recent Scans
                  </CardTitle>
                  <CardDescription className="text-xs dark:text-gray-400">Your latest plant health diagnoses</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="space-y-3">
                    {recentScans.map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-gray-200 dark:border-gray-700"
                      >
                        <Image
                          src={scan.image || "/placeholder.svg"}
                          alt={scan.plant}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white truncate">{scan.plant}</h4>
                            <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(scan.severity)}`}>
                              {scan.severity === "None" ? "Healthy" : scan.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-0.5">{scan.disease}</p>
                          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                            <span>{scan.date}</span>
                            <span>Confidence: {scan.confidence}%</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                      View All Scans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Tips */}
            <div className="space-y-4">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
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
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Bulk Upload
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-[#2C6455] dark:text-emerald-400">Plant Health Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2.5">
                    <div className="p-2.5 bg-green-50/70 dark:bg-emerald-950/20 rounded-lg">
                      <h4 className="text-xs font-semibold text-green-800 dark:text-emerald-300 mb-0.5">Daily Tip</h4>
                      <p className="text-[11px] text-green-700 dark:text-emerald-400">
                        Water your plants early morning to reduce fungal diseases.
                      </p>
                    </div>
                    <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-0.5">Weekly Reminder</h4>
                      <p className="text-[11px] text-blue-700 dark:text-blue-400">
                        Check for pests on the undersides of leaves regularly.
                      </p>
                    </div>
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
