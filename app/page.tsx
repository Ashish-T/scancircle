import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block py-1 px-3 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
          Scan Circle MVP
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          One Smart QR Code for All Your Business Destinations
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Help customers instantly find your Instagram, YouTube, Facebook, and Google Review platforms with a single mobile-first scan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="py-3.5 px-8 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition text-base shadow-sm"
          >
            Get Started & Start Trial
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-black mb-4">
            01
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Google Places Sync</h3>
          <p className="text-sm text-gray-600">
            Quickly search and link your physical establishment using Google Places API with built-in duplicate prevention.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-black mb-4">
            02
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Dynamic QR Routing</h3>
          <p className="text-sm text-gray-600">
            Generate clean, downloadable QR codes that route users directly to a customized mobile landing page.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-black mb-4">
            03
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Dashboard Control</h3>
          <p className="text-sm text-gray-600">
            Easily manage, toggle, and reorder your social media links and review destinations in real time.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-gray-200 bg-white">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Powered by Scan Circle
        </span>
      </footer>
    </main>
  )
}