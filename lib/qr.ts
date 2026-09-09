import QRCode from 'qrcode'

export async function generateQrDataUrl(shortCode: string): Promise<string> {
  const targetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/s/${shortCode}`
  try {
    const dataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
    return dataUrl
  } catch (err) {
    throw new Error('Failed to generate QR code')
  }
}