import { diseaseDatabase } from "@/lib/disease-db"

interface StatsSectionProps {
  usersCount: number
  scansCount: number
}

export function StatsSection({ usersCount, scansCount }: StatsSectionProps) {
  const uniquePlants = new Set(Object.values(diseaseDatabase).map((d: any) => d.plant))
  const supportedPlantsCount = uniquePlants.size
  const supportedDiseasesCount = Object.keys(diseaseDatabase).length

  const stats = [
    { number: String(usersCount), label: "Total Registered Users", description: "Active plant growers" },
    { number: String(scansCount), label: "Total Scans", description: "AI plant health diagnoses" },
    { number: String(supportedDiseasesCount), label: "Supported Diseases", description: "Diagnosable symptoms" },
    { number: String(supportedPlantsCount), label: "Supported Plants", description: "Supported plant species" },
  ]

  return (
    <section className="py-12 bg-green-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            Trusted by Gardeners Worldwide
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Our AI technology delivers consistent, reliable results
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-extrabold text-green-600 dark:text-emerald-400 mb-1.5">
                {stat.number}
              </div>
              <div className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-0.5">{stat.label}</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
