import Link from "next/link"

export const metadata = {
  title: "Terms and Conditions | Greenify",
  description: "Terms and Conditions for using Greenify - AI-powered plant disease detection platform",
  alternatives: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  const sections = [
    {
      number: "1",
      title: "Acceptance of Terms",
      content:
        "By using Greenify, you acknowledge that you have read, understood, and agreed to these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of the platform.",
    },
    {
      number: "2",
      title: "About Greenify",
      content:
        "Greenify is an AI-powered plant disease detection platform designed to assist users in identifying potential plant diseases from uploaded images and provide informational recommendations related to plant health. The information provided by Greenify is intended for educational and informational purposes only.",
    },
    {
      number: "3",
      title: "User Responsibilities",
      content:
        "When using Greenify, you agree to: Provide accurate information when required. Use the platform only for lawful purposes. Avoid uploading harmful, malicious, or inappropriate content. Not attempt to interfere with the operation or security of the platform. Respect applicable laws and regulations.",
    },
    {
      number: "4",
      title: "AI-Based Recommendations",
      content:
        "Greenify utilizes artificial intelligence and machine learning technologies to analyze plant images and generate disease predictions. While we strive to provide accurate results, Greenify does not guarantee the accuracy, completeness, or reliability of any diagnosis, prediction, recommendation, or treatment suggestion. Users should consult agricultural experts, plant pathologists, or qualified professionals before making significant agricultural or commercial decisions based solely on the platform's results.",
    },
    {
      number: "5",
      title: "Intellectual Property",
      content:
        "All content, branding, logos, designs, software, text, graphics, and other materials available on Greenify are the property of Greenify or its respective licensors and are protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or commercially exploit any part of the platform without prior written permission.",
    },
    {
      number: "6",
      title: "User Content",
      content:
        "By uploading images or content to Greenify, you retain ownership of your content. You grant Greenify a limited, non-exclusive right to process uploaded content solely for providing plant disease detection and related platform functionality. Users are responsible for ensuring they have the necessary rights to upload submitted content.",
    },
    {
      number: "7",
      title: "Limitation of Liability",
      content:
        "Greenify shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from: Use of the platform. Reliance on AI-generated results. Loss of crops, plants, revenue, or business opportunities. Service interruptions or technical issues. Use of the platform is at your own risk.",
    },
    {
      number: "8",
      title: "Availability of Service",
      content:
        "We strive to maintain platform availability; however, we do not guarantee uninterrupted or error-free operation. Greenify reserves the right to modify, suspend, or discontinue any part of the service at any time without prior notice.",
    },
    {
      number: "9",
      title: "Third-Party Services",
      content:
        "The platform may utilize third-party technologies, APIs, hosting providers, analytics services, or other tools. Greenify is not responsible for the content, policies, or practices of third-party services.",
    },
    {
      number: "10",
      title: "Privacy",
      content:
        "Your use of Greenify is also governed by our Privacy Policy. We encourage users to review the Privacy Policy to understand how information is collected, used, and protected.",
    },
    {
      number: "11",
      title: "Changes to These Terms",
      content:
        "Greenify reserves the right to update or modify these Terms and Conditions at any time. Any changes will be reflected on this page with an updated revision date. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
    },
    {
      number: "12",
      title: "Contact Us",
      content:
        "If you have any questions regarding these Terms and Conditions, please contact us through the Contact page or the official communication channels provided on the platform.",
    },
    {
      number: "13",
      title: "Governing Law",
      content:
        "These Terms and Conditions shall be governed by and interpreted in accordance with applicable laws and regulations without regard to conflict of law principles.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 pt-20 pb-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Last Updated: June 2026
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
            Welcome to Greenify. These Terms and Conditions govern your access to and use of the Greenify platform and
            services. By accessing or using Greenify, you agree to comply with these terms.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl p-6 border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-bold text-[#2C6455] dark:text-emerald-400">
                      {section.number}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs md:text-sm whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Acknowledgment Section */}
          <div className="bg-gradient-to-r from-[#2C6455]/10 to-emerald-400/10 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-2xl p-8 border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-xl shadow-xl">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Acknowledgment
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs md:text-sm mb-5">
                By using Greenify, you acknowledge and agree to these Terms and Conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <button className="px-6 py-2 bg-gradient-to-r from-[#2C6455] to-emerald-600 hover:from-emerald-600 hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500 text-white rounded-lg text-xs font-semibold h-9 transition-all duration-300 shadow-md hover:shadow-lg">
                    Return to Home
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-6 py-2 border border-[#2C6455] dark:border-emerald-400 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/5 dark:hover:bg-emerald-400/10 rounded-lg text-xs font-semibold h-9 transition-all duration-300">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
