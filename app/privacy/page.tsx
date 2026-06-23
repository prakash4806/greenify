import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Greenify",
  description: "Privacy Policy for Greenify - Learn how we collect, use, and protect your data",
}

export default function PrivacyPage() {
  const sections = [
    {
      number: "1",
      title: "Introduction",
      content:
        "Greenify is an AI-powered plant disease detection platform that helps users identify plant diseases through image analysis and machine learning technologies.\n\nThis Privacy Policy outlines how we handle information collected through our website and services.",
    },
    {
      number: "2",
      title: "Information We Collect",
      subsections: [
        {
          subtitle: "Information You Provide",
          items: [
            "Name (if provided)",
            "Email address (if provided)",
            "Contact form submissions",
            "Feedback and support requests",
            "Account information (if registration is available)",
          ],
        },
        {
          subtitle: "Uploaded Images",
          content:
            "When using the disease detection feature, users may upload images of plants or leaves for analysis. These images are processed to generate disease predictions and recommendations.",
        },
        {
          subtitle: "Automatically Collected Information",
          items: [
            "Device type",
            "Browser type",
            "Operating system",
            "IP address",
            "Pages visited",
            "Date and time of access",
            "Usage statistics",
          ],
        },
      ],
    },
    {
      number: "3",
      title: "How We Use Information",
      content:
        "Greenify may use collected information to:\n\n• Provide plant disease detection services\n• Analyze uploaded images for diagnosis\n• Improve model performance and platform functionality\n• Respond to inquiries and support requests\n• Monitor platform performance and security\n• Improve user experience\n• Conduct research and development activities",
    },
    {
      number: "4",
      title: "Image Processing and AI Analysis",
      content:
        "Uploaded plant images are processed using artificial intelligence and machine learning models to generate disease predictions.\n\nWhile we strive to protect uploaded content, users should understand that AI-generated results are predictive in nature and may not always be completely accurate.\n\nGreenify does not claim ownership of images uploaded by users.",
    },
    {
      number: "5",
      title: "Data Storage and Security",
      content:
        "We implement reasonable technical and organizational measures to protect information from unauthorized access, misuse, alteration, or disclosure.\n\nHowever, no method of data transmission or electronic storage can be guaranteed to be completely secure. While we strive to protect your information, we cannot guarantee absolute security.",
    },
    {
      number: "6",
      title: "Data Retention",
      content:
        "We retain information only for as long as necessary to:\n\n• Provide platform functionality\n• Improve our services\n• Meet legal or operational requirements\n\nUploaded images may be retained temporarily for processing, troubleshooting, system improvement, or research purposes unless otherwise stated.",
    },
    {
      number: "7",
      title: "Sharing of Information",
      content:
        "Greenify does not sell, rent, or trade personal information to third parties.\n\nInformation may be shared only in the following circumstances:\n\n• To comply with legal obligations\n• To protect platform security and integrity\n• With trusted service providers that support platform operations\n• With user consent",
    },
    {
      number: "8",
      title: "Third-Party Services",
      content:
        "Greenify may use third-party services such as:\n\n• Hosting providers\n• Analytics tools\n• Cloud infrastructure services\n• Authentication providers\n\nThese third-party services may collect and process information according to their own privacy policies. Greenify is not responsible for the privacy practices of third-party services.",
    },
    {
      number: "9",
      title: "Cookies and Analytics",
      content:
        "Greenify may use cookies and similar technologies to:\n\n• Improve website performance\n• Remember user preferences\n• Analyze website traffic\n• Enhance user experience\n\nUsers may choose to disable cookies through their browser settings, although some features may not function properly.",
    },
    {
      number: "10",
      title: "User Rights",
      content:
        "Depending on applicable laws, users may have the right to:\n\n• Access their personal information\n• Request correction of inaccurate information\n• Request deletion of personal data\n• Withdraw consent where applicable\n• Request information regarding data processing practices\n\nRequests may be submitted through our Contact page.",
    },
    {
      number: "11",
      title: "Children's Privacy",
      content:
        "Greenify is not intended for children under the age required by applicable laws in their jurisdiction.\n\nWe do not knowingly collect personal information from children without appropriate consent.",
    },
    {
      number: "12",
      title: "Changes to This Privacy Policy",
      content:
        "We may update this Privacy Policy from time to time.\n\nAny changes will be posted on this page along with an updated revision date. Continued use of Greenify after updates indicates acceptance of the revised policy.",
    },
    {
      number: "13",
      title: "Contact Us",
      content:
        "If you have questions, concerns, or requests regarding this Privacy Policy, please contact us through the Contact page available on the platform.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Last Updated: June 2026
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            At Greenify, we value your privacy and are committed to protecting your personal information. By accessing or using Greenify, you agree to the practices described in this Privacy Policy.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-[90vw] mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div key={index} className="mb-12">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-8 border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2C6455]/20 to-emerald-300/20 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[#2C6455] dark:text-emerald-400">
                      {section.number}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h2>
                    {section.content && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-line mb-4">
                        {section.content}
                      </p>
                    )}
                    {section.subsections &&
                      section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="mb-6">
                          {subsection.subtitle && (
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {subsection.subtitle}
                            </h3>
                          )}
                          {subsection.content && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-line mb-4">
                              {subsection.content}
                            </p>
                          )}
                          {subsection.items && (
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed text-base space-y-1">
                              {subsection.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#2C6455]/10 to-emerald-400/10 dark:from-emerald-400/20 dark:to-[#2C6455]/20 rounded-3xl p-12 border border-[#2C6455]/20 dark:border-emerald-400/30 backdrop-blur-xl shadow-xl">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Privacy Matters
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                We are committed to protecting your privacy and ensuring transparency in how we handle your data. If you have any questions, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#2C6455] to-emerald-600 hover:from-emerald-600 hover:to-[#2C6455] dark:from-emerald-500 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-emerald-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                    Return to Home
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-3 border-2 border-[#2C6455] dark:border-emerald-400 text-[#2C6455] dark:text-emerald-400 hover:bg-[#2C6455]/5 dark:hover:bg-emerald-400/10 rounded-lg font-medium transition-all duration-300">
                    Contact Support
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
