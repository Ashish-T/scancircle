'use client'

import { useState, useEffect } from 'react'

export default function QrViewer({ businessId }: { businessId: string }) {
  const [qrCode, setQrCode] = useState<any>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/business/${businessId}/qr`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.qrCode) {
          setQrCode(data.qrCode)
          // Request QR image generation client-side or from a dedicated route
          const resImg = await fetch(`/api/qr/generate?code=${data.qrCode.short_code}`)
          const imgData = await resImg.json()
          if (imgData.dataUrl) setQrDataUrl(imgData.dataUrl)
        }
        setLoading(false)
      })
  }, [businessId])

  if (loading) return <div className="p-6 text-center text-sm text-gray-500">Loading QR Code...</div>

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Your Business QR Code</h3>
      <p className="text-sm text-gray-600 mb-6">Display this code at your counter, tables, or packaging.</p>

      {qrDataUrl ? (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6 inline-block">
            <img src={qrDataUrl} alt="Scan Circle QR Code" className="w-48 h-48 object-contain" />
          </div>
          <a
            href={qrDataUrl}
            download={`scancircle-${qrCode?.short_code}.png`}
            className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition text-sm inline-block text-center"
          >
            Download QR Image
          </a>
        </div>
      ) : (
        <p className="text-sm text-red-500">Could not load QR graphic.</p>
      )}
    </div>
  )
}