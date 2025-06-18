"use client";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Code, Zap, Shield, Globe } from "lucide-react";

export default function ApiDocs() {
  const { toast } = useToast();

  // ฟังก์ชัน copy ที่ใช้ซ้ำได้ทุกปุ่ม
  const handleCopy = useCallback((text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "คัดลอกเรียบร้อย!",
      description: label ? `คัดลอก ${label}` : text,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Code className="h-3 w-3 mr-1" />
              API Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              PromptPay QR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                API
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              REST API สำหรับสร้าง PromptPay QR Code ใช้งานง่าย รองรับหลายรูปแบบ
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">รวดเร็ว</h3>
                <p className="text-sm text-muted-foreground">Response time ต่ำกว่า 500ms</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">ปลอดภัย</h3>
                <p className="text-sm text-muted-foreground">HTTPS + CORS Support</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-3">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">ฟรี</h3>
                <p className="text-sm text-muted-foreground">ไม่มีค่าใช้จ่าย ไม่จำกัด</p>
              </CardContent>
            </Card>
          </div>

          {/* Base URL */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Base URL</CardTitle>
              <CardDescription>URL หลักสำหรับเรียกใช้ API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <code className="text-sm font-mono" id="base-url">
                  {typeof window !== "undefined" ? window.location.origin : "https://pp-softerm.site"}/api
                </code>
                <Button size="sm" variant="outline" onClick={() => handleCopy(typeof window !== "undefined" ? window.location.origin + "/api" : "https://pp-softerm.site/api", "Base URL")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GET /qr */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">GET</Badge>
                <code className="text-lg font-mono">/qr</code>
              </div>
              <CardTitle>สร้าง QR Code PromptPay</CardTitle>
              <CardDescription>สร้าง QR Code และส่งกลับในรูปแบบที่ต้องการ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parameters */}
              <div>
                <h4 className="font-semibold mb-3">Parameters</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg">
                    <code className="font-mono text-sm">id</code>
                    <Badge variant="destructive" className="w-fit">required</Badge>
                    <span className="text-sm">string</span>
                    <span className="text-sm text-muted-foreground">เบอร์โทร 10 หลัก หรือบัตรประชาชน 13 หลัก</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg">
                    <code className="font-mono text-sm">amount</code>
                    <Badge variant="secondary" className="w-fit">optional</Badge>
                    <span className="text-sm">number</span>
                    <span className="text-sm text-muted-foreground">จำนวนเงิน (ทศนิยม)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg">
                    <code className="font-mono text-sm">format</code>
                    <Badge variant="secondary" className="w-fit">optional</Badge>
                    <span className="text-sm">string</span>
                    <span className="text-sm text-muted-foreground">base64, svg, png (default: base64)</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Examples */}
              <div>
                <h4 className="font-semibold mb-3">ตัวอย่างการใช้งาน</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Base64 JSON Response:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">GET /api/qr?id=0812345678&amount=100.50</code>
                      <Button size="sm" variant="outline" onClick={() => handleCopy('GET /api/qr?id=0812345678&amount=100.50', 'Base64 JSON Example')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">SVG Image:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">GET /api/qr?id=0812345678&format=svg</code>
                      <Button size="sm" variant="outline" onClick={() => handleCopy('GET /api/qr?id=0812345678&format=svg', 'SVG Example')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">PNG Image:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">GET /api/qr?id=0812345678&format=png</code>
                      <Button size="sm" variant="outline" onClick={() => handleCopy('GET /api/qr?id=0812345678&format=png', 'PNG Example')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Response */}
              <div>
                <h4 className="font-semibold mb-3">Response (JSON format)</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "payload": "00020101021129370016A000000677010111081234567805303764540610...",
    "id": "081-234-5678",
    "amount": 100.5
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* POST /qr */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>POST</Badge>
                <code className="text-lg font-mono">/qr</code>
              </div>
              <CardTitle>สร้าง QR Code ผ่าน POST</CardTitle>
              <CardDescription>ส่งข้อมูลผ่าน JSON body</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Request Body</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm">
                    <code>{`{
  "id": "0812345678",
  "amount": 100.50,
  "format": "base64"
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">JavaScript Example</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`fetch('/api/qr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '0812345678',
    amount: 100.50
  })
})
.then(response => response.json())
.then(data => {
  console.log(data.data.qrCode); // Base64 QR Code
});`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GET /payload */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">GET</Badge>
                <code className="text-lg font-mono">/payload</code>
              </div>
              <CardTitle>รับ Payload String</CardTitle>
              <CardDescription>รับเฉพาะ payload string สำหรับสร้าง QR Code เอง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">ตัวอย่าง</h4>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <code className="text-sm font-mono">GET /api/payload?id=0812345678&amount=100.50</code>
                  <Button size="sm" variant="outline" onClick={() => handleCopy('GET /api/payload?id=0812345678&amount=100.50', 'Payload Example')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Response</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-sm">
                    <code>{`{
  "success": true,
  "data": {
    "payload": "00020101021129370016A000000677010111081234567805303764540610...",
    "id": "081-234-5678",
    "amount": 100.5
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HTML Usage */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>การใช้งานใน HTML</CardTitle>
              <CardDescription>แสดง QR Code โดยตรงใน HTML</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{`<!-- แสดง QR Code เป็นรูปภาพ SVG -->
<img src="/api/qr?id=0812345678&amount=100&format=svg" alt="PromptPay QR Code">

<!-- แสดง QR Code เป็นรูปภาพ PNG -->
<img src="/api/qr?id=0812345678&amount=100&format=png" alt="PromptPay QR Code">`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Error Responses */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Error Responses</CardTitle>
              <CardDescription>รูปแบบ response เมื่อเกิดข้อผิดพลาด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm">
                  <code>{`{
  "success": false,
  "error": "Invalid ID format. Use 10-digit phone number or 13-digit national ID"
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Try It Out */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-semibold mb-2">พร้อมทดลองใช้แล้ว!</h3>
              <p className="text-muted-foreground mb-4">
                ลองใช้ API ของเราได้เลย หรือกลับไปสร้าง QR Code ผ่านหน้าเว็บ
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <a href="/">
                    สร้าง QR Code
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/api/qr?id=0812345678&amount=100&format=svg" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ทดลอง API
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
