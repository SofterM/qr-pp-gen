import type React from "react"
import type { Metadata } from "next"
import { Inter, Kanit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

const kanit = Kanit({ 
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-kanit"
})

// Generate metadata dynamically based on URL params
export async function generateMetadata({ searchParams }: {
  searchParams: { phone?: string; amount?: string }
}): Promise<Metadata> {
  const phone = searchParams?.phone
  const amount = searchParams?.amount
  
  const baseUrl = 'https://qr.softerm.site'
  
  // If phone exists, create dynamic OG image
  const ogImageUrl = phone 
    ? `${baseUrl}/api/og?phone=${encodeURIComponent(phone)}${amount ? `&amount=${encodeURIComponent(amount)}` : ''}`
    : `${baseUrl}/banner.png`
  
  const title = phone 
    ? `จ่ายเงินให้ ${phone}${amount ? ` จำนวน ฿${amount}` : ''} - PromptPay QR`
    : "PromptPay QR Generator - สร้าง QR Code PromptPay ฟรี"
  
  const description = phone
    ? `สแกน QR Code เพื่อจ่ายเงินผ่าน PromptPay ให้ ${phone}${amount ? ` จำนวน ${amount} บาท` : ''}`
    : "สร้าง QR Code PromptPay ฟรี รวดเร็ว ปลอดภัย รองรับเบอร์โทรและเลขบัตรประชาชน พร้อม API สำหรับนักพัฒนา"

  return {
    title: {
      default: title,
      template: "%s | PromptPay QR Generator"
    },
    description,
    keywords: [
      "PromptPay", 
      "QR Code", 
      "Thailand", 
      "Payment", 
      "API", 
      "Generator",
      "พร้อมเพย์",
      "คิวอาร์โค้ด",
      "ไทย",
      "ชำระเงิน",
      "ฟรี",
      "บัตรประชาชน",
      "เบอร์โทรศัพท์"
    ],
    authors: [{ name: "PromptPay QR Generator" }],
    creator: "PromptPay QR Generator",
    publisher: "PromptPay QR Generator",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    generator: 'Next.js',
    applicationName: 'PromptPay QR Generator',
    referrer: 'origin-when-cross-origin',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/logo.png', sizes: '32x32', type: 'image/png' },
        { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: '/logo.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: '/logo.png',
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: 'th_TH',
      alternateLocale: ['en_US'],
      url: baseUrl,
      siteName: 'PromptPay QR Generator',
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@your_twitter',
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    verification: {
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
    },
    category: 'technology',
    classification: 'Business',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning className={`${inter.variable} ${kanit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="canonical" href="https://qr.softerm.site" />
        <meta name="theme-color" content="#0070f3" />
        <meta name="color-scheme" content="light dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PromptPay QR" />
        <meta name="msapplication-TileColor" content="#0070f3" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${kanit.className} antialiased`}>
        <ThemeProvider 
          defaultTheme="system" 
          storageKey="promptpay-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}