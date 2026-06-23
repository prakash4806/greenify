export function StatsSection() {
  const stats = [
    { number: "95%", label: "Accuracy Rate", description: "Disease detection accuracy" },
    { number: "50K+", label: "Plants Diagnosed", description: "Successfully analyzed" },
    { number: "100+", label: "Plant Species", description: "Supported varieties" },
    { number: "24/7", label: "Available", description: "Instant diagnosis anytime" },
  ]

  return (
    <section className="py-20 bg-green-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Gardeners Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our AI technology delivers consistent, reliable results
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 dark:text-emerald-400 mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
