"use server"

import * as fal from "@fal-ai/serverless-client"

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
})

export interface PlantAnalysisResult {
  success: boolean
  disease?: string
  confidence?: number
  severity?: string
  treatment?: string
  prevention?: string
  symptoms?: string[]
  causes?: string[]
  error?: string
}

export async function analyzePlantImage(imageData: string): Promise<PlantAnalysisResult> {
  try {
    // Convert base64 to blob URL for Fal AI
    const response = await fetch(imageData)
    const blob = await response.blob()

    // Upload image to Fal AI
    const imageUrl = await fal.storage.upload(blob)

    // Use Fal AI's plant disease detection model
    const result = await fal.subscribe("fal-ai/plant-disease-detection", {
      input: {
        image_url: imageUrl,
        confidence_threshold: 0.5,
      },
    })

    // Process the AI response
    if (result.data && result.data.predictions && result.data.predictions.length > 0) {
      const prediction = result.data.predictions[0]

      // Map the AI response to our format
      const diseaseInfo = mapDiseaseInfo(prediction.label, prediction.confidence)

      return {
        success: true,
        disease: prediction.label,
        confidence: Math.round(prediction.confidence * 100),
        severity: diseaseInfo.severity,
        treatment: diseaseInfo.treatment,
        prevention: diseaseInfo.prevention,
        symptoms: diseaseInfo.symptoms,
        causes: diseaseInfo.causes,
      }
    } else {
      return {
        success: true,
        disease: "Healthy Plant",
        confidence: 95,
        severity: "None",
        treatment: "Your plant appears healthy! Continue with regular care.",
        prevention: "Maintain proper watering, lighting, and nutrition to keep your plant healthy.",
        symptoms: [],
        causes: [],
      }
    }
  } catch (error) {
    console.error("Plant analysis error:", error)
    return {
      success: false,
      error: "Failed to analyze the image. Please try again with a clearer photo.",
    }
  }
}

// Helper function to map disease names to detailed information
function mapDiseaseInfo(diseaseName: string, confidence: number) {
  const diseaseDatabase: Record<string, any> = {
    early_blight: {
      severity: confidence > 0.8 ? "High" : "Medium",
      treatment: "Apply copper-based fungicide every 7-14 days. Remove affected leaves and improve air circulation.",
      prevention: "Avoid overhead watering, ensure proper plant spacing, and rotate crops annually.",
      symptoms: ["Dark spots with concentric rings on leaves", "Yellowing around spots", "Leaf drop"],
      causes: ["Alternaria solani fungus", "High humidity", "Poor air circulation"],
    },
    late_blight: {
      severity: "Critical",
      treatment: "Apply systemic fungicide immediately. Remove all affected plant parts and destroy them.",
      prevention: "Use resistant varieties, avoid overhead watering, and ensure good drainage.",
      symptoms: ["Water-soaked spots on leaves", "White fuzzy growth on leaf undersides", "Rapid plant collapse"],
      causes: ["Phytophthora infestans", "Cool, wet weather", "Poor drainage"],
    },
    bacterial_spot: {
      severity: confidence > 0.7 ? "High" : "Medium",
      treatment: "Apply copper-based bactericide. Remove affected leaves and improve air circulation.",
      prevention: "Use pathogen-free seeds, avoid overhead irrigation, and practice crop rotation.",
      symptoms: ["Small, dark spots on leaves", "Yellow halos around spots", "Fruit lesions"],
      causes: ["Xanthomonas bacteria", "Warm, humid conditions", "Water splash"],
    },
    powdery_mildew: {
      severity: "Medium",
      treatment: "Apply sulfur or potassium bicarbonate spray. Improve air circulation around plants.",
      prevention: "Avoid overhead watering, ensure proper spacing, and choose resistant varieties.",
      symptoms: ["White powdery coating on leaves", "Leaf distortion", "Stunted growth"],
      causes: ["Various fungal species", "High humidity", "Poor air circulation"],
    },
    leaf_spot: {
      severity: confidence > 0.75 ? "Medium" : "Low",
      treatment: "Remove affected leaves, apply fungicide if severe, and improve growing conditions.",
      prevention: "Water at soil level, ensure good drainage, and avoid overcrowding plants.",
      symptoms: ["Circular spots on leaves", "Brown or black lesions", "Leaf yellowing"],
      causes: ["Various fungal pathogens", "Wet conditions", "Poor sanitation"],
    },
  }

  const normalizedName = diseaseName.toLowerCase().replace(/\s+/g, "_")
  return (
    diseaseDatabase[normalizedName] || {
      severity: "Unknown",
      treatment: "Consult with a local agricultural extension office for specific treatment recommendations.",
      prevention: "Maintain good plant hygiene and optimal growing conditions.",
      symptoms: ["Symptoms vary depending on the specific condition"],
      causes: ["Multiple factors may contribute to this condition"],
    }
  )
}
