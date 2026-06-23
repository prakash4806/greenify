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
      <div className="container mx-auto px-4 py-8 pt-24 fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Plant Disease Detection
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Upload a photo of your plant to get instant AI-powered diagnosis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2C6455] dark:text-emerald-400">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload Plant Image
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Take a clear photo of the affected plant parts for best results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-[#2C6455]/30 dark:border-emerald-400/30 rounded-lg p-8 text-center bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/30">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected plant"
                        width={300}
                        height={300}
                        className="mx-auto rounded-lg max-h-64 object-cover"
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
                          className="border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                        >
                          Remove Image
                        </Button>
                        {selectedFile && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Drag and drop your image here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                            className="cursor-pointer border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                          >
                            <Upload className="mr-2 h-4 w-4" />
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
                    className="w-full bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Analyze Plant with AI
                      </>
                    )}
                  </Button>
                )}

                {analysisProgress && (
                  <div className="text-center">
                    <p className="text-sm text-[#2C6455] dark:text-emerald-400">{analysisProgress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#2C6455] dark:text-emerald-400">AI Analysis Results</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Real-time AI-powered diagnosis and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2C6455] dark:text-emerald-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Analyzing your plant image with AI...</p>
                    {analysisProgress && (
                      <p className="text-sm text-[#2C6455] dark:text-emerald-400">{analysisProgress}</p>
                    )}
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    {results.success ? (
                      <>
                        {/* Main Result */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-lg p-6 border border-[#2C6455]/20 dark:border-emerald-400/20">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Diagnosis</h3>
                            {results.confidence && (
                              <Badge
                                variant="outline"
                                className="text-sm border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400"
                              >
                                {results.confidence}% Confidence
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl font-bold text-[#2C6455] dark:text-emerald-400">
                              {results.disease}
                            </div>
                            {results.severity && (
                              <Badge className={getSeverityColor(results.severity)}>
                                {getSeverityIcon(results.severity)}
                                <span className="ml-1">{results.severity}</span>
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Treatment */}
                        {results.treatment && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-[#2C6455] dark:text-emerald-400" />
                              Recommended Treatment
                            </h4>
                            <Alert className="border-[#2C6455]/20 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-950/30">
                              <AlertDescription className="text-gray-700 dark:text-gray-300">
                                {results.treatment}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}

                        {/* Prevention */}
                        {results.prevention && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                              <Info className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              Prevention Tips
                            </h4>
                            <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
                              <AlertDescription className="text-gray-700 dark:text-gray-300">
                                {results.prevention}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}

                        {/* Symptoms */}
                        {results.symptoms && results.symptoms.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Common Symptoms</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {results.symptoms.map((symptom, index) => (
                                <li key={index}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Causes */}
                        {results.causes && results.causes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Possible Causes</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {results.causes.map((cause, index) => (
                                <li key={index}>{cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            variant="outline"
                            className="border-[#2C6455]/30 dark:border-emerald-400/30 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/10 dark:hover:bg-emerald-400/10"
                          >
                            Save to Dashboard
                          </Button>
                          <Button className="flex-1 bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500">
                            Get Expert Consultation
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Alert variant="destructive" className="dark:border-red-800 dark:bg-red-950/30">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="dark:text-red-300">
                          {results.error || "Failed to analyze the image. Please try again with a clearer photo."}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Camera className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p>Upload an image to see AI analysis results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tips Section */}
          <Card className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#2C6455] dark:text-emerald-400">Tips for Better AI Analysis</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Follow these guidelines to get the most accurate results from our AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#2C6455]/20 to-emerald-200/40 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Camera className="h-8 w-8 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Clear & Focused</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Take well-lit, sharp images without blur</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-200/40 to-[#2C6455]/20 dark:from-blue-400/20 dark:to-emerald-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <ImageIcon className="h-8 w-8 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Close-up Shots</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Focus on affected areas and symptoms</p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-200/40 to-[#2C6455]/20 dark:from-yellow-400/20 dark:to-emerald-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-8 w-8 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Good Lighting</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use natural light or bright indoor lighting
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-200/40 to-[#2C6455]/20 dark:from-purple-400/20 dark:to-emerald-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-[#2C6455] dark:text-emerald-400" />
                  </div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Multiple Angles</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Upload different perspectives if needed</p>
                </div>
              </div>

              <Alert className="mt-6 border-[#2C6455]/20 dark:border-emerald-400/20 bg-emerald-50/50 dark:bg-emerald-950/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="dark:text-gray-300">
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
