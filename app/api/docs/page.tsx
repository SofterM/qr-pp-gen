import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">PromptPay QR API Documentation</h1>
          <p className="text-gray-600">API สำหรับสร้าง PromptPay QR Code</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="bg-gray-100 p-2 rounded block">
              {typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">GET</Badge>
              /qr
            </CardTitle>
            <CardDescription>สร้าง QR Code PromptPay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Parameters</h4>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">id</code>
                  <span className="text-sm text-red-600">required</span>
                  <span className="text-sm">เบอร์โทรศัพท์ (10 หลัก) หรือเลขบัตรประชาชน (13 หลัก)</span>
                </div>
                <div className="flex gap-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">amount</code>
                  <span className="text-sm text-gray-500">optional</span>
                  <span className="text-sm">จำนวนเงิน (ทศนิยม)</span>
                </div>
                <div className="flex gap-4">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">format</code>
                  <span className="text-sm text-gray-500">optional</span>
                  <span className="text-sm">รูปแบบ: base64 (default), svg, png</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">ตัวอย่างการใช้งาน</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Base64 (JSON Response):</p>
                  <code className="bg-gray-100 p-2 rounded block text-sm">GET /api/qr?id=0812345678&amount=100.50</code>
                </div>
                <div>
                  <p className="text-sm font-medium">SVG Image:</p>
                  <code className="bg-gray-100 p-2 rounded block text-sm">
                    GET /api/qr?id=0812345678&amount=100.50&format=svg
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium">PNG Image:</p>
                  <code className="bg-gray-100 p-2 rounded block text-sm">GET /api/qr?id=0812345678&format=png</code>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Response (JSON format)</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "payload": "00020101021129370016A000000677010111081234567805303764540610...",
    "id": "081-234-5678",
    "amount": 100.5
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">POST</Badge>
              /qr
            </CardTitle>
            <CardDescription>สร้าง QR Code ผ่าน POST request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Request Body</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {`{
  "id": "0812345678",
  "amount": 100.50,
  "format": "base64"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">JavaScript Example</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`fetch('/api/qr', {
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
});`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">GET</Badge>
              /payload
            </CardTitle>
            <CardDescription>รับเฉพาะ payload string สำหรับสร้าง QR Code เอง</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">ตัวอย่าง</h4>
              <code className="bg-gray-100 p-2 rounded block text-sm">
                GET /api/payload?id=0812345678&amount=100.50
              </code>
            </div>

            <div>
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {`{
  "success": true,
  "data": {
    "payload": "00020101021129370016A000000677010111081234567805303764540610...",
    "id": "081-234-5678",
    "amount": 100.5
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "success": false,
  "error": "Invalid ID format. Use 10-digit phone number or 13-digit national ID"
}`}
            </pre>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">การใช้งานใน HTML</h3>
              <pre className="bg-white p-3 rounded text-sm overflow-x-auto">
                {`<!-- แสดง QR Code เป็นรูปภาพ SVG -->
<img src="/api/qr?id=0812345678&amount=100&format=svg" alt="PromptPay QR Code">

<!-- แสดง QR Code เป็นรูปภาพ PNG -->
<img src="/api/qr?id=0812345678&amount=100&format=png" alt="PromptPay QR Code">`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
