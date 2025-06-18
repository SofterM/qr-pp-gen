import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PromptPay QR Generator - สร้าง QR Code PromptPay ฟรี",
  description: "สร้าง QR Code PromptPay ได้ง่ายๆ พร้อม API สำหรับนักพัฒนา ใช้งานฟรี ไม่จำกัด",
  keywords: "PromptPay, QR Code, Thailand, Payment, API, Generator",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="promptpay-theme">
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
