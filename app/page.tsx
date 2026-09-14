import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden selection:bg-cyan-500/30 flex flex-col justify-between z-0">
      
      {/* Ambient Futuristic Background Glows & Grid */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-white/[0.03] border border-cyan-500/30 rounded-full mb-8 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-300 text-xs font-mono tracking-widest uppercase">Scan Circle System v2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
          One Smart Matrix for All <br className="hidden md:block" />
          Your Digital Destinations.
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Route users instantly to your social hubs and review coordinates with a single, dynamically updating holographic scan.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center py-4 px-8 font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl hover:from-cyan-400 hover:to-indigo-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out -translate-x-full skew-x-12"></div>
            <span className="relative z-10 flex items-center gap-2">
              Initialize Trial Sequence
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Glass Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative z-10">
        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-500 group">
          <div className="font-mono text-cyan-400 text-sm mb-6 tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">SYS.01</div>
          <h3 className="text-xl font-bold text-white mb-3">Google Places Sync</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Quickly search and link your physical establishment using Google Places API with built-in duplicate prevention algorithms.
          </p>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-500 group">
          <div className="font-mono text-indigo-400 text-sm mb-6 tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">SYS.02</div>
          <h3 className="text-xl font-bold text-white mb-3">Dynamic QR Routing</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Generate clean, downloadable matrix codes that route users directly to a customized, hyper-fast mobile landing terminal.
          </p>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] hover:border-fuchsia-500/30 transition-all duration-500 group">
          <div className="font-mono text-fuchsia-400 text-sm mb-6 tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">SYS.03</div>
          <h3 className="text-xl font-bold text-white mb-3">Instant Dashboard Control</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Easily manage, toggle, and reorder your social media vectors and review destinations in real time through the neural hub.
          </p>
        </div>
      </div>

      {/* Holographic Footer */}
      <footer className="w-full py-8 text-center border-t border-white/5 bg-white/[0.01] backdrop-blur-md relative z-10">
        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">
          Powered by <span className="text-cyan-500/70">Scan Circle Engine</span> // © 2030
        </span>
      </footer>
    </main>
  )
}