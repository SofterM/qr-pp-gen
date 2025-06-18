import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const amount = searchParams.get('amount')

    if (!phone) {
      return new Response('No phone provided', { status: 400 })
    }

    const title = `จ่ายเงินให้ ${phone}${amount ? ` จำนวน ฿${amount}` : ''}`
    const subtitle = 'สแกน QR Code เพื่อจ่ายเงิน'

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
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <div style={{ color: 'white', fontSize: '40px' }}>📱</div>
            </div>
            <h1
              style={{
                fontSize: '60px',
                fontWeight: '900',
                color: 'white',
                margin: 0,
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              PromptPay QR
            </h1>
          </div>

          {/* QR Code Placeholder */}
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '60px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '320px',
                height: '320px',
                background: '#f1f5f9',
                border: '4px dashed #cbd5e1',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
              }}
            >
              <div style={{ marginBottom: '20px' }}>📱</div>
              <div style={{ fontSize: '24px', color: '#64748b', fontWeight: '600' }}>
                QR Code
              </div>
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: '28px' }}>📱</span>
              <span
                style={{
                  fontSize: '32px',
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
                  background: 'rgba(34, 197, 94, 0.95)',
                  borderRadius: '20px',
                  padding: '16px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <span style={{ fontSize: '28px' }}>💰</span>
                <span
                  style={{
                    fontSize: '36px',
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
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '12px 24px',
                marginTop: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  color: '#64748b',
                  fontWeight: '600',
                }}
              >
                {subtitle} • qr.softerm.site
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