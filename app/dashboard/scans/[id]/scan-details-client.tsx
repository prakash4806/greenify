"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-provider"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Trash2, Loader2, Calendar, AlertTriangle, CheckCircle, Info, Leaf, ShieldAlert } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { diseaseDatabase } from "@/lib/disease-db"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"

interface ScanDetailsClientProps {
  scanId: string
}

function ScanDetailsContent({ scanId }: ScanDetailsClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [scan, setScan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchScanDetails() {
      try {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
          .from("diagnoses")
          .select("*")
          .eq("id", scanId)
          .eq("user_id", session.user.id)
          .maybeSingle()

        if (error) throw error
        setScan(data)
      } catch (err) {
        console.error("Error fetching scan details:", err)
        toast.error("Failed to load scan details.")
      } finally {
        setLoading(false)
      }
    }

    fetchScanDetails()
  }, [scanId, session?.user?.id])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this scan record?")) return

    setDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("diagnoses")
        .delete()
        .eq("id", scanId)
        .eq("user_id", session?.user?.id)

      if (error) throw error

      toast.success("Scan deleted successfully!")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Delete scan failed:", err)
      toast.error(err.message || "Failed to delete scan record.")
    } finally {
      setDeleting(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
      case "High":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "Low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "None":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 pt-20 flex flex-col items-center justify-center min-h-[70vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#2C6455] dark:text-emerald-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading scan report...</p>
        </div>
      </div>
    )
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 pt-20 flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scan Not Found</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            The requested scan record does not exist or you do not have permission to view it.
          </p>
          <Link href="/dashboard">
            <Button size="sm" className="bg-[#2C6455] text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const slug = scan.slug || scan.disease_name.toLowerCase().replace(/\s+/g, "-")
  const disease = diseaseDatabase[slug]
  const scanDate = new Date(scan.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 pt-20 fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold px-4 border-[#2C6455]/30 text-[#2C6455] dark:text-emerald-400">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold px-4 border-red-200 dark:border-red-900/30 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              )}
              Delete Diagnosis Record
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: Image Card */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl overflow-hidden rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-bold text-[#2C6455] dark:text-emerald-400 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  Diagnosed Specimen
                </CardTitle>
                <CardDescription className="text-xs">
                  Original image uploaded for AI evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="border border-gray-150 dark:border-gray-700 rounded-lg overflow-hidden relative w-full h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  {scan.image_url && !imageError ? (
                    <img
                      src={scan.image_url}
                      alt={`${scan.plant_name} specimen`}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-gray-400">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <p className="text-xs font-medium">Image could not be retrieved from Supabase storage.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Column: AI Scan Metrics */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl rounded-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-bold text-[#2C6455] dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Diagnosis Summary
                </CardTitle>
                <CardDescription className="text-xs">
                  Model confidence metrics and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold block mb-0.5">Plant Name</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{scan.plant_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block mb-0.5">Diagnosis</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{scan.disease_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block mb-0.5">Model Confidence</span>
                    <Badge variant="outline" className="text-xs py-0.5 border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 font-bold">
                      {scan.confidence}%
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block mb-0.5">Severity Risk</span>
                    <Badge className={`text-xs px-2.5 py-0.5 font-bold ${getSeverityColor(scan.severity)}`}>
                      {scan.severity}
                    </Badge>
                  </div>
                  <div className="col-span-2 border-t pt-3 border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 font-semibold block mb-0.5">Scan Timestamp</span>
                    <span className="text-gray-950 dark:text-gray-200 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {scanDate}
                    </span>
                  </div>
                  <div className="col-span-2 border-t pt-3 border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 font-semibold block mb-0.5">Inference Version</span>
                    <span className="font-mono text-gray-600 dark:text-gray-300">{scan.model_version || "MobileNetV2-v1"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Card: Inline Care Details */}
          {disease ? (
            <Card className="mt-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl overflow-hidden rounded-xl">
              <CardHeader className="p-5 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="text-lg font-bold text-[#2C6455] dark:text-emerald-400 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Inline Disease Information: {disease.name}
                </CardTitle>
                <CardDescription className="text-xs dark:text-gray-400 font-medium">
                  {disease.plant} • <em>{disease.scientificName}</em>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 uppercase tracking-wide text-xs">Description</h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {disease.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {/* Symptoms */}
                  <div className="p-3.5 bg-red-50/50 dark:bg-red-950/10 rounded-lg border border-red-100/50 dark:border-red-900/10">
                    <h4 className="text-xs font-bold text-red-800 dark:text-red-400 mb-2 flex items-center uppercase tracking-wide">
                      <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                      Symptoms
                    </h4>
                    <ul className="space-y-1.5">
                      {disease.symptoms.map((symptom: string, index: number) => (
                        <li key={index} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-normal">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Causes */}
                  <div className="p-3.5 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-100/50 dark:border-orange-900/10">
                    <h4 className="text-xs font-bold text-orange-800 dark:text-orange-400 mb-2 flex items-center uppercase tracking-wide">
                      <Info className="mr-1.5 h-3.5 w-3.5" />
                      Causes & Risk Factors
                    </h4>
                    <ul className="space-y-1.5">
                      {disease.causes.map((cause: string, index: number) => (
                        <li key={index} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-normal">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment */}
                  <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg border border-blue-100/50 dark:border-blue-900/10">
                    <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center uppercase tracking-wide">
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                      Treatment Options
                    </h4>
                    <ul className="space-y-1.5">
                      {disease.treatment.map((treatment: string, index: number) => (
                        <li key={index} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-normal">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div className="p-3.5 bg-green-50/50 dark:bg-green-950/10 rounded-lg border border-green-100/50 dark:border-green-900/10">
                    <h4 className="text-xs font-bold text-green-800 dark:text-green-400 mb-2 flex items-center uppercase tracking-wide">
                      <Leaf className="mr-1.5 h-3.5 w-3.5" />
                      Prevention Strategies
                    </h4>
                    <ul className="space-y-1.5">
                      {disease.prevention.map((prev: string, index: number) => (
                        <li key={index} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-normal">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {prev}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="mt-6 border-[#2C6455]/20 bg-emerald-50/50 dark:bg-emerald-950/10 py-2.5 px-3">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs text-gray-700 dark:text-gray-300">
                This prediction is marked as <strong>Healthy ({scan.disease_name})</strong>. No plant disease detected, meaning treatment options and preventative care protocols are not required for this specimen.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ScanDetailsClient({ scanId }: ScanDetailsClientProps) {
  return (
    <AuthGuard>
      <ScanDetailsContent scanId={scanId} />
    </AuthGuard>
  )
}
