"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Filter, ArrowUpDown, Check, X, Trash2, Star, StarOff, 
  MessageSquare, User, Calendar, Loader2, AlertTriangle 
} from "lucide-react"
import { toast } from "sonner"
import { UserAvatar } from "@/components/ui/avatar"

interface FeedbackItem {
  id: string
  rating: number
  title: string
  message: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
    email?: string | null
  } | null
}

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "featured">("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch feedback joining profiles using supabase relationship references
      const { data, error } = await supabase
        .from("feedback")
        .select("*, profiles(full_name, avatar_url, email)")

      if (error) throw error
      setFeedbacks(data || [])
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch feedback list.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      setActionLoadingId(id)
      const supabase = createClient()

      const { error } = await supabase
        .from("feedback")
        .update({ is_approved: approve })
        .eq("id", id)

      if (error) throw error
      toast.success(approve ? "Feedback approved successfully!" : "Feedback rejected (set to unapproved).")
      
      // Update state locally
      setFeedbacks((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_approved: approve } : item))
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to update feedback status.")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setActionLoadingId(id)
      const supabase = createClient()

      const { error } = await supabase
        .from("feedback")
        .update({ is_featured: !currentFeatured })
        .eq("id", id)

      if (error) throw error
      toast.success(!currentFeatured ? "Review marked as featured!" : "Review unmarked as featured.")
      
      // Update state locally
      setFeedbacks((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_featured: !currentFeatured } : item))
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to update review featured state.")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setActionLoadingId(id)
      const supabase = createClient()

      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", id)

      if (error) throw error
      toast.success("Review deleted successfully.")
      
      // Update state locally
      setFeedbacks((prev) => prev.filter((item) => item.id !== id))
      setDeleteConfirmId(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review.")
    } finally {
      setActionLoadingId(null)
    }
  }

  // Filter & Sort
  const filteredFeedback = feedbacks.filter((item) => {
    const name = item.profiles?.full_name?.toLowerCase() || ""
    const title = item.title.toLowerCase()
    const message = item.message.toLowerCase()
    const matchSearch = 
      name.includes(searchTerm.toLowerCase()) || 
      title.includes(searchTerm.toLowerCase()) || 
      message.includes(searchTerm.toLowerCase())

    if (!matchSearch) return false

    if (statusFilter === "pending") return !item.is_approved
    if (statusFilter === "approved") return item.is_approved
    if (statusFilter === "featured") return item.is_featured

    return true
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
    if (sortBy === "highest") {
      return b.rating - a.rating
    }
    if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#2C6455]" />
      </div>
    )
  }

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base font-bold text-[#2C6455] dark:text-emerald-400 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          User Feedback Management
        </CardTitle>
        <CardDescription className="text-xs dark:text-gray-400">
          Moderate, approve, feature, or remove feedback reviews submitted by platform users.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        {/* Controls: Search, Filter, Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user or content..."
              className="h-9 text-xs pl-8 rounded-lg"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="h-9 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1 text-gray-700 dark:text-gray-300 w-full focus:outline-none"
            >
              <option value="all">All Feedback</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="featured">Featured Testimonials</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="h-9 text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1 text-gray-700 dark:text-gray-300 w-full focus:outline-none"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="highest">Sort by: Highest Rating</option>
              <option value="lowest">Sort by: Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* List of Feedback */}
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
            <p className="text-xs font-semibold">No feedback matches your selection criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => {
              const userName = item.profiles?.full_name || "Anonymous User"
              const userEmail = item.profiles?.email || "No email provided"
              const avatarUrl = item.profiles?.avatar_url
              const dateStr = new Date(item.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })

              const isActionLoading = actionLoadingId === item.id

              return (
                <div
                  key={item.id}
                  className="p-4 border rounded-xl border-gray-150 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* User profile details */}
                    <div className="flex items-center space-x-3">
                      <UserAvatar src={avatarUrl} name={userName} className="h-9 w-9" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {userName}
                        </h4>
                        <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
                      </div>
                    </div>

                    {/* Metadata & Status tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`text-[9px] py-0 px-2 font-bold ${
                        item.is_approved 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {item.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      {item.is_featured && (
                        <Badge className="bg-amber-100 text-amber-800 text-[9px] py-0 px-2 font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Featured
                        </Badge>
                      )}
                      <div className="flex items-center text-[10px] text-gray-400 gap-1 ml-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </div>
                    </div>
                  </div>

                  {/* Feedback rating & text content */}
                  <div className="pl-0 sm:pl-12 space-y-1.5">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= item.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-700"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-400 font-medium ml-1.5">Rating: {item.rating} / 5</span>
                    </div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-gray-50/50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-100/50 dark:border-gray-800 italic">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  {/* Mod Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pl-0 sm:pl-12 border-t border-gray-100/30 dark:border-gray-700/20">
                    <div className="flex items-center gap-2">
                      {item.is_approved ? (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleApprove(item.id, false)}
                          disabled={isActionLoading}
                          className="h-7 text-[10px] text-red-650 hover:bg-red-50 border-red-200 font-semibold"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject / Revoke
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          onClick={() => handleApprove(item.id, true)}
                          disabled={isActionLoading}
                          className="h-7 text-[10px] bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve Review
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                        disabled={isActionLoading || !item.is_approved}
                        className={`h-7 text-[10px] font-semibold border-gray-250 dark:border-gray-700 ${
                          !item.is_approved ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                      >
                        {item.is_featured ? (
                          <>
                            <StarOff className="w-3 h-3 mr-1 text-amber-500" />
                            Unmark Featured
                          </>
                        ) : (
                          <>
                            <Star className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" />
                            Mark as Featured
                          </>
                        )}
                      </Button>
                    </div>

                    <div>
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 p-1 px-2 rounded-lg border border-red-200/50">
                          <span className="text-[10px] text-red-700 dark:text-red-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Confirm Delete?
                          </span>
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={isActionLoading}
                            className="h-6 text-[9px] px-2 font-bold"
                          >
                            Yes
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={isActionLoading}
                            className="h-6 text-[9px] px-2 font-semibold"
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => setDeleteConfirmId(item.id)}
                          disabled={isActionLoading}
                          className="h-7 text-[10px] font-bold"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
