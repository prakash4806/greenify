"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-provider"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  HardDrive,
  Activity,
  HeartPulse,
  TrendingUp,
  Percent,
  Search,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Loader2,
  Calendar,
  ShieldAlert,
  Info
} from "lucide-react"
import { isAdmin } from "@/lib/auth-utils"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

function AdminPanelContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Data States
  const [users, setUsers] = useState<any[]>([])
  const [scans, setScans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Selected user for inspection details modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [selectedUserScans, setSelectedUserScans] = useState<any[]>([])
  const [modalLoading, setModalLoading] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  
  // Access control check on mount
  useEffect(() => {
    if (status === "loading") return
    
    const userRole = (session?.user as any)?.role
    if (status === "unauthenticated" || !session?.user?.email || !isAdmin(session.user.email, userRole)) {
      router.push("/unauthorized")
    }
  }, [session, status, router])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const [profilesRes, diagnosesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("diagnoses").select("*").order("created_at", { ascending: false }),
      ])
      
      if (profilesRes.error) throw profilesRes.error
      if (diagnosesRes.error) throw diagnosesRes.error
      
      setUsers(profilesRes.data || [])
      setScans(diagnosesRes.data || [])
    } catch (err: any) {
      console.error("Admin data fetch failed:", err)
      toast.error("Failed to load administration database records.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userRole = (session?.user as any)?.role
    if (session?.user?.email && isAdmin(session.user.email, userRole)) {
      fetchAdminData()
    }
  }, [session?.user?.email, (session?.user as any)?.role])

  // Fetch specific user scans for detail modal
  const handleInspectUser = async (user: any) => {
    setSelectedUser(user)
    setSelectedUserScans([])
    setModalLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("diagnoses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        
      if (error) throw error
      setSelectedUserScans(data || [])
    } catch (err) {
      console.error("Failed to load scans for user:", err)
      toast.error("Failed to fetch user's diagnostics history.")
    } finally {
      setModalLoading(false)
    }
  }

  // Delete specific scan inside modal
  const handleDeleteScan = async (scanId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this scan record?")) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("diagnoses")
        .delete()
        .eq("id", scanId)
        
      if (error) throw error
      
      // Update local states
      setSelectedUserScans((prev) => prev.filter((s) => s.id !== scanId))
      setScans((prev) => prev.filter((s) => s.id !== scanId))
      toast.success("Scan deleted successfully.")
    } catch (err: any) {
      console.error("Delete scan failed:", err)
      toast.error(err.message || "Failed to delete scan record.")
    }
  }

  // Delete User Cascade
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete user "${userName}"? This will delete their account profile AND all of their diagnoses scans cascade.`)) {
      return
    }
    
    setDeletingUserId(userId)
    try {
      const supabase = createClient()
      
      // 1. Delete associated diagnoses scans
      const { error: scansErr } = await supabase
        .from("diagnoses")
        .delete()
        .eq("user_id", userId)
        
      if (scansErr) throw scansErr
      
      // 2. Delete user profile
      const { error: profileErr } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)
        
      if (profileErr) throw profileErr
      
      toast.success(`User "${userName}" has been successfully deleted.`)
      
      // Update local states
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setScans((prev) => prev.filter((s) => s.user_id !== userId))
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }
    } catch (err: any) {
      console.error("Delete user cascade failed:", err)
      toast.error(err.message || "Failed to delete user profile.")
    } finally {
      setDeletingUserId(null)
    }
  }

  // Statistics Computations
  const totalUsers = users.length
  const totalScans = scans.length
  
  const healthyScans = scans.filter((s) => s.disease_name.toLowerCase().includes("healthy")).length
  const diseasedScans = totalScans - healthyScans
  
  const averageConfidence = totalScans > 0 
    ? Math.round(scans.reduce((acc, s) => acc + (s.confidence || 0), 0) / totalScans)
    : 0
    
  const storageUsageKb = totalScans * 150 // Mock approximation (150KB per scan image)
  const formatStorage = (kb: number) => {
    if (kb >= 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(1)} GB`
    } else if (kb >= 1024) {
      return `${(kb / 1024).toFixed(1)} MB`
    }
    return `${kb} KB`
  }

  const todayStr = new Date().toDateString()
  const todayScansCount = scans.filter((s) => new Date(s.created_at).toDateString() === todayStr).length
  
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weeklyScansCount = scans.filter((s) => new Date(s.created_at).getTime() >= sevenDaysAgo).length

  // Filtered Users list based on search bar query
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase()
    return (
      (u.full_name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query)
    )
  })

  // Get scan count for a specific user ID
  const getUserScanCount = (userId: string) => {
    return scans.filter((s) => s.user_id === userId).length
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 pt-20 flex flex-col items-center justify-center min-h-[80vh]">
          <Loader2 className="w-9 h-9 animate-spin text-[#2C6455] dark:text-emerald-400 mb-2.5" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading admin metrics...</p>
        </div>
      </div>
    )
  }

  // Double check role authorization
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      <div className="w-full max-w-[90vw] mx-auto px-4 py-6 pt-20 fade-in">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Page Title Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                <ShieldAlert className="w-6.5 h-6.5 text-emerald-600 dark:text-emerald-400" />
                Admin Dashboard
              </h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                Oversee users, query diagnostic scan aggregates, and manage platform safety configurations.
              </p>
            </div>
            <Button
              onClick={fetchAdminData}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold px-4 border-[#2C6455]/30 text-[#2C6455] dark:text-emerald-400"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Sync Database
            </Button>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-md">
              <CardHeader className="p-4 pb-1.5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Users</CardTitle>
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{totalUsers}</div>
                <p className="text-[10px] text-gray-500">Registered growers</p>
              </CardContent>
            </Card>

            {/* Total Scans */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-md">
              <CardHeader className="p-4 pb-1.5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Scans</CardTitle>
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{totalScans}</div>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
                  <span className="text-emerald-600 font-bold">{todayScansCount} today</span>
                  <span>•</span>
                  <span>{weeklyScansCount} weekly</span>
                </div>
              </CardContent>
            </Card>

            {/* Diagnosis Splits */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-md">
              <CardHeader className="p-4 pb-1.5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scans Diagnosis</CardTitle>
                <HeartPulse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{diseasedScans}</div>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
                  <span className="text-red-500 font-bold">{diseasedScans} Diseased</span>
                  <span>•</span>
                  <span className="text-green-600 font-bold">{healthyScans} Healthy</span>
                </div>
              </CardContent>
            </Card>

            {/* Average Confidence & Storage */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-md">
              <CardHeader className="p-4 pb-1.5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Metrics & Storage</CardTitle>
                <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{formatStorage(storageUsageKb)}</div>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
                  <span className="text-blue-500 font-bold flex items-center gap-0.5">
                    <Percent className="w-2.5 h-2.5" />
                    {averageConfidence}% Conf. Avg
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management Section */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
            <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-[#2C6455] dark:text-emerald-400">User Profiles Directory</CardTitle>
                <CardDescription className="text-xs">
                  Inspect user registration, diagnostic aggregates, or revoke accounts.
                </CardDescription>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search user email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-full text-xs bg-white/50 dark:bg-gray-900/50 border border-gray-250 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:text-white"
                />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">
                  No users found matching "{searchQuery}"
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700/55 text-gray-500 uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-2">Name</th>
                        <th className="py-2.5 px-2">Email</th>
                        <th className="py-2.5 px-2 hidden md:table-cell">User ID</th>
                        <th className="py-2.5 px-2 hidden sm:table-cell">Joined</th>
                        <th className="py-2.5 px-2 text-center">Total Scans</th>
                        <th className="py-2.5 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const totalScansForUser = getUserScanCount(user.id)
                        const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        
                        return (
                          <tr
                            key={user.id}
                            className="border-b border-gray-100/50 dark:border-gray-700/30 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/3 transition-colors"
                          >
                            <td className="py-3 px-2 font-bold text-gray-950 dark:text-white truncate max-w-[120px]">{user.full_name || "User"}</td>
                            <td className="py-3 px-2 text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{user.email}</td>
                            <td className="py-3 px-2 font-mono text-gray-400 hidden md:table-cell" title={user.id}>
                              {user.id.slice(0, 8)}...
                            </td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{joinDate}</td>
                            <td className="py-3 px-2 text-center font-semibold text-gray-900 dark:text-white">{totalScansForUser}</td>
                            <td className="py-3 px-2 text-right space-x-1.5">
                              <Button
                                onClick={() => handleInspectUser(user)}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                title="View scans"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteUser(user.id, user.full_name)}
                                disabled={deletingUserId === user.id}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-red-500/10 text-red-650"
                                title="Delete user profile"
                              >
                                {deletingUserId === user.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Scans Inspection Modal Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col justify-between rounded-xl fade-in">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-150 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
              <div>
                <CardTitle className="text-base font-bold text-[#2C6455] dark:text-emerald-400">
                  Inspect User: {selectedUser.full_name || "User"}
                </CardTitle>
                <CardDescription className="text-xs dark:text-gray-400">
                  Email: {selectedUser.email} • ID: <code className="text-[10px] bg-gray-100 dark:bg-gray-800 py-0.5 px-1 rounded font-mono">{selectedUser.id}</code>
                </CardDescription>
              </div>
              <Button
                onClick={() => setSelectedUser(null)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 max-h-[55vh]">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-7 h-7 animate-spin text-[#2C6455] dark:text-emerald-400 mb-2" />
                  <p className="text-xs text-gray-500">Retrieving scan history...</p>
                </div>
              ) : selectedUserScans.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  This user has not completed any diagnoses scans yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Diagnostics Scan History ({selectedUserScans.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedUserScans.map((scan) => {
                      const dateStr = new Date(scan.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                      
                      return (
                        <div
                          key={scan.id}
                          className="flex gap-3 p-3 rounded-lg border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 hover:border-[#2C6455]/20 dark:hover:border-emerald-400/20 transition-all relative group"
                        >
                          {/* Scan image */}
                          <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-900 border dark:border-gray-800">
                            {scan.image_url ? (
                              <img
                                src={scan.image_url}
                                alt="Specimen thumbnail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Leaf className="w-6 h-6 m-auto text-gray-300" />
                            )}
                          </div>

                          {/* Scan Meta info */}
                          <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center justify-between mb-0.5">
                              <h5 className="font-bold text-gray-950 dark:text-white truncate">{scan.plant_name}</h5>
                              <Badge variant="outline" className="text-[9px] py-0 border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 font-bold">
                                {scan.confidence}%
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 truncate mb-1">{scan.disease_name}</p>
                            <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {dateStr}
                            </div>
                          </div>

                          {/* Delete Scan shortcut */}
                          <Button
                            onClick={() => handleDeleteScan(scan.id)}
                            variant="ghost"
                            size="sm"
                            className="absolute bottom-2 right-2 h-7 w-7 p-0 text-red-650 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-opacity"
                            title="Delete scan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-150 dark:border-gray-800 flex justify-end flex-shrink-0">
              <Button
                onClick={() => setSelectedUser(null)}
                variant="secondary"
                size="sm"
                className="h-8 text-xs font-semibold px-5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                Close Inspection
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function AdminPanelPage() {
  return (
    <AuthGuard>
      <AdminPanelContent />
    </AuthGuard>
  )
}
