"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, ImageIcon, Loader2, CheckCircle, AlertTriangle, Info, Leaf } from "lucide-react"
import Image from "next/image"
import { compressImage } from "@/lib/image-utils"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useSession } from "@/components/session-provider"
import { useRouter } from "next/navigation"
import { diseaseDatabase } from "@/lib/disease-db"
import { FeedbackModal } from "@/components/feedback/FeedbackModal"
import { FeedbackCTA } from "@/components/feedback/FeedbackCTA"
import { X } from "lucide-react"

interface TopPrediction {
  disease: string
  confidence: number
}

interface PlantAnalysisResult {
  plant: string
  disease: string
  slug: string | null
  confidence: number
  severity: string
  model_version: string
  top_predictions?: TopPrediction[]
}

export default function DiseaseDetectionClient() {
  const { data: session } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Image selection states
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // API and status states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState("")
  const [results, setResults] = useState<PlantAnalysisResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  
  // Save states
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isFeedbackSubmittedForCurrentScan, setIsFeedbackSubmittedForCurrentScan] = useState(false)

  // Listen to searchParams on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get("openFeedback") === "true" && session?.user?.id) {
        setIsFeedbackModalOpen(true)
        // Clean URL query parameter so it doesn't open on reload
        router.replace("/disease-detection", { scroll: false })
      }
    }
  }, [session, router])

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Check backend health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${backendUrl}/health`, { signal: AbortSignal.timeout(5000) })
        if (response.ok) {
          const data = await response.json()
          if (data.status === "ok") {
            setBackendOnline(true)
            return
          }
        }
        setBackendOnline(false)
      } catch (err) {
        console.error("Backend health check failed:", err)
        setBackendOnline(false)
      }
    }
    checkHealth()
  }, [backendUrl])

  // Helper: Client-side validation of image properties
  const validateImageFile = (file: File): Promise<{ valid: boolean; reason?: string; imgElement?: HTMLImageElement }> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve({ valid: false, reason: "No file selected." })
        return
      }
      
      const validTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        resolve({ valid: false, reason: "Invalid file type. Please upload a JPG, JPEG, PNG, or WebP image." })
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        resolve({ valid: false, reason: "File size exceeds 10 MB limit." })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          // Check resolution
          if (img.width < 150 || img.height < 150) {
            resolve({ valid: false, reason: "Image resolution is too low. Please upload an image with at least 150x150 pixels." })
            return
          }
          
          // Canvas check: confirm image is not a single solid color (e.g. pure black or white)
          try {
            const canvas = document.createElement("canvas")
            canvas.width = 30
            canvas.height = 30
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.drawImage(img, 0, 0, 30, 30)
              const imgData = ctx.getImageData(0, 0, 30, 30).data
              
              let isSolid = true
              const firstR = imgData[0]
              const firstG = imgData[1]
              const firstB = imgData[2]
              const firstA = imgData[3]
              
              for (let i = 4; i < imgData.length; i += 4) {
                if (imgData[i] !== firstR || imgData[i+1] !== firstG || imgData[i+2] !== firstB || imgData[i+3] !== firstA) {
                  isSolid = false
                  break
                }
              }
              
              if (isSolid) {
                resolve({ valid: false, reason: "The uploaded image appears completely blank or a single solid color. Please upload a clear photo of a plant leaf." })
                return
              }
            }
          } catch (canvasErr) {
            console.warn("Solid color check failed, skipping:", canvasErr)
          }
          
          resolve({ valid: true, imgElement: img })
        }
        img.onerror = () => {
          resolve({ valid: false, reason: "Corrupted image file. The image could not be loaded." })
        }
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        resolve({ valid: false, reason: "Failed to read image file." })
      }
      reader.readAsDataURL(file)
    })
  }

  // Helper: Client-side plant leaf color-profile heuristic detection
  const checkIsPlantLeaf = (img: HTMLImageElement): boolean => {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 50
      canvas.height = 50
      const ctx = canvas.getContext("2d")
      if (!ctx) return true // Fallback to bypass check if canvas context creation fails
      
      ctx.drawImage(img, 0, 0, 50, 50)
      const imgData = ctx.getImageData(0, 0, 50, 50)
      const data = imgData.data
      
      let plantPixelCount = 0
      const totalPixels = 50 * 50
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Green leaf heuristic
        const isGreen = (g > r * 0.95) && (g > b * 1.05)
        // Brown/Yellow leaf heuristic
        const isBrownYellow = (r > b) && (g > b) && (r > 60) && (g > 50) && (Math.abs(r - g) < 60)
        // Red/Autumn leaf heuristic
        const isAutumnLeaf = (r > g) && (r > b) && (g > 30) && (r > 80)
        
        if (isGreen || isBrownYellow || isAutumnLeaf) {
          plantPixelCount++
        }
      }
      
      const ratio = plantPixelCount / totalPixels
      // If plant-like pixels constitute less than 6% of the image, reject it as a non-plant image
      return ratio >= 0.06
    } catch (e) {
      console.error("Plant leaf color heuristic failed, skipping:", e)
      return true // Return true on sandbox CORS restrictions to avoid blocking users
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.")
        setErrorMsg("Unsupported file type. Please select a JPEG, JPG, PNG, or WebP image.")
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB.")
        setErrorMsg("File size exceeds 10 MB limit.")
        return
      }

      try {
        setErrorMsg(null)
        // Compress image for preview
        const compressedImage = await compressImage(file)
        setSelectedImage(compressedImage)
        setSelectedFile(file)
        setResults(null)
        setIsSaved(false)
      } catch (error) {
        console.error("Error processing image:", error)
        toast.error("Error processing image. Please try again.")
      }
    }
  }

  const analyzeImage = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    setErrorMsg(null)
    setResults(null)

    // Stage 1: Basic validation (readability, dimensions, solid color)
    setAnalysisProgress("Validating image...")
    const validation = await validateImageFile(selectedFile)
    if (!validation.valid) {
      setErrorMsg(validation.reason || "Failed image validation check.")
      setIsAnalyzing(false)
      return
    }

    // Stage 2: Plant leaf color-profiling heuristic safeguard
    setAnalysisProgress("Verifying plant leaf features...")
    if (validation.imgElement) {
      const isLeaf = checkIsPlantLeaf(validation.imgElement)
      if (!isLeaf) {
        setErrorMsg("❌ No plant leaf detected. Please upload a clear image of a plant leaf for accurate analysis.")
        setIsAnalyzing(false)
        return
      }
    }

    // =========================================================================
    // FUTURE-PROOFING PLACEHOLDER: ML-Based Plant vs Non-Plant Validator
    // =========================================================================
    // Integrate a lightweight binary classification model (e.g. ONNX Runtime Web
    // or TensorFlow.js) here. This model should scan the image and return a
    // probability score. If the probability of being a plant leaf is low (e.g. < 70%),
    // reject the analysis prior to invoking the backend classifier.
    //
    // Example implementation:
    // const isLeafModel = await plantValidatorModel.predict(selectedFile);
    // if (!isLeafModel) {
    //   setErrorMsg("❌ No plant leaf detected. Please upload a clear image of a plant leaf.");
    //   setIsAnalyzing(false)
    //   return;
    // }
    // =========================================================================

    // Sequential progress status messages for API call
    const progressSteps = [
      "Uploading image...",
      "Processing image...",
      "Running AI inference...",
      "Generating diagnosis..."
    ]
    
    let currentStep = 0
    setAnalysisProgress(progressSteps[0])
    
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length - 1) {
        currentStep++
        setAnalysisProgress(progressSteps[currentStep])
      }
    }, 800)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      clearInterval(progressInterval)

      let data: any
      try {
        data = await response.json()
      } catch {
        throw new Error(`Server returned status code ${response.status}`)
      }

      if (!response.ok || data.success === false) {
        if (data && data.success === false) {
          setErrorMsg(
            `❌ No plant leaf detected. The uploaded image appears to contain a ${data.detected_object || "person or other object"}. Please upload a clear image of a plant leaf.`
          )
          setResults(null)
          setBackendOnline(true)
          return
        }
        const errMsg = data.detail || "Prediction failed"
        throw new Error(errMsg)
      }

      setAnalysisProgress("Completed")
      setResults(data)
      setBackendOnline(true)
    } catch (error: any) {
      clearInterval(progressInterval)
      console.error("Analysis error:", error)
      
      let friendlyError = "Failed to communicate with the classification service. Please try again."
      if (error.name === "AbortError") {
        friendlyError = "The request timed out. Please check your connection and try again."
      } else if (error.message) {
        friendlyError = error.message
      }
      
      setErrorMsg(friendlyError)
      toast.error("Inference failed: " + friendlyError)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveToDashboard = async () => {
    if (!results || !selectedFile) return

    if (!session?.user?.id) {
      toast.error("You must be logged in to save diagnoses to your dashboard.")
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      
      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop() || "jpg"
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: true
        })

      if (uploadError) {
  console.error("Upload Error:", JSON.stringify(uploadError, null, 2))
        console.error("Storage upload failed, trying default bucket name 'diagnoses':", uploadError)
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from("diagnoses")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: true
          })
          
        if (fallbackError) {
  console.error("Fallback Error:", JSON.stringify(fallbackError, null, 2))
          throw new Error("Could not upload image to Supabase Storage bucket ('plant-images' or 'diagnoses'). Please verify bucket configurations.")
        }
      }

      // 2. Retrieve public URL
      const activeBucket = uploadError ? "diagnoses" : "plant-images"
      const { data: urlData } = supabase.storage
        .from(activeBucket)
        .getPublicUrl(fileName)
        
      const publicUrl = urlData.publicUrl

      // 3. Save diagnosis entry to database table
      const { error: dbError } = await supabase.from("diagnoses").insert({
        user_id: session.user.id,
        plant_name: results.plant || "Unknown Plant",
        disease_name: results.disease || "Unknown Disease",
        confidence: results.confidence || 0,
        severity: results.severity || "Unknown",
        model_version: results.model_version || "MobileNetV2-v1",
        image_url: publicUrl,
      })

      if (dbError) {
        console.error("Database Error:", JSON.stringify(dbError, null, 2))
        throw dbError
      }

      setIsSaved(true)
      toast.success("Diagnosis successfully saved to your dashboard!")
    } catch (err: any) {
      console.error("Error saving scan:", err)
      toast.error(err.message || "Failed to save scan records.")
    } finally {
      setIsSaving(false)
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

  const resetAnalysis = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setResults(null)
    setErrorMsg(null)
    setIsSaved(false)
    setIsFeedbackSubmittedForCurrentScan(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 pt-20 fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Plant Disease Detection
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Upload a photo of your plant to get instant AI-powered diagnosis
            </p>
          </div>

          {/* Backend offline warning banner */}
          {backendOnline === false && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Warning: The Plant Disease classification service seems offline at <code>{backendUrl}</code>. Predictions might fail until the backend server is started.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center text-lg font-semibold text-[#2C6455] dark:text-emerald-400">
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Plant Image
                </CardTitle>
                <CardDescription className="text-xs dark:text-gray-400">
                  Take a clear photo of the affected plant parts for best results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <div className="border-2 border-dashed border-[#2C6455]/30 dark:border-emerald-400/30 rounded-lg p-6 text-center bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/30">
                  {selectedImage ? (
                    <div className="space-y-3">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected plant"
                        width={280}
                        height={280}
                        className="mx-auto rounded-lg max-h-56 object-cover"
                      />
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <Button
                          onClick={resetAnalysis}
                          variant="outline"
                          size="sm"
                          disabled={isAnalyzing}
                          className="h-8 text-xs border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                        >
                          Remove Image
                        </Button>
                        {selectedFile && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          Drag and drop your image here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Supports JPG, JPEG, PNG, WEBP (max 10MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="h-9 text-xs cursor-pointer border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                        >
                          <Upload className="mr-2 h-3.5 w-3.5" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {selectedImage && !results && (
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full h-9 text-xs bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        {analysisProgress || "Analyzing plant..."}
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-3.5 w-3.5" />
                        Analyze Plant with AI
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl flex flex-col justify-between">
              <div>
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-[#2C6455] dark:text-emerald-400">AI Analysis Results</CardTitle>
                  <CardDescription className="text-xs dark:text-gray-400">
                    Real-time AI-powered diagnosis on your plant leaf sample
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  {isAnalyzing ? (
                    <div className="text-center py-10">
                      <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#2C6455] dark:text-emerald-400 mb-3" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{analysisProgress}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Please do not close this window</p>
                    </div>
                  ) : errorMsg ? (
                    <div className="space-y-4">
                      <Alert variant="destructive" className="py-2.5 px-3 dark:border-red-800 dark:bg-red-950/30">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm dark:text-red-300">
                          {errorMsg}
                        </AlertDescription>
                      </Alert>
                      <Button onClick={resetAnalysis} variant="outline" className="w-full text-xs h-9">
                        Try Another Image
                      </Button>
                    </div>
                  ) : results ? (
                    <div className="space-y-4">
                      {/* Prediction Disclaimer Notice */}
                      <Alert className="bg-[#2C6455]/5 border-[#2C6455]/20 dark:bg-emerald-950/20 dark:border-emerald-800/50 py-2 px-3">
                        <Info className="h-4 w-4 text-[#2C6455] dark:text-emerald-400" />
                        <AlertDescription className="text-xs text-gray-700 dark:text-gray-300 leading-normal">
                          This AI model is trained only on plant leaf images from the PlantVillage dataset. Uploading non-plant images may produce incorrect predictions.
                        </AlertDescription>
                      </Alert>

                      {/* Main Result */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-lg p-5 border border-[#2C6455]/20 dark:border-emerald-400/20 shadow-inner">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Most Likely Disease</h3>
                          <Badge
                            variant="outline"
                            className="text-xs py-0.5 border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 font-bold"
                          >
                            {results.confidence}% Model Confidence
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Plant Name</p>
                            <p className="text-sm font-bold text-gray-950 dark:text-white mt-0.5">{results.plant}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Disease Name</p>
                            <p className="text-sm font-bold text-gray-950 dark:text-white mt-0.5">{results.disease}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Severity Risk</p>
                            <div className="mt-1">
                              <Badge className={`text-xs px-2.5 py-0.5 font-bold ${getSeverityColor(results.severity)}`}>
                                {results.severity}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">AI Model Version</p>
                            <p className="text-xs font-mono text-gray-600 dark:text-gray-300 mt-1">{results.model_version}</p>
                          </div>
                        </div>

                        {/* Medical check disclaimer warning note */}
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-3 border-t border-gray-200/50 dark:border-gray-700/50 pt-2 flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Please verify the symptoms before applying any treatment.
                        </p>
                      </div>

                      {/* Save and Reset Options (View details button is removed) */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={handleSaveToDashboard}
                          disabled={isSaving || isSaved}
                          variant="outline"
                          className="flex-1 h-9 text-xs border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10 font-semibold disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                              Saving Scan...
                            </>
                          ) : isSaved ? (
                            "Diagnosis Saved"
                          ) : (
                            "Save Scan to Profile"
                          )}
                        </Button>
                        
                        <Button
                          onClick={resetAnalysis}
                          variant="secondary"
                          className="flex-1 h-9 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold"
                        >
                          Analyze Another Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Camera className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm">Choose and upload an image to view AI analysis results</p>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Inline Disease Information Section (replaces page navigation) */}
          {results && results.slug && diseaseDatabase[results.slug] && (
            <Card className="mt-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl overflow-hidden fade-in">
              <CardHeader className="p-5 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="text-lg font-bold text-[#2C6455] dark:text-emerald-400">
                  Disease Information: {diseaseDatabase[results.slug].name}
                </CardTitle>
                <CardDescription className="text-xs dark:text-gray-400 font-medium">
                  {diseaseDatabase[results.slug].plant} • <em>{diseaseDatabase[results.slug].scientificName}</em>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 uppercase tracking-wide text-xs">Description</h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {diseaseDatabase[results.slug].description}
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
                      {diseaseDatabase[results.slug].symptoms.map((symptom: string, index: number) => (
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
                      {diseaseDatabase[results.slug].causes.map((cause: string, index: number) => (
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
                      {diseaseDatabase[results.slug].treatment.map((treatment: string, index: number) => (
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
                      {diseaseDatabase[results.slug].prevention.map((prev: string, index: number) => (
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
          )}

          {/* Feedback Section */}
          {results && (
            <>
              <FeedbackCTA
                onClick={() => {
                  if (session?.user?.id) {
                    setIsFeedbackModalOpen(true)
                  } else {
                    router.push(`/auth?callbackUrl=${encodeURIComponent("/disease-detection?openFeedback=true")}`)
                  }
                }}
              />
              <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                userId={session?.user?.id || ""}
                onSuccess={() => setIsFeedbackSubmittedForCurrentScan(true)}
              />
            </>
          )}

          {/* Tips Section */}
          <Card className="mt-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-lg font-semibold text-[#2C6455] dark:text-emerald-400">Tips for Better AI Analysis</CardTitle>
              <CardDescription className="text-xs dark:text-gray-400">
                Follow these guidelines to get the most accurate results from our AI
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#2C6455]/20 to-emerald-200/40 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
                    <Camera className="h-6 w-6 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-white">Clear & Focused</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Take well-lit, sharp images without blur</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-200/40 to-[#2C6455]/20 dark:from-blue-400/20 dark:to-emerald-400/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="h-6 w-6 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-white">Close-up Shots</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Focus on affected areas and symptoms</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-200/40 to-[#2C6455]/20 dark:from-yellow-400/20 dark:to-emerald-400/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
                    <Upload className="h-6 w-6 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-white">Good Lighting</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Use natural light or bright indoor lighting
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-200/40 to-[#2C6455]/20 dark:from-purple-400/20 dark:to-emerald-400/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-white">Multiple Angles</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Upload different perspectives if needed</p>
                </div>
              </div>

              <Alert className="mt-4 py-2.5 px-3 border-[#2C6455]/20 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-950/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs text-gray-700 dark:text-gray-300">
                  <strong>Pro Tip:</strong> For best results, capture images during daylight hours and include both
                  affected and healthy parts of the plant for comparison.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
