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
      
      {/* --- INLINE CSS FOR 3D ANIMATIONS & LIGHTNING --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes revolveOscillate {
          0%, 100% { transform: rotateY(-20deg) rotateX(8deg); }
          50% { transform: rotateY(20deg) rotateX(-2deg); }
        }
        @keyframes lightningStrike {
          0% { transform: translateX(-100%); opacity: 0; filter: drop-shadow(0 0 5px #22d3ee); }
          20% { opacity: 1; filter: drop-shadow(0 0 25px #22d3ee) brightness(1.8); }
          80% { opacity: 1; filter: drop-shadow(0 0 25px #22d3ee) brightness(1.8); }
          100% { transform: translateX(150%); opacity: 0; filter: drop-shadow(0 0 5px #22d3ee); }
        }
        @keyframes floatReview {
          0%, 100% { transform: translateY(0px) scale(1); box-shadow: 0 10px 30px rgba(34,211,238,0.1); }
          50% { transform: translateY(-15px) scale(1.03); box-shadow: 0 25px 50px rgba(34,211,238,0.4); }
        }
        @keyframes popStar {
          0%, 100% { transform: scale(1); color: #fbbf24; }
          50% { transform: scale(1.4); color: #fef3c7; filter: drop-shadow(0 0 10px #fbbf24); }
        }
        @keyframes floatIconSocial {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-view { perspective: 1500px; }
      `}} />

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
          <Link href="/login" className="hidden sm:block text-gray-400 hover:text-cyan-400 hover:tracking-widest transition-all duration-300 uppercase tracking-wider font-bold">Sign In</Link>
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
          The ultimate digital gateway for physical storefronts. Instantly route in-store customers to your Google Reviews and social touchpoints using a single, intelligent QR code.
        </p>
        <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-1 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
          <div className="absolute w-[200%] h-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
          <div className="relative inline-flex items-center justify-center w-full h-full px-10 py-5 bg-[#0a0a12] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-indigo-600 rounded-xl transition-all duration-300">
            <span className="text-white font-mono font-bold tracking-widest uppercase text-sm">
              Start 14-Day Free Trial →
            </span>
          </div>
        </button>
      </section>

      {/* --- 3. THE VISUAL FLOW (Lightning & Big Revolving Phone) --- */}
      <section className="w-full max-w-[1400px] z-10 px-6 mb-32 perspective-view">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 py-20 px-8 lg:px-16 bg-gradient-to-br from-[#07070e] to-[#040812] border border-cyan-500/20 rounded-[3rem] shadow-[0_0_60px_rgba(34,211,238,0.05)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020205_100%)] pointer-events-none z-0"></div>

          {/* A. The Physical QR Node */}
          <div className="flex flex-col items-center relative z-10 shrink-0 group">
            <div className="w-40 h-40 bg-[#020205] border-[3px] border-cyan-500/50 rounded-3xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.2)] group-hover:scale-105 transition-transform duration-500 p-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2 font-bold">• Scan Me •</span>
              <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z"/>
              </svg>
            </div>
            <p className="mt-8 font-mono text-cyan-400 font-bold uppercase tracking-widest text-sm text-center">1. Physical <br/>Customer Scan</p>
          </div>

          {/* B. The Lightning Arrow Effect */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 overflow-hidden h-32">
            <div className="absolute w-full h-[1px] bg-cyan-900/30"></div>
            
            {/* Animated Laser Arrow Sequence */}
            <div className="flex gap-1 text-cyan-400" style={{ animation: 'lightningStrike 1.2s infinite ease-in-out' }}>
              {Array(6).fill(0).map((_, i) => (
                <svg key={i} className="w-16 h-16 drop-shadow-[0_0_15px_#22d3ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ))}
            </div>
          </div>

          {/* C. Massive Revolving Phone */}
          <div className="flex flex-col items-center relative z-10 shrink-0">
            <div className="w-[320px] h-[640px] preserve-3d bg-[#020205] border-[6px] border-gray-800 rounded-[3.5rem] shadow-[0_0_60px_rgba(34,211,238,0.25)] flex flex-col items-center px-5 py-8 relative" style={{ animation: 'revolveOscillate 7s ease-in-out infinite' }}>
              
              {/* Phone Notch */}
              <div className="absolute top-3 w-28 h-6 bg-gray-900 rounded-full z-30 shadow-inner"></div>
              
              {/* Screen Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/10 via-transparent to-indigo-600/20 rounded-[3rem] z-0"></div>

              <p className="text-[11px] font-mono text-cyan-400 tracking-[0.2em] font-bold mt-8 relative z-10 uppercase text-center">Scan Circle <br/> Active Node</p>

              {/* Automated Google Reviews Card (Popping Animation) */}
              <div className="relative z-20 w-full bg-white rounded-2xl p-5 mt-8 border border-gray-100" style={{ animation: 'floatReview 4s ease-in-out infinite' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center p-2 shadow-sm">
                    {/* Google G SVG */}
                    <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-bold text-sm leading-tight">Google Reviews</h4>
                    <p className="text-gray-500 text-[10px] font-mono">Auto-Capture Engaged</p>
                  </div>
                </div>
                
                {/* 5 Popping Stars */}
                <div className="flex gap-1.5 mb-3 px-1">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" style={{ animation: `popStar 2s infinite ease-in-out ${i * 0.15}s` }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full mb-1.5"></div>
                <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
              </div>

              {/* Social Nodes Floating Underneath */}
              <div className="relative z-10 w-full mt-10 grid grid-cols-2 gap-4 px-2">
                {/* Instagram Node */}
                <div className="bg-[#0a0a12] border border-fuchsia-500/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.15)]" style={{ animation: 'floatIconSocial 3s ease-in-out infinite 0.2s' }}>
                  <svg className="w-8 h-8 text-fuchsia-400 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  <span className="text-[10px] font-mono text-gray-400">Follow Us</span>
                </div>
                {/* Facebook Node */}
                <div className="bg-[#0a0a12] border border-blue-600/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.15)]" style={{ animation: 'floatIconSocial 3s ease-in-out infinite 0.6s' }}>
                  <svg className="w-8 h-8 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span className="text-[10px] font-mono text-gray-400">Like Page</span>
                </div>
                {/* WhatsApp Node */}
                <div className="bg-[#0a0a12] border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]" style={{ animation: 'floatIconSocial 3s ease-in-out infinite 1s' }}>
                  <svg className="w-8 h-8 text-emerald-400 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span className="text-[10px] font-mono text-gray-400">Message</span>
                </div>
                {/* Catalog Node */}
                <div className="bg-[#0a0a12] border border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]" style={{ animation: 'floatIconSocial 3s ease-in-out infinite 1.4s' }}>
                  <svg className="w-8 h-8 text-amber-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  <span className="text-[10px] font-mono text-gray-400">View Menu</span>
                </div>
              </div>
            </div>
            
            <p className="mt-8 font-mono text-indigo-400 font-bold uppercase tracking-widest text-sm text-center">2. Digital Routing <br/> & Engagement</p>
          </div>

        </div>
      </section>

      {/* --- 2. HOW IT WORKS (STEP FLOW) --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32">
        <h2 className="text-3xl font-extrabold text-white text-center mb-16 tracking-tight">Seamless Workflow Architecture</h2>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          
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

      {/* --- FEATURE GRID (NEON GLASS CARDS) --- */}
      <div className="w-full max-w-6xl z-10 px-6 mb-24 mt-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12"><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono tracking-tight">SYSTEM CAPABILITIES</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-cyan-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold mb-6 font-mono border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">01</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Automated Google Reviews</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Search your business name to automatically link your official Google Review page and seamlessly capture more 5-star customer feedback.</p>
              </div>
            </div>
          </div>

          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-indigo-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-6 font-mono border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">02</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Multiple Catalog Options</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Easily build and organize food menus or service rate lists by categories so customers can check your catalog variations instantly.</p>
              </div>
            </div>
          </div>

          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-6 font-mono border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">03</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Smart Analytics Dashboard</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Track total scans, popular social link clicks, review conversions, and monitor repeat customer scans occurring after 24 hours.</p>
              </div>
            </div>
          </div>

          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-fuchsia-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center font-bold mb-6 font-mono border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)] group-hover:scale-110 group-hover:bg-fuchsia-500/20 transition-all duration-300">04</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">One QR for Social Handles</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Unify your entire digital footprint. Route customers to Instagram, WhatsApp, Facebook, and Twitter through a single, beautifully branded QR code.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

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