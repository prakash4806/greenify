import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-green-50 dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-600 dark:text-emerald-400" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">Greenify</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              AI-powered plant disease detection to help you maintain healthy plants and maximize your harvest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/disease-detection"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                >
                  Disease Detection
                </Link>
              </li>
              <li>
                <Link
                  href="/disease-info"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                >
                  Disease Info
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Greenify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
