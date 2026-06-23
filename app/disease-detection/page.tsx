"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, ImageIcon, Loader2, CheckCircle, AlertTriangle, Info } from "lucide-react"
import Image from "next/image"
import { analyzePlantImage, type PlantAnalysisResult } from "@/app/actions/analyze-plant"
import { compressImage } from "@/lib/image-utils"

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<PlantAnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState("")

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.")
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB.")
        return
      }

      try {
        // Compress image for better performance
        const compressedImage = await compressImage(file)
        setSelectedImage(compressedImage)
        setSelectedFile(file)
        setResults(null)
      } catch (error) {
        console.error("Error processing image:", error)
        alert("Error processing image. Please try again.")
      }
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setAnalysisProgress("Preparing image for analysis...")

    try {
      // Update progress
      setAnalysisProgress("Uploading image to AI service...")

      // Call the server action
      const result = await analyzePlantImage(selectedImage)

      setAnalysisProgress("Processing AI analysis...")

      // Simulate a brief processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResults(result)
      setAnalysisProgress("")
    } catch (error) {
      console.error("Analysis error:", error)
      setResults({
        success: false,
        error: "Failed to analyze the image. Please try again.",
      })
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress("")
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
      case "High":
        return <AlertTriangle className="h-4 w-4" />
      case "Medium":
        return <Info className="h-4 w-4" />
      case "None":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
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
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => {
                            setSelectedImage(null)
                            setSelectedFile(null)
                            setResults(null)
                          }}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                        >
                          Remove Image
                        </Button>
                        {selectedFile && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
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
                          Supports JPG, PNG, WebP (max 10MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button
                            variant="outline"
                            className="h-9 text-xs cursor-pointer border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                          >
                            <Upload className="mr-2 h-3.5 w-3.5" />
                            Choose File
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {selectedImage && (
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full h-9 text-xs bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-3.5 w-3.5" />
                        Analyze Plant with AI
                      </>
                    )}
                  </Button>
                )}

                {analysisProgress && (
                  <div className="text-center">
                    <p className="text-xs text-[#2C6455] dark:text-emerald-400">{analysisProgress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg font-semibold text-[#2C6455] dark:text-emerald-400">AI Analysis Results</CardTitle>
                <CardDescription className="text-xs dark:text-gray-400">
                  Real-time AI-powered diagnosis and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {isAnalyzing ? (
                  <div className="text-center py-6">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#2C6455] dark:text-emerald-400 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5">Analyzing your plant image with AI...</p>
                    {analysisProgress && (
                      <p className="text-xs text-[#2C6455] dark:text-emerald-400">{analysisProgress}</p>
                    )}
                  </div>
                ) : results ? (
                  <div className="space-y-4">
                    {results.success ? (
                      <>
                        {/* Main Result */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-lg p-5 border border-[#2C6455]/20 dark:border-emerald-400/20">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Diagnosis</h3>
                            {results.confidence && (
                              <Badge
                                variant="outline"
                                className="text-xs py-0.5 border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400"
                              >
                                {results.confidence}% Confidence
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl font-bold text-[#2C6455] dark:text-emerald-400">
                              {results.disease}
                            </div>
                            {results.severity && (
                              <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(results.severity)}`}>
                                {getSeverityIcon(results.severity)}
                                <span className="ml-1">{results.severity}</span>
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Treatment */}
                        {results.treatment && (
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                              <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-[#2C6455] dark:text-emerald-400" />
                              Recommended Treatment
                            </h4>
                            <Alert className="py-2.5 px-3 border-[#2C6455]/20 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-950/30">
                              <AlertDescription className="text-sm text-gray-700 dark:text-gray-300">
                                {results.treatment}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}

                        {/* Prevention */}
                        {results.prevention && (
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                              <Info className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              Prevention Tips
                            </h4>
                            <Alert className="py-2.5 px-3 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
                              <AlertDescription className="text-sm text-gray-700 dark:text-gray-300">
                                {results.prevention}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}

                        {/* Symptoms */}
                        {results.symptoms && results.symptoms.length > 0 && (
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Common Symptoms</h4>
                            <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
                              {results.symptoms.map((symptom, index) => (
                                <li key={index}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Causes */}
                        {results.causes && results.causes.length > 0 && (
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Possible Causes</h4>
                            <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
                              {results.causes.map((cause, index) => (
                                <li key={index}>{cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="flex-1 h-9 text-xs border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                          >
                            Save to Dashboard
                          </Button>
                          <Button className="flex-1 h-9 text-xs bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500">
                            Get Expert Consultation
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Alert variant="destructive" className="py-2.5 px-3 dark:border-red-800 dark:bg-red-950/30">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm dark:text-red-300">
                          {results.error || "Failed to analyze the image. Please try again with a clearer photo."}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Camera className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm">Upload an image to see AI analysis results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tips Section */}
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
