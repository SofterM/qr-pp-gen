import { type NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"
import generatePayload from "promptpay-qr"

function formatPromptPayId(id: string): string {
  const cleanId = id.replace(/[^\d]/g, "")

  if (cleanId.length === 10 && cleanId.startsWith("0")) {
    // Phone number format: 0812345678 -> 081-234-5678
    return `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6)}`
  } else if (cleanId.length === 13) {
    // National ID format: 1234567890123 -> 1-2345-67890-12-3
    return `${cleanId.slice(0, 1)}-${cleanId.slice(1, 5)}-${cleanId.slice(5, 10)}-${cleanId.slice(10, 12)}-${cleanId.slice(12)}`
  } else {
    throw new Error("Invalid ID format. Use 10-digit phone number or 13-digit national ID")
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const amount = searchParams.get("amount")
    const format = searchParams.get("format") || "base64" // base64, svg, png

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id (phone number or national ID)" },
        { status: 400 },
      )
    }

    // Format the ID
    const formattedId = formatPromptPayId(id)

    // Generate payload
    const amountValue = amount && Number.parseFloat(amount) > 0 ? Number.parseFloat(amount) : undefined
    const payload = generatePayload(formattedId, { amount: amountValue })

    let qrCodeData: string

    if (format === "svg") {
      qrCodeData = await QRCode.toString(payload, {
        type: "svg",
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      return new NextResponse(qrCodeData, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    } else if (format === "png") {
      const buffer = await QRCode.toBuffer(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    } else {
      // Default: base64
      qrCodeData = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      return NextResponse.json(
        {
          success: true,
          data: {
            qrCode: qrCodeData,
            payload: payload,
            id: formattedId,
            amount: amountValue || null,
          },
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }
  } catch (error) {
    console.error("QR Code generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate QR code",
        success: false,
      },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, amount, format = "base64" } = body

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id (phone number or national ID)" }, { status: 400 })
    }

    // Format the ID
    const formattedId = formatPromptPayId(id)

    // Generate payload
    const amountValue = amount && Number.parseFloat(amount) > 0 ? Number.parseFloat(amount) : undefined
    const payload = generatePayload(formattedId, { amount: amountValue })

    if (format === "svg") {
      const qrCodeData = await QRCode.toString(payload, {
        type: "svg",
        width: 300,
        margin: 2,
      })

      return NextResponse.json({
        success: true,
        data: {
          qrCode: qrCodeData,
          payload: payload,
          id: formattedId,
          amount: amountValue || null,
          format: "svg",
        },
      })
    } else {
      const qrCodeData = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          qrCode: qrCodeData,
          payload: payload,
          id: formattedId,
          amount: amountValue || null,
          format: "base64",
        },
      })
    }
  } catch (error) {
    console.error("QR Code generation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate QR code",
        success: false,
      },
      { status: 400 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
