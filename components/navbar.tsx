"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, LogOut, User, Settings, Leaf } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isAuthPage = pathname === "/auth"

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/disease-detection", label: "Disease Detection" },
    { href: "/disease-info", label: "Disease Info" },
    { href: "/about", label: "About Us" },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg border-b border-white/10 dark:border-gray-800/10 shadow-sm">
      <div className="w-full max-w-[90vw] mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-green-600 dark:text-emerald-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Greenify</span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-[#2C6455] dark:hover:text-[#2C6455] transition-colors text-xs md:text-sm font-semibold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthPage ? (
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-[#2C6455] dark:hover:text-emerald-400">
                  Back to Home
                </Button>
              </Link>
            ) : status === "loading" ? (
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-[#2C6455] text-white text-xs">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth?tab=login">
                  <Button variant="outline" size="sm" className="border-[#2C6455] text-[#2C6455] hover:bg-[#2C6455]/10 px-4">
                    Login
                  </Button>
                </Link>
                <Link href="/auth?tab=signup">
                  <Button size="sm" className="bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] text-white px-4 rounded-lg font-semibold shadow-md">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          {isAuthPage ? (
            <div className="flex items-center space-x-3 md:hidden">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                  Home
                </Button>
              </Link>
            </div>
          ) : (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#2C6455] dark:hover:text-[#2C6455] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                  </div>

                  {session ? (
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                          <AvatarFallback className="bg-[#2C6455] text-white">
                            {session.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            handleSignOut()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 pt-2">
                      <Link href="/auth?tab=login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full border-[#2C6455] text-[#2C6455] hover:bg-[#2C6455]/10"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth?tab=signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-[#2C6455] to-[#1a3d35] hover:from-[#1a3d35] hover:to-[#2C6455] text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  )
}
