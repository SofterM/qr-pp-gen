"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Share2,
  Smartphone,
  DollarSign,
  QrCode,
  Sparkles,
  ArrowRight,
  Check,
  Download,
  FileText,
  Zap,
  Shield,
  Globe,
  ExternalLink,
  ArrowLeft,
  Home,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"
import generatePayload from "promptpay-qr"
import Link from "next/link"

export default function PromptPayGenerator() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [isSharedView, setIsSharedView] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)

    // Load data from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const urlPhone = urlParams.get("phone")
    const urlAmount = urlParams.get("amount")

    if (urlPhone) {
      setPhoneNumber(urlPhone)
      setAmount(urlAmount || "")
      setIsSharedView(true)
      generateQRCode(urlPhone, urlAmount || "")
    }
  }, [])

  const generateQRCode = async (phone: string, amt: string) => {
    if (!phone) {
      if (toast) {
        toast({
          title: "กรุณาใส่เบอร์โทรศัพท์",
          description: "เบอร์โทรศัพท์เป็นข้อมูลที่จำเป็น",
          variant: "destructive",
        })
      }
      return
    }

    setIsGenerating(true)

    try {
      // Format phone number
      let formattedId = phone.replace(/[^\d]/g, "")

      if (formattedId.length === 10 && formattedId.startsWith("0")) {
        formattedId = `${formattedId.slice(0, 3)}-${formattedId.slice(3, 6)}-${formattedId.slice(6)}`
      } else if (formattedId.length === 13) {
        formattedId = `${formattedId.slice(0, 1)}-${formattedId.slice(1, 5)}-${formattedId.slice(5, 10)}-${formattedId.slice(10, 12)}-${formattedId.slice(12)}`
      } else {
        if (toast) {
          toast({
            title: "รูปแบบข้อมูลไม่ถูกต้อง",
            description: "กรุณาใส่เบอร์โทรศัพท์ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก",
            variant: "destructive",
          })
        }
        setIsGenerating(false)
        return
      }

      const amountValue = amt && Number.parseFloat(amt) > 0 ? Number.parseFloat(amt) : undefined
      const payload = generatePayload(formattedId, { amount: amountValue })

      const qrUrl = await QRCode.toDataURL(payload, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })

      setQrCodeUrl(qrUrl)

      // Generate shareable URL
      if (mounted && typeof window !== "undefined") {
        const params = new URLSearchParams()
        params.set("phone", phone)
        if (amt) params.set("amount", amt)
        const shareableUrl = `${window.location.origin}?${params.toString()}`
        setShareUrl(shareableUrl)
      }
    } catch (error) {
      console.error("QR Code generation error:", error)
      if (toast) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถสร้าง QR Code ได้",
          variant: "destructive",
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = () => {
    generateQRCode(phoneNumber, amount)
    setIsSharedView(false) // แสดงในโหมดปกติ
  }

  const copyShareUrl = async () => {
    if (!shareUrl || !mounted || typeof window === "undefined") return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      if (toast) {
        toast({
          title: "คัดลอกสำเร็จ! 🎉",
          description: "ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
        })
      }
    } catch (error) {
      if (toast) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถคัดลอกลิงก์ได้",
          variant: "destructive",
        })
      }
    }
  }

  const downloadQR = () => {
    if (!qrCodeUrl || !mounted || typeof window === "undefined") return

    const link = document.createElement("a")
    link.download = `promptpay-${phoneNumber}-${amount || "no-amount"}.png`
    link.href = qrCodeUrl
    link.click()
  }

  const shareUrl2 = async () => {
    if (!shareUrl || !mounted || typeof window === "undefined") return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "PromptPay QR Code - สแกนเพื่อจ่ายเงิน",
          text: `จ่ายเงินผ่าน PromptPay ${phoneNumber}${amount ? ` จำนวน ${amount} บาท` : ""}`,
          url: shareUrl,
        })
      } catch (error) {
        copyShareUrl()
      }
    } else {
      copyShareUrl()
    }
  }

  const goBackToMain = () => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, '', window.location.pathname)
      setIsSharedView(false)
      setQrCodeUrl("")
      setShareUrl("")
      setPhoneNumber("")
      setAmount("")
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Shared view - แสดงแค่ QR Code (เมื่อมีการแชร์ลิงก์)
  if (isSharedView && qrCodeUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center pb-4 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PromptPay
              </CardTitle>
            </div>
            <CardDescription className="text-lg font-medium">
              💰 สแกนเพื่อจ่ายเงิน
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="bg-white dark:bg-gray-50 p-6 rounded-2xl shadow-inner border-2 border-dashed border-primary/20">
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt="PromptPay QR Code"
                className="w-full h-auto max-w-[280px] mx-auto"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">ผู้รับเงิน</span>
                </div>
                <span className="font-mono font-bold text-blue-900 dark:text-blue-100">{phoneNumber}</span>
              </div>

              {amount && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-900 dark:text-green-100">จำนวนเงิน</span>
                  </div>
                  <span className="font-bold text-xl text-green-900 dark:text-green-100">
                    ฿{Number.parseFloat(amount).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="text-center space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  📱 สแกน QR Code ด้วยแอปธนาคารของคุณ
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                  รองรับทุกธนาคารในประเทศไทย
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  onClick={downloadQR} 
                  variant="outline"
                  className="h-12 flex flex-col gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs">โหลด</span>
                </Button>
                <Button 
                  onClick={shareUrl2} 
                  variant="outline"
                  className="h-12 flex flex-col gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">แชร์</span>
                </Button>
                <Button 
                  onClick={goBackToMain} 
                  variant="outline"
                  className="h-12 flex flex-col gap-1"
                >
                  <Home className="h-4 w-4" />
                  <span className="text-xs">หน้าหลัก</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main form view
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              PromptPay QR Generator
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              สร้าง QR Code{" "}
              <span className="relative inline-block animate-gradient-x bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-[length:200%_auto] text-transparent bg-clip-text">
                PromptPay
                <style jsx>{`
                  @keyframes gradient-x {
                    0% {
                      background-position: 0% 50%;
                    }
                    100% {
                      background-position: 100% 50%;
                    }
                  }
                  .animate-gradient-x {
                    animation: gradient-x 2.5s linear infinite alternate;
                  }
                `}</style>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              เครื่องมือสร้าง QR Code PromptPay ที่ทันสมัย รวดเร็ว และใช้งานง่าย พร้อม REST API สำหรับนักพัฒนา
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => {
                  const element = document.getElementById("generator")
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                <QrCode className="mr-2 h-5 w-5" />
                เริ่มสร้าง QR Code
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  <FileText className="mr-2 h-5 w-5" />
                  ดู API Docs
                </Link>
              </Button>
            </div>
          </div>

          {/* Generator Section */}
          <div id="generator" className="grid lg:grid-cols-2 gap-8 items-start mb-16">
            {/* Form Section */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <QrCode className="h-6 w-6" />
                  สร้าง QR Code
                </CardTitle>
                <CardDescription className="text-base">กรอกข้อมูลเพื่อสร้าง QR Code PromptPay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium">
                      <Smartphone className="h-5 w-5" />
                      เบอร์โทรศัพท์ *
                    </Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="08xxxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-14 text-lg"
                    />
                    <p className="text-sm text-muted-foreground">รองรับเบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="amount" className="flex items-center gap-2 text-base font-medium">
                      <DollarSign className="h-5 w-5" />
                      จำนวนเงิน (บาท)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      className="h-14 text-lg"
                    />
                    <p className="text-sm text-muted-foreground">เว้นว่างหากต้องการให้ผู้จ่ายใส่เอง</p>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full h-14 text-lg font-semibold"
                  disabled={!phoneNumber || isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      กำลังสร้าง...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      สร้าง QR Code
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* QR Code Result */}
            {qrCodeUrl ? (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">QR Code ของคุณ</CardTitle>
                  <CardDescription className="text-base">QR Code พร้อมใช้งาน</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white dark:bg-gray-50 p-8 rounded-2xl shadow-inner">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="PromptPay QR Code"
                      className="w-full h-auto mx-auto"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">เบอร์โทรศัพท์</span>
                      </div>
                      <span className="font-mono font-semibold text-lg">{phoneNumber}</span>
                    </div>

                    {amount && (
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">จำนวนเงิน</span>
                        </div>
                        <span className="font-bold text-xl">฿{Number.parseFloat(amount).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button onClick={copyShareUrl} variant="outline" size="lg" className="h-12">
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                    <Button onClick={shareUrl2} variant="outline" size="lg" className="h-12">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button onClick={downloadQR} variant="outline" size="lg" className="h-12">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-2 border-dashed border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                    <QrCode className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">QR Code จะแสดงที่นี่</h3>
                  <p className="text-muted-foreground">กรอกข้อมูลและกดสร้าง QR Code</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">รวดเร็ว</h3>
                <p className="text-muted-foreground">สร้าง QR Code ได้ในไม่กี่วินาที พร้อมแชร์ลิงก์ทันที</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ปลอดภัย</h3>
                <p className="text-muted-foreground">ใช้มาตรฐาน PromptPay อย่างถูกต้อง รองรับทุกธนาคาร</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">ฟรี 100%</h3>
                <p className="text-muted-foreground">ใช้งานได้ฟรีไม่จำกัด ไม่ต้องสมัครสมาชิก</p>
              </CardContent>
            </Card>
          </div>

          {/* API Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardContent className="pt-8 text-center">
                <div className="max-w-3xl mx-auto">
                  <Badge variant="secondary" className="mb-4">
                    <FileText className="h-4 w-4 mr-2" />
                    API สำหรับนักพัฒนา
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">REST API พร้อมใช้งาน</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    นำ API ของเราไปใช้ในโปรเจกต์ของคุณ รองรับหลายรูปแบบ มี documentation ครบถ้วน
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button size="lg" asChild>
                      <Link href="/docs">
                        <FileText className="mr-2 h-5 w-5" />
                        ดู API Documentation
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="/api/qr?id=0812345678&amount=100&format=svg" target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        ทดลอง API
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}