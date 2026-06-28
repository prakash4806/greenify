"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  name: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 py-3 mb-4 select-none z-20 relative" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center hover:text-[#2C6455] dark:hover:text-emerald-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <div key={index} className="flex items-center space-x-1.5">
            <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-600" />
            {isLast || !item.href ? (
              <span className="text-gray-800 dark:text-gray-200 font-bold truncate max-w-[200px]" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#2C6455] dark:hover:text-emerald-400 transition-colors truncate max-w-[200px]"
              >
                {item.name}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
