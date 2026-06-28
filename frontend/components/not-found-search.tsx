"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Leaf } from "lucide-react"

export default function NotFoundSearch() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  // PlantVillage Dataset diseases mock lookup list
  const lookupDiseases = [
    { name: "Apple Scab", slug: "apple-scab", plant: "Apple" },
    { name: "Apple Black Rot", slug: "apple-black-rot", plant: "Apple" },
    { name: "Cedar Apple Rust", slug: "apple-cedar-rust", plant: "Apple" },
    { name: "Corn Cercospora Leaf Spot", slug: "corn-cercospora-leaf-spot", plant: "Corn" },
    { name: "Corn Common Rust", slug: "corn-common-rust", plant: "Corn" },
    { name: "Corn Northern Leaf Blight", slug: "corn-northern-leaf-blight", plant: "Corn" },
    { name: "Grape Black Rot", slug: "grape-black-rot", plant: "Grape" },
    { name: "Grape Esca", slug: "grape-esca", plant: "Grape" },
    { name: "Grape Leaf Blight", slug: "grape-leaf-blight", plant: "Grape" },
    { name: "Potato Early Blight", slug: "potato-early-blight", plant: "Potato" },
    { name: "Potato Late Blight", slug: "potato-late-blight", plant: "Potato" },
    { name: "Tomato Bacterial Spot", slug: "tomato-bacterial-spot", plant: "Tomato" },
    { name: "Tomato Early Blight", slug: "tomato-early-blight", plant: "Tomato" },
    { name: "Tomato Late Blight", slug: "tomato-late-blight", plant: "Tomato" },
  ]

  const matches = query
    ? lookupDiseases.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.plant.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  const handleSelect = (slug: string) => {
    setQuery("")
    router.push(`/disease-info/${slug}`)
  }

  return (
    <div className="relative text-left w-full max-w-sm mx-auto">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="h-10 text-xs pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border-gray-205 dark:border-gray-700"
          placeholder="Search crop diseases (e.g. apple, tomato)..."
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="w-3.5 h-3.5" />
        </div>
      </div>

      {isFocused && query && matches.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-gray-50 dark:divide-gray-800/40">
          {matches.map((item) => (
            <div
              key={item.slug}
              onClick={() => handleSelect(item.slug)}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer text-xs transition-colors"
            >
              <Leaf className="w-3.5 h-3.5 text-[#2C6455] dark:text-emerald-400" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                <span className="text-gray-400 dark:text-gray-500 ml-1.5">({item.plant})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
