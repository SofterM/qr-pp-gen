import { Metadata } from 'next'
import PromptPayGenerator from './PromptPayGenerator'

// Generate metadata dynamically based on searchParams
export async function generateMetadata({
  searchParams,
}: {
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
    title,
    description,
    openGraph: {
      title,
      description,
      url: phone ? `${baseUrl}?phone=${phone}${amount ? `&amount=${amount}` : ''}` : baseUrl,
      siteName: 'PromptPay QR Generator',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default function HomePage({
  searchParams,
}: {
  searchParams: { phone?: string; amount?: string }
}) {
  return <PromptPayGenerator />
}