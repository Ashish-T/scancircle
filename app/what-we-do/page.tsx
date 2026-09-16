'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function WhatWeDoPage() {
  const router = useRouter()

  const handleAuthRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <main className="min-h-screen bg-[#020205] text-gray-200 relative overflow-x-hidden flex flex-col items-center selection:bg-cyan-500/40 selection:text-white">
      
      {/* --- ADVANCED CYBERPUNK BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20 opacity-30"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* --- FLOATING GLASS NAVIGATION --- */}
      <nav className="w-full max-w-[1400px] flex justify-between items-center z-50 mt-8 mb-16 px-6 py-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
          <span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-cyan-300 transition-colors">SCAN CIRCLE</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 font-mono text-[11px] font-bold tracking-[0.15em] uppercase">
          <Link href="/" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">Home</Link>
          <Link href="/what-we-do" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">What We Do</Link>
          <Link href="/about" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">About Us</Link>
          <Link href="/contact" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">Contact</Link>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <Link href="/login" className="hidden sm:block text-gray-400 hover:text-cyan-400 hover:tracking-widest transition-all duration-300 uppercase tracking-wider font-bold">
            Sign In
          </Link>
          <button onClick={handleAuthRedirect} className="relative group overflow-hidden rounded-xl p-[1px]">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div className="relative bg-[#05050a] px-6 py-2.5 rounded-xl transition-all group-hover:bg-opacity-0">
               <span className="text-cyan-300 font-bold uppercase tracking-wider group-hover:text-white transition-colors">Get Started Free</span>
            </div>
          </button>
        </div>
      </nav>

      {/* --- 1. HERO SECTION --- */}
      <section className="w-full max-w-4xl text-center z-10 px-6 mb-24">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]">
          Turn Every Scan Into <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            Followers & Reviews
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate digital gateway for physical storefronts. Instantly route in-store customers to your digital touchpoints using a single, intelligent QR code.
        </p>
        <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-1 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
          <div className="absolute w-[200%] h-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
          <div className="relative inline-flex items-center justify-center w-full h-full px-10 py-5 bg-[#0a0a12] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-indigo-600 rounded-xl transition-all duration-300">
            <span className="text-white font-mono font-bold tracking-widest uppercase text-sm">
              Start Free Trial →
            </span>
          </div>
        </button>
      </section>

      {/* --- 3. VISUAL FLOW SECTION --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32">
        <div className="p-12 bg-gradient-to-br from-[#07070e] to-[#030307] border border-cyan-500/10 rounded-[3rem] shadow-[0_0_50px_rgba(34,211,238,0.05)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020205_100%)] pointer-events-none"></div>

          {/* Step A: Physical QR */}
          <div className="flex flex-col items-center relative z-10 group">
            <div className="w-32 h-32 bg-black border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-105 transition-transform duration-500">
              <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            </div>
            <p className="mt-6 font-mono text-cyan-400 font-bold uppercase tracking-widest text-xs">1. Physical Scan</p>
          </div>

          {/* Connection Line & Particle */}
          <div className="hidden md:flex flex-1 items-center justify-center relative z-10">
            <div className="w-full h-[2px] bg-gradient-to-r from-cyan-500/10 via-cyan-400 to-indigo-500/10 relative">
              <div className="absolute top-1/2 left-0 w-3 h-3 bg-white rounded-full -translate-y-1/2 shadow-[0_0_15px_#fff] animate-[ping_2s_linear_infinite]"></div>
            </div>
          </div>

          {/* Step B: Digital Hub */}
          <div className="flex flex-col items-center relative z-10 group">
            <div className="w-24 h-48 bg-[#0a0a12] border-4 border-gray-800 rounded-3xl flex flex-col items-center py-6 gap-4 shadow-2xl relative group-hover:-translate-y-2 transition-transform duration-500">
              <div className="w-8 h-1 bg-gray-800 rounded-full mb-2"></div>
              {/* Fake Social Icons floating inside phone */}
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0s' }}><svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
              <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}><svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.4s' }}><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg></div>
            </div>
            <p className="mt-6 font-mono text-indigo-400 font-bold uppercase tracking-widest text-xs">2. Digital Routing</p>
          </div>

        </div>
      </section>

      {/* --- 2. HOW IT WORKS (STEP FLOW) --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32">
        <h2 className="text-3xl font-extrabold text-white text-center mb-16 tracking-tight">Seamless Workflow Architecture</h2>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-cyan-500/20 via-indigo-500/50 to-fuchsia-500/20 z-0"></div>

          {[
            { num: '01', title: 'Add Business', desc: 'Securely create your business node on our platform.', color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20' },
            { num: '02', title: 'Link Socials', desc: 'Map your Google Review, Instagram, and menus.', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/20' },
            { num: '03', title: 'Generate QR', desc: 'Deploy your branded hardware to physical tables.', color: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-500/20' },
            { num: '04', title: 'Start Converting', desc: 'Customers scan, follow, and review instantly.', color: 'from-purple-400 to-fuchsia-500', shadow: 'shadow-purple-500/20' }
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className={`w-24 h-24 rounded-2xl bg-[#0a0a12] border border-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/30 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
                <div className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${step.color} group-hover:scale-110 transition-transform font-mono`}>
                  {step.num}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 font-light px-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. CORE BENEFITS (GRID) --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '👥', title: 'Turn walk-ins into followers', desc: 'Capture your physical traffic and seamlessly convert them into long-term digital subscribers.' },
            { icon: '⭐', title: 'Effortless 5-Star Reviews', desc: 'Remove friction. Route customers directly to the Google Review submission page.' },
            { icon: '🔍', title: 'Eliminate manual searching', desc: 'Never rely on customers spelling your handle correctly. One scan drops them right on your profile.' },
            { icon: '📊', title: 'Track every interaction', desc: 'Real-time telemetry on total scans, repeat customers, and platform conversion rates.' },
            { icon: '📱', title: 'One QR for everything', desc: 'A unified digital hub. Socials, menus, and reviews contained in a single matrix.' },
            { icon: '⚡', title: 'Instant Mobile Experience', desc: 'No app required. Optimized for lightning-fast loading across all smartphone browsers.' }
          ].map((benefit, idx) => (
            <div key={idx} className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group transform hover:-translate-y-2 shadow-[0_0_0_transparent] hover:shadow-[0_15px_30px_rgba(34,211,238,0.05)]">
              <div className="w-12 h-12 rounded-xl bg-[#0a0a12] flex items-center justify-center text-2xl mb-6 border border-white/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                {benefit.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{benefit.title}</h4>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 5 & 6. DIFFERENTIATION & FUTURE CHANNELS --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Why Scan Circle */}
        <div className="p-12 bg-gradient-to-br from-[#07070e] to-[#041216] border border-cyan-500/20 rounded-[2.5rem] flex flex-col justify-center shadow-[0_0_40px_rgba(34,211,238,0.05)] group hover:border-cyan-500/40 transition-colors">
          <h2 className="text-3xl font-extrabold text-white mb-8">Why Scan Circle?</h2>
          <div className="space-y-6">
            {[
              { title: 'No app required', text: 'Works instantly on any native smartphone camera.' },
              { title: 'Mobile-first experience', text: 'Hubs designed specifically for vertical thumb-scrolling.' },
              { title: 'Instant setup', text: 'Deploy your entire digital infrastructure in under 5 minutes.' },
              { title: 'Designed for real businesses', text: 'Built to survive chaotic physical storefronts like cafes and salons.' }
            ].map((diff, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 mt-0.5">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{diff.title}</h4>
                  <p className="text-sm text-gray-400 font-light">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Channels */}
        <div className="p-12 bg-gradient-to-br from-[#07070e] to-[#120416] border border-fuchsia-500/20 rounded-[2.5rem] flex flex-col justify-center shadow-[0_0_40px_rgba(217,70,239,0.05)] group hover:border-fuchsia-500/40 transition-colors">
          <h2 className="text-3xl font-extrabold text-white mb-4">The Extensible Matrix</h2>
          <p className="text-gray-400 mb-8 font-light">We are actively building new integration pipelines. Future platform routing channels will include:</p>
          
          <div className="flex flex-wrap gap-4">
            {['WhatsApp', 'LinkedIn', 'TikTok', 'Website URL', 'Digital Menu', 'Booking System', 'Contact Card', 'Maps & Directions', 'Custom Link'].map((channel, i) => (
              <span key={i} className="px-5 py-2.5 bg-[#0a0a12] text-fuchsia-300 border border-fuchsia-500/30 rounded-xl text-sm font-mono tracking-wider hover:bg-fuchsia-500/20 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(217,70,239,0.2)] transition-all cursor-default">
                {channel}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* --- 7. FINAL CTA --- */}
      <section className="w-full max-w-4xl text-center z-10 px-6 mb-32">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Start converting your customers today.</h2>
        <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-1 transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]">
          <div className="absolute w-[200%] h-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
          <div className="relative inline-flex items-center justify-center w-full h-full px-12 py-5 bg-[#0a0a12] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-indigo-600 rounded-xl transition-all duration-300">
            <span className="text-white font-mono font-bold tracking-widest uppercase text-sm">
              👉 Start Free Trial
            </span>
          </div>
        </button>
      </section>

      {/* --- ENTERPRISE SITEMAP FOOTER --- */}
      <footer className="w-full relative z-10 bg-gradient-to-b from-[#07070e] to-[#020205] border-t border-cyan-500/20 pt-20 pb-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
              <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
              <span className="text-lg font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-cyan-300 transition-colors">SCAN CIRCLE</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed font-mono pr-4">
              Empowering modern businesses with decentralized quantum-level QR routing, unified catalog networks, and automated feedback loops.
            </p>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Platform</h4>
            <ul className="space-y-4 font-mono text-xs">
              <li><Link href="/what-we-do" className="text-cyan-400 transition-colors">What We Do</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Legal & Support</h4>
            <ul className="space-y-4 font-mono text-xs">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Headquarters</h4>
            <ul className="space-y-4 font-mono text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">Office:</span> Kolkata, West Bengal
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">Mail:</span> getashish26@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">Sys:</span> Online / Operational
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Scan Circle. All systems nominal.</p>
          <div className="flex gap-4">
            <span className="hover:text-cyan-500 transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-cyan-500 transition-colors cursor-pointer">LinkedIn</span>
            <span className="hover:text-cyan-500 transition-colors cursor-pointer">GitHub</span>
          </div>
        </div>
      </footer>
    </main>
  )
}