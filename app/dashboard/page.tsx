"use client"

import { useSession } from "next-auth/react"
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
      <div className="w-full max-w-[90vw] mx-auto px-4 py-8 pt-24 fade-in">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {session?.user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Here's your plant health overview.</p>
            </div>
            <Link href="/disease-detection">
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 mt-4 md:mt-0">
                <Camera className="mr-2 h-4 w-4" />
                New Scan
              </Button>
            </Link>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-[#2C6455] dark:text-emerald-400">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image
                  src={session?.user?.image || "/placeholder.svg?height=60&width=60"}
                  alt={session?.user?.name || "User"}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{session?.user?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{session?.user?.email}</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Premium Member
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+3 from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy Plants</CardTitle>
                <Leaf className="h-4 w-4 text-green-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-emerald-400">18</div>
                <p className="text-xs text-muted-foreground">75% of total scans</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues Detected</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">6</div>
                <p className="text-xs text-muted-foreground">25% of total scans</p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">High accuracy rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Scans */}
            <div className="lg:col-span-2">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#2C6455] dark:text-emerald-400">
                    <Clock className="mr-2 h-5 w-5" />
                    Recent Scans
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Your latest plant health diagnoses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentScans.map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-gray-200 dark:border-gray-700"
                      >
                        <Image
                          src={scan.image || "/placeholder.svg"}
                          alt={scan.plant}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">{scan.plant}</h4>
                            <Badge className={getSeverityColor(scan.severity)}>
                              {scan.severity === "None" ? "Healthy" : scan.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{scan.disease}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{scan.date}</span>
                            <span>Confidence: {scan.confidence}%</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" className="w-full">
                      View All Scans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-[#2C6455] dark:text-emerald-400">Quick Actions</CardTitle>
                  <CardDescription className="dark:text-gray-400">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/disease-detection">
                    <Button className="w-full justify-start bg-green-600 hover:bg-green-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                      <Camera className="mr-2 h-4 w-4" />
                      Scan New Plant
                    </Button>
                  </Link>
                  <Link href="/disease-info">
                    <Button variant="outline" className="w-full justify-start">
                      <Leaf className="mr-2 h-4 w-4" />
                      Browse Diseases
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Upload
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-[#2C6455] dark:text-emerald-400">Plant Health Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-emerald-950/30 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-emerald-300 mb-1">Daily Tip</h4>
                      <p className="text-sm text-green-700 dark:text-emerald-400">
                        Water your plants early morning to reduce fungal diseases.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Weekly Reminder</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
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
