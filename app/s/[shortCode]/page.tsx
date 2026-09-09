import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function QrLandingPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params

  // Fetch QR code and associated business and active links
  const qrCode = await prisma.qrCode.findUnique({
    where: { short_code: shortCode },
    include: {
      business: {
        include: {
          links: {
            where: { enabled: true },
            orderBy: { display_order: 'asc' },
          },
        },
      },
    },
  })

  if (!qrCode || !qrCode.business) {
    notFound()
  }

  const business = qrCode.business

  // Server-side subscription & trial check
  const now = new Date()
  let isAccessible = true

  if (business.status === 'EXPIRED' || business.status === 'SUSPENDED') {
    isAccessible = false
  } else if (business.status === 'TRIAL' && business.trial_ends_at) {
    if (now > new Date(business.trial_ends_at)) {
      isAccessible = false
    }
  }

  // Handle expired trial / inactive state
  if (!isAccessible) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h1>
          <p className="text-sm text-gray-600 mb-6">
            This Scan Circle page is temporarily unavailable. Ask the business to reactivate its Scan Circle account[cite: 1].
          </p>
          <a
            href="/login"
            className="inline-block w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition text-sm"
          >
            Are you the business owner? Renew Scan Circle[cite: 1]
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 bg-gray-50 max-w-md mx-auto">
      <div className="w-full pt-8 flex flex-col items-center text-center">
        {business.logo_url ? (
          <img src={business.logo_url} alt={business.name} className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
            {business.name.charAt(0)}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{business.name}</h1>
        <p className="text-sm text-gray-500 mb-8">Thanks for visiting us! Choose an option below:</p>

        <div className="w-full space-y-3">
          {business.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-4 px-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-black font-medium text-gray-900 transition text-base"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="w-full py-6 text-center">
        <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          Powered by Scan Circle[cite: 1]
        </span>
      </div>
    </main>
  )
}