import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import QRCode from 'qrcode'
import generatePayload from 'promptpay-qr'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const amount = searchParams.get('amount')

    if (!phone) {
      // ถ้าไม่มี phone ให้ส่ง default banner
      return new Response('No phone provided', { status: 400 })
    }

    // Format phone number
    let formattedId = phone.replace(/[^\d]/g, "")
    
    if (formattedId.length === 10 && formattedId.startsWith("0")) {
      formattedId = `${formattedId.slice(0, 3)}-${formattedId.slice(3, 6)}-${formattedId.slice(6)}`
    } else if (formattedId.length === 13) {
      formattedId = `${formattedId.slice(0, 1)}-${formattedId.slice(1, 5)}-${formattedId.slice(5, 10)}-${formattedId.slice(10, 12)}-${formattedId.slice(12)}`
    }

    // Generate QR Code
    const amountValue = amount && Number.parseFloat(amount) > 0 ? Number.parseFloat(amount) : undefined
    const payload = generatePayload(formattedId, { amount: amountValue })
    const qrCodeDataUrl = await QRCode.toDataURL(payload, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                <path d="M15 15h2v2h-2zM17 17h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z"/>
              </svg>
            </div>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '900',
                color: 'white',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              PromptPay QR
            </h1>
          </div>

          {/* QR Code Container */}
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              marginBottom: '30px',
            }}
          >
            <img
              src={qrCodeDataUrl}
              alt="PromptPay QR Code"
              width="300"
              height="300"
              style={{
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '24px' }}>📱</span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b',
                }}
              >
                {phone}
              </span>
            </div>

            {amount && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.9)',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>💰</span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: 'white',
                  }}
                >
                  ฿{Number.parseFloat(amount).toLocaleString()}
                </span>
              </div>
            )}

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                padding: '8px 16px',
                marginTop: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  color: '#64748b',
                  fontWeight: '600',
                }}
              >
                สแกนเพื่อจ่ายเงิน • qr.softerm.site
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )

  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}