import { type NextRequest, NextResponse } from "next/server"
import generatePayload from "promptpay-qr"

function formatPromptPayId(id: string): string {
  const cleanId = id.replace(/[^\d]/g, "")

  if (cleanId.length === 10 && cleanId.startsWith("0")) {
    return `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6)}`
  } else if (cleanId.length === 13) {
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

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id (phone number or national ID)" },
        { status: 400 },
      )
    }

    const formattedId = formatPromptPayId(id)
    const amountValue = amount && Number.parseFloat(amount) > 0 ? Number.parseFloat(amount) : undefined
    const payload = generatePayload(formattedId, { amount: amountValue })

    return NextResponse.json(
      {
        success: true,
        data: {
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
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate payload",
        success: false,
      },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
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
