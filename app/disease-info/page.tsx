"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Leaf, Bug, Droplets, AlertTriangle } from "lucide-react"
import { AnimatedPlaceholder } from "@/components/animated-placeholder"
import Link from "next/link"

export default function DiseaseInfoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // PlantVillage Dataset diseases
  const plantDiseases = [
    {
      plant: "Apple",
      diseases: [
        { name: "Apple Scab", severity: "High", slug: "apple-scab", icon: Bug },
        { name: "Black Rot", severity: "High", slug: "apple-black-rot", icon: Bug },
        { name: "Cedar Apple Rust", severity: "Medium", slug: "apple-cedar-rust", icon: Bug },
      ],
    },
    {
      plant: "Cherry",
      diseases: [{ name: "Powdery Mildew", severity: "Medium", slug: "cherry-powdery-mildew", icon: Droplets }],
    },
    {
      plant: "Corn",
      diseases: [
        { name: "Cercospora Leaf Spot", severity: "Medium", slug: "corn-cercospora-leaf-spot", icon: Leaf },
        { name: "Common Rust", severity: "Medium", slug: "corn-common-rust", icon: Bug },
        { name: "Northern Leaf Blight", severity: "High", slug: "corn-northern-leaf-blight", icon: Leaf },
      ],
    },
    {
      plant: "Grape",
      diseases: [
        { name: "Black Rot", severity: "High", slug: "grape-black-rot", icon: Bug },
        { name: "Esca (Black Measles)", severity: "Critical", slug: "grape-esca", icon: AlertTriangle },
        { name: "Leaf Blight", severity: "Medium", slug: "grape-leaf-blight", icon: Leaf },
      ],
    },
    {
      plant: "Orange",
      diseases: [
        { name: "Huanglongbing (Citrus Greening)", severity: "Critical", slug: "orange-huanglongbing", icon: Bug },
      ],
    },
    {
      plant: "Peach",
      diseases: [{ name: "Bacterial Spot", severity: "High", slug: "peach-bacterial-spot", icon: Bug }],
    },
    {
      plant: "Pepper",
      diseases: [{ name: "Bacterial Spot", severity: "High", slug: "pepper-bacterial-spot", icon: Bug }],
    },
    {
      plant: "Potato",
      diseases: [
        { name: "Early Blight", severity: "High", slug: "potato-early-blight", icon: Bug },
        { name: "Late Blight", severity: "Critical", slug: "potato-late-blight", icon: Droplets },
      ],
    },
    {
      plant: "Squash",
      diseases: [{ name: "Powdery Mildew", severity: "Medium", slug: "squash-powdery-mildew", icon: Droplets }],
    },
    {
      plant: "Strawberry",
      diseases: [{ name: "Leaf Scorch", severity: "Medium", slug: "strawberry-leaf-scorch", icon: Leaf }],
    },
    {
      plant: "Tomato",
      diseases: [
        { name: "Bacterial Spot", severity: "High", slug: "tomato-bacterial-spot", icon: Bug },
        { name: "Early Blight", severity: "High", slug: "tomato-early-blight", icon: Bug },
        { name: "Late Blight", severity: "Critical", slug: "tomato-late-blight", icon: Droplets },
        { name: "Leaf Mold", severity: "Medium", slug: "tomato-leaf-mold", icon: Droplets },
        { name: "Septoria Leaf Spot", severity: "Medium", slug: "tomato-septoria-leaf-spot", icon: Leaf },
        { name: "Spider Mites", severity: "Medium", slug: "tomato-spider-mites", icon: Bug },
        { name: "Target Spot", severity: "Medium", slug: "tomato-target-spot", icon: Leaf },
        { name: "Yellow Leaf Curl Virus", severity: "High", slug: "tomato-yellow-leaf-curl-virus", icon: Bug },
        { name: "Mosaic Virus", severity: "High", slug: "tomato-mosaic-virus", icon: Bug },
      ],
    },
  ]

  const filteredPlants = plantDiseases.filter(
    (plant) =>
      plant.plant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.diseases.some((disease) => disease.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
      case "High":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      {/* Hero Section - 100vh */}
      <div className="h-screen flex items-center justify-center pt-16">
        <div className="w-full max-w-[90vw] mx-auto px-4 fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Hello, What Plant Disease Do You Want To Learn?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive information on plant diseases from the PlantVillage Dataset. Click on any disease for
              detailed information.
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full h-16 pl-6 pr-16 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg focus:border-[#2C6455] dark:focus:border-emerald-400 focus:ring-4 focus:ring-[#2C6455]/10 dark:focus:ring-emerald-400/10 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder=""
                />

                {/* Animated Placeholder */}
                {!searchTerm && !isSearchFocused && (
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <AnimatedPlaceholder className="text-lg text-gray-400 dark:text-gray-500" />
                  </div>
                )}

                {/* Search Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-10 h-10 bg-[#2C6455] dark:bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Search suggestions/pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {["Apple Diseases", "Tomato Blight", "Fungal Infections", "Bacterial Spots"].map(
                  (suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(suggestion.split(" ")[0].toLowerCase())}
                      className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-[#2C6455] dark:hover:border-emerald-400 hover:text-[#2C6455] dark:hover:text-emerald-400 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Cards Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Disease Cards with proper spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPlants.map((plant, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-green-100 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl hover:scale-105"
              >
                <CardHeader className="bg-green-50 dark:bg-emerald-950/30">
                  <CardTitle className="flex items-center text-green-800 dark:text-emerald-400">
                    <Leaf className="mr-2 h-5 w-5" />
                    {plant.plant}
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    {plant.diseases.length} disease{plant.diseases.length !== 1 ? "s" : ""} documented
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {plant.diseases.map((disease, diseaseIndex) => (
                      <Link key={diseaseIndex} href={`/disease-info/${disease.slug}`}>
                        <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md">
                          <div className="flex items-center space-x-4">
                            <disease.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-[#2C6455] dark:group-hover:text-emerald-400 transition-colors" />
                            <span className="font-medium text-gray-900 dark:text-white group-hover:text-[#2C6455] dark:group-hover:text-emerald-400 transition-colors">
                              {disease.name}
                            </span>
                          </div>
                          <Badge className={getSeverityColor(disease.severity)}>{disease.severity}</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <div className="text-center py-16">
              <Leaf className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Try searching for a different plant or disease name.
              </p>
            </div>
          )}

          {/* Info Section */}
          <Card className="mt-20 bg-green-50 dark:bg-emerald-950/30 border-green-200 dark:border-emerald-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-emerald-400 text-2xl">
                About PlantVillage Dataset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 dark:text-emerald-300 mb-6 text-lg leading-relaxed">
                Our disease database is based on the comprehensive PlantVillage Dataset, which contains over 50,000
                expert curated images of healthy and diseased crop leaves. This ensures accurate and reliable
                information for all listed diseases.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-emerald-400 mb-2">38</div>
                  <div className="text-sm text-green-700 dark:text-emerald-300 font-medium">Disease Classes</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-emerald-400 mb-2">14</div>
                  <div className="text-sm text-green-700 dark:text-emerald-300 font-medium">Crop Species</div>
                </div>
                <div className="p-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-emerald-400 mb-2">50K+</div>
                  <div className="text-sm text-green-700 dark:text-emerald-300 font-medium">Expert Images</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
