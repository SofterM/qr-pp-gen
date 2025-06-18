"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { QrCode, FileText, Home } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const navigation = [
    {
      name: "หน้าหลัก",
      href: "/",
      icon: Home,
    },
    {
      name: "API Docs",
      href: "/docs",
      icon: FileText,
    },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo + Brand + Navigation Links */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight ml-2 md:ml-4">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:inline">PromptPay QR</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button key={item.href} variant={pathname === item.href ? "secondary" : "ghost"} size="sm" asChild className="px-4 py-2 rounded-full font-medium">
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
