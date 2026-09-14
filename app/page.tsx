import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center justify-between py-12 px-6 selection:bg-cyan-500/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 blur-[150px] pointer-events-none -z-10"></div>

      {/* Top Navigation */}
      <nav className="w-full max-w-6xl flex justify-between items-center z-10 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-sm font-bold tracking-wider text-white font-mono uppercase">Scan Circle</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold text-gray-300 hover:text-white transition-colors">Sign In</Link>
          <Link href="/dashboard" className="py-2 px-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold rounded-xl transition-all">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl text-center z-10 my-8">
        <div className="inline-flex items-center gap-2 py-1 px-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest">Smart Business QR & Review Hub</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          One Smart QR Code For All Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Social Links & Menus</span>
        </h1>
        
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Instantly route customers from a single scanned QR code to your social media profiles, digital menus, rate cards, and Google Reviews with built-in rating prompts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)]"
          >
            Create Your Business QR Now →
          </Link>
        </div>
      </div>

      {/* Interactive Live Scanner Preview Animation */}
      <div className="w-full max-w-md my-8 bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative z-10 text-center">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-500/20 border border-cyan-500/40 px-3 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 uppercase">
          Live Customer Scan Preview
        </div>

        <div className="mt-2 p-4 bg-black/50 rounded-2xl border border-white/5 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            ☕
          </div>
          <h4 className="text-sm font-bold text-white">Your Business Name</h4>
          <p className="text-[10px] font-mono text-cyan-400 uppercase">Cafe & Restaurant</p>

          <div className="pt-2 space-y-2">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold flex justify-between items-center">
              <span>View Digital Menu & Prices</span>
              <span className="text-[10px] font-mono">Tap</span>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-xs font-semibold flex justify-between items-center">
              <span>Follow on Instagram</span>
              <span className="text-[10px] text-gray-500">↗</span>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-xs font-semibold flex justify-between items-center">
              <span>Rate Us on Google (5★)</span>
              <span className="text-[10px] text-amber-400">★★★★★</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-4 font-mono">When customers scan your QR, this clean mobile page opens instantly.</p>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-12 z-10">
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold mb-4 font-mono">01</div>
          <h3 className="text-lg font-semibold text-white mb-2">Google Places Sync</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Search your business name to automatically link your official Google Review page and capture more 5-star customer feedback.
          </p>
        </div>

        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4 font-mono">02</div>
          <h3 className="text-lg font-semibold text-white mb-2">Menus & Rate Cards</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Easily upload food menus for cafes or service rate lists for salons so customers can check prices directly from their phones.
          </p>
        </div>

        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4 font-mono">03</div>
          <h3 className="text-lg font-semibold text-white mb-2">Smart Analytics</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Track total scans, popular social link clicks, review conversions, and repeat customer scans occurring after 24 hours.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center py-6 border-t border-white/5 z-10 text-xs text-gray-500 font-mono">
        © {new Date().getFullYear()} Scan Circle. All rights reserved.
      </footer>

    </main>
  )
}