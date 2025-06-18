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

export const metadata: Metadata = {
  title: {
    default: "PromptPay QR Generator - สร้าง QR Code PromptPay ฟรี",
    template: "%s | PromptPay QR Generator"
  },
  description: "สร้าง QR Code PromptPay ฟรี รวดเร็ว ปลอดภัย รองรับเบอร์โทรและเลขบัตรประชาชน พร้อม API สำหรับนักพัฒนา",
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
    url: 'https://your-domain.vercel.app',
    siteName: 'PromptPay QR Generator',
    title: 'PromptPay QR Generator - สร้าง QR Code PromptPay ฟรี',
    description: 'สร้าง QR Code PromptPay ฟรี รวดเร็ว ปลอดภัย รองรับเบอร์โทรและเลขบัตรประชาชน พร้อม API สำหรับนักพัฒนา',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'PromptPay QR Generator - สร้าง QR Code PromptPay ฟรี',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptPay QR Generator - สร้าง QR Code PromptPay ฟรี',
    description: 'สร้าง QR Code PromptPay ฟรี รวดเร็ว ปลอดภัย รองรับเบอร์โทรและเลขบัตรประชาชน พร้อม API สำหรับนักพัฒนา',
    images: ['/banner.png'],
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