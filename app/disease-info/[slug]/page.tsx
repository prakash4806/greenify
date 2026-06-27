import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Leaf } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { diseaseDatabase } from "@/lib/disease-db"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DiseaseDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const disease = diseaseDatabase[resolvedParams.slug]

  if (!disease) {
    notFound()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
      case "High":
        return <AlertTriangle className="h-4 w-4" />
      case "Medium":
        return <Info className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-20 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/disease-info">
          <Button variant="outline" size="sm" className="mb-4 h-8 text-xs">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Disease Info
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <disease.icon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{disease.name}</h1>
              <p className="text-sm text-gray-600">
                {disease.plant} • <em>{disease.scientificName}</em>
              </p>
            </div>
            <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(disease.severity)}`}>
              {getSeverityIcon(disease.severity)}
              <span className="ml-1">{disease.severity} Risk</span>
            </Badge>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{disease.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Symptoms */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-red-700">
                <AlertTriangle className="mr-1.5 h-4 w-4" />
                Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.symptoms.map((symptom: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Causes */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-orange-700">
                <Info className="mr-1.5 h-4 w-4" />
                Causes & Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.causes.map((cause: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Treatment */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-blue-700">
                <CheckCircle className="mr-1.5 h-4 w-4" />
                Treatment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.treatment.map((treatment: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{treatment}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prevention */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-green-700">
                <Leaf className="mr-1.5 h-4 w-4" />
                Prevention Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.prevention.map((prevention: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{prevention}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Alert className="mt-6 py-2.5 px-3">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs text-gray-700">
            <strong>Need help identifying this disease?</strong> Use our AI-powered disease detection tool to analyze
            your plant photos and get instant diagnosis with treatment recommendations.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link href="/disease-detection">
            <Button size="sm" className="h-9 text-xs bg-green-600 hover:bg-green-700 flex-1 sm:flex-none">Diagnose Your Plant</Button>
          </Link>
          <Link href="/contact">
            <Button size="sm" variant="outline" className="h-9 text-xs flex-1 sm:flex-none">
              Contact Expert
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
