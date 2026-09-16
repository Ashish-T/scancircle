'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const SLIDES = [
  '/slide1.jpg',
  '/slide2.jpg',
  '/slide3.jpg'
]

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleAuthRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-x-hidden flex flex-col items-center selection:bg-indigo-500/40 selection:text-white">
      
      {/* --- INLINE CSS FOR ALL 3D, TRANSFER & ORBIT ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0px) rotateX(12deg) rotateY(-12deg); }
          50% { transform: translateY(-15px) rotateX(16deg) rotateY(-8deg); }
        }
        @keyframes scanLaser {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes spinRing {
          100% { transform: rotate(360deg); }
        }
        @keyframes counterSpin {
          100% { transform: rotate(-360deg) rotateX(-55deg); }
        }
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-scene { perspective: 1200px; }

        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes dataChevronMove {
          0% { left: 0%; opacity: 0; transform: translateX(0) scale(0.8); }
          20% { opacity: 1; transform: translateX(0) scale(1.1); filter: drop-shadow(0 0 10px #818cf8); }
          80% { opacity: 1; filter: drop-shadow(0 0 15px #818cf8); }
          100% { left: 100%; opacity: 0; transform: translateX(-100%) scale(0.8); }
        }
        @keyframes popCard {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
          50% { transform: scale(1.03); box-shadow: 0 15px 35px rgba(129,140,248,0.25); }
        }
        @keyframes popStar {
          0%, 100% { transform: scale(1); color: #f59e0b; }
          50% { transform: scale(1.3); color: #fbbf24; filter: drop-shadow(0 0 8px #f59e0b); }
        }

        @keyframes floatPhoneCenter {
          0%, 100% { transform: translateZ(20px) translateY(0px) rotateY(0deg); }
          50% { transform: translateZ(20px) translateY(-8px) rotateY(0deg); }
        }
        @keyframes floatPhoneLeft {
          0%, 100% { transform: translateX(-110px) translateZ(-30px) scale(0.85) rotateY(12deg) translateY(0px); }
          50% { transform: translateX(-110px) translateZ(-30px) scale(0.85) rotateY(12deg) translateY(-6px); }
        }
        @keyframes floatPhoneRight {
          0%, 100% { transform: translateX(110px) translateZ(-30px) scale(0.85) rotateY(-12deg) translateY(0px); }
          50% { transform: translateX(110px) translateZ(-30px) scale(0.85) rotateY(-12deg) translateY(-6px); }
        }
        @keyframes floatPhoneFarRight {
          0%, 100% { transform: translateX(200px) translateZ(-80px) scale(0.7) rotateY(-20deg) translateY(0px); }
          50% { transform: translateX(200px) translateZ(-80px) scale(0.7) rotateY(-20deg) translateY(-5px); }
        }
        @keyframes popItemLoop {
          0%, 15% { opacity: 0; transform: translateY(10px) scale(0.95); }
          25%, 75% { opacity: 1; transform: translateY(0) scale(1); }
          85%, 100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }

        @keyframes floatLaptop {
          0%, 100% { transform: translateY(0px) rotateX(4deg) rotateY(-12deg); }
          50% { transform: translateY(-12px) rotateX(8deg) rotateY(-8deg); }
        }
        @keyframes floatGraphElement {
          0%, 100% { transform: translateY(0px) translateZ(15px); opacity: 0.7; }
          50% { transform: translateY(-15px) translateZ(30px); opacity: 1; }
        }
        @keyframes barGrow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes pulseRadar {
          0% { transform: scale(0.1); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes orbitSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes counterOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}} />

      {/* --- SOFT EYE-COMFORT GRADIENT BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20"></div>
      <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full bg-indigo-600/10 blur-[180px] pointer-events-none -z-10"></div>
      <div className="absolute top-[35%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none -z-10"></div>

      {/* --- FLOATING GLASS NAVIGATION --- */}
      <nav className="w-full max-w-[1400px] flex justify-between items-center z-50 mt-6 mb-12 px-6 py-4 bg-[#131B2E]/70 border border-slate-700/60 rounded-3xl backdrop-blur-2xl shadow-xl">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
          <div className="w-3.5 h-3.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_12px_#818cf8]"></div>
          <span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-indigo-300 transition-colors">SCAN CIRCLE</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 font-mono text-[11px] font-bold tracking-[0.15em] uppercase">
          <Link href="/" className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">Home</Link>
          <Link href="/what-we-do" className="text-slate-300 hover:text-indigo-300 transition-colors duration-300">What We Do</Link>
          <Link href="/about" className="text-slate-300 hover:text-indigo-300 transition-colors duration-300">About Us</Link>
          <Link href="/contact" className="text-slate-300 hover:text-indigo-300 transition-colors duration-300">Contact</Link>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <Link href="/login" className="hidden sm:block text-slate-300 hover:text-indigo-400 transition-colors uppercase font-bold">
            Sign In
          </Link>
          <button onClick={handleAuthRedirect} className="relative group overflow-hidden rounded-xl p-[1px]">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity"></span>
            <div className="relative bg-[#131B2E] px-6 py-2.5 rounded-xl transition-all group-hover:bg-opacity-0">
               <span className="text-indigo-300 font-bold uppercase tracking-wider group-hover:text-white transition-colors">Get Started Free</span>
            </div>
          </button>
        </div>
      </nav>

      {/* --- 1. HERO SECTION WITH 3D ORBITING PHONE (STACKED CLEANLY FOR MOBILE) --- */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 z-10 px-6 mt-4 lg:mt-8 mb-28">
        <div className="w-full lg:flex-1 text-center lg:text-left relative z-20">
          <div className="inline-flex items-center gap-3 py-1.5 px-5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-[0.3em] font-bold">Smart Business QR & Review Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.2rem] font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            One Smart QR Code <br className="hidden lg:block"/>For All Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 drop-shadow-[0_0_25px_rgba(129,140,248,0.25)]">
              Social Links & Menus
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Instantly route customers from a single scanned QR code to your social media profiles, digital menus, rate cards, and Google Reviews with built-in rating prompts.
          </p>
          <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center w-full sm:w-auto overflow-hidden rounded-2xl p-[2px] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(129,140,248,0.35)]">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl"></div>
            <div className="relative inline-flex items-center justify-center w-full h-full px-8 py-4 bg-[#131B2E] rounded-[14px] transition-all duration-300">
              <span className="text-white font-mono font-bold tracking-widest uppercase text-xs md:text-sm">
                START YOUR 14-DAY FREE TRIAL →
              </span>
            </div>
          </button>
        </div>

        <div className="w-full lg:flex-1 max-w-[500px] h-[450px] lg:h-[500px] relative z-10 perspective-scene flex items-center justify-center mt-6 lg:mt-0">
          <div className="relative w-full h-full preserve-3d flex items-center justify-center scale-90 sm:scale-100">
            <div className="absolute w-[220px] h-[440px] bg-[#131B2E] border-[4px] border-slate-600 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center z-20 overflow-hidden" style={{ animation: 'floatPhone 6s ease-in-out infinite' }}>
              <div className="absolute top-2 w-16 h-4 bg-slate-700 rounded-full z-30"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-cyan-500/10 z-10"></div>
              <div className="w-36 h-36 bg-white p-3 rounded-2xl relative z-20 shadow-xl">
                <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z"/></svg>
                <div className="absolute left-0 w-full h-[2px] bg-indigo-400 shadow-[0_0_12px_#818cf8] z-30" style={{ animation: 'scanLaser 2.5s ease-in-out infinite' }}></div>
              </div>
              <div className="mt-6 text-indigo-300 font-mono text-[10px] font-bold tracking-[0.3em] uppercase z-20">SCAN TO UNLOCK</div>
            </div>
            <div className="absolute w-[460px] h-[460px] preserve-3d z-10" style={{ transform: 'rotateX(55deg)' }}>
              <div className="absolute inset-0 border border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-[-40px] border border-dashed border-blue-500/25 rounded-full animate-[spin_25s_linear_infinite]"></div>
              <div className="absolute inset-0 preserve-3d" style={{ animation: 'spinRing 18s linear infinite' }}>
                <div className="absolute top-0 left-1/2 -ml-5 -mt-5 w-10 h-10 bg-[#131B2E] border border-fuchsia-500/40 rounded-full flex items-center justify-center shadow-lg" style={{ animation: 'counterSpin 18s linear infinite' }}><svg className="w-4 h-4 text-fuchsia-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></div>
                <div className="absolute top-[85%] left-[15%] -ml-5 -mt-5 w-10 h-10 bg-[#131B2E] border border-blue-500/40 rounded-full flex items-center justify-center shadow-lg" style={{ animation: 'counterSpin 18s linear infinite' }}><svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg></div>
                <div className="absolute top-[35%] left-0 -ml-5 w-10 h-10 bg-[#131B2E] border border-blue-600/40 rounded-full flex items-center justify-center shadow-lg" style={{ animation: 'counterSpin 18s linear infinite' }}><svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                <div className="absolute top-[35%] right-0 -mr-5 w-10 h-10 bg-[#131B2E] border border-red-500/40 rounded-full flex items-center justify-center shadow-lg" style={{ animation: 'counterSpin 18s linear infinite' }}><svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 01. AUTOMATED GOOGLE REVIEWS SECTION (FIXED PADDING & LAYOUT OVERLAP) --- */}
      <section className="w-full max-w-7xl z-10 px-6 mb-20">
        <div className="p-8 sm:p-12 md:p-16 bg-[#131B2E] border border-slate-700/60 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.08)_0%,transparent_60%)] pointer-events-none"></div>

          {/* Left Text Box with Guaranteed Spacing */}
          <div className="w-full lg:flex-1 relative z-10 text-center lg:text-left pr-0 lg:pr-4">
            <p className="text-indigo-400 font-mono font-bold tracking-[0.2em] mb-3">01</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Automated <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Google Reviews</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Search your business name to automatically link your official Google Review page. Instantly route happy customers directly to your 5-star submission page before they even leave your store.
            </p>
            <div className="inline-flex items-center gap-3 py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-md">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold tracking-wide">Boost Local SEO Automatically</span>
            </div>
          </div>

          {/* Right Animation Box (Separated so it never overlaps text) */}
          <div className="w-full lg:flex-1 flex items-center justify-center relative z-10 h-[320px] sm:h-[380px]">
            <div className="flex flex-col items-center absolute left-4 sm:left-10 z-20">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1f2937] border-2 border-indigo-500/40 rounded-3xl shadow-xl flex flex-col items-center justify-center p-3">
                <span className="text-[7px] font-mono text-indigo-400 font-bold tracking-widest uppercase mb-1">• Scan Me •</span>
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z"/></svg>
              </div>
            </div>

            <div className="absolute left-28 sm:left-36 right-[140px] sm:right-[160px] h-[1px] bg-indigo-900/60 z-10 flex items-center">
              <div className="absolute text-indigo-400 flex" style={{ animation: 'dataChevronMove 2s infinite linear' }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_10px_#818cf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </div>
            </div>

            <div className="flex flex-col items-center absolute right-4 sm:right-10 z-20">
              <div className="w-[150px] sm:w-[170px] h-[300px] sm:h-[340px] bg-[#0f172a] border-[4px] border-slate-600 rounded-[2.2rem] shadow-2xl relative p-3 flex flex-col items-center overflow-hidden" style={{ animation: 'floatGentle 4s ease-in-out infinite' }}>
                <div className="absolute top-2 w-14 h-3.5 bg-slate-800 rounded-full z-30"></div>
                <p className="mt-5 text-[7px] font-mono text-indigo-300 tracking-widest uppercase text-center font-bold">Scan Circle<br/>Active Node</p>
                <div className="w-full bg-white rounded-xl p-2.5 mt-4 border border-slate-200 relative z-20 shadow-md" style={{ animation: 'popCard 3s ease-in-out infinite' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold text-[9px] leading-none">Google Reviews</h4>
                      <p className="text-gray-500 text-[7px] font-mono mt-0.5">Auto-Capture</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-1.5">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20" style={{ animation: `popStar 2s infinite ease-in-out ${i * 0.15}s` }}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full mb-1"></div>
                  <div className="h-1 w-2/3 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 02. MULTIPLE CATALOG OPTIONS (4-PHONE 3D ANIMATION) --- */}
      <section className="w-full max-w-7xl z-10 px-6 mb-20">
        <div className="p-8 sm:p-12 md:p-16 bg-[#131B2E] border border-slate-700/60 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none"></div>

          <div className="w-full lg:flex-1 h-[400px] sm:h-[450px] relative perspective-scene flex items-center justify-center z-10 overflow-visible">
            <div className="absolute w-[130px] sm:w-[150px] h-[260px] sm:h-[300px] bg-[#0f172a] border-[3px] border-slate-700 rounded-[2rem] flex flex-col px-3 py-5 z-20 shadow-2xl" style={{ animation: 'floatPhoneFarRight 5s ease-in-out infinite 1s' }}>
              <div className="w-10 h-2.5 bg-slate-800 rounded-full mx-auto mb-3"></div>
              <p className="text-[9px] text-emerald-400 font-bold mb-2 text-center uppercase tracking-wider">Fitness</p>
              <div className="space-y-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5 flex justify-between" style={{ animation: 'popItemLoop 6s infinite 0s' }}><span className="text-[7px] text-slate-300">Yoga</span><span className="text-[7px] text-emerald-400">$15</span></div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5 flex justify-between" style={{ animation: 'popItemLoop 6s infinite 0.5s' }}><span className="text-[7px] text-slate-300">Pilates</span><span className="text-[7px] text-emerald-400">$20</span></div>
              </div>
            </div>

            <div className="absolute w-[140px] sm:w-[160px] h-[280px] sm:h-[320px] bg-[#0f172a] border-[3px] border-slate-700 rounded-[2rem] flex flex-col px-3 py-5 z-30 shadow-2xl" style={{ animation: 'floatPhoneRight 5s ease-in-out infinite 0.5s' }}>
              <div className="w-10 h-2.5 bg-slate-800 rounded-full mx-auto mb-3"></div>
              <p className="text-[9px] text-fuchsia-400 font-bold mb-2 text-center uppercase tracking-wider">Salon</p>
              <div className="space-y-2">
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-1.5 flex justify-between" style={{ animation: 'popItemLoop 6s infinite 1s' }}><span className="text-[7px] text-slate-300">Haircut</span><span className="text-[7px] text-fuchsia-400">$30</span></div>
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-1.5 flex justify-between" style={{ animation: 'popItemLoop 6s infinite 1.5s' }}><span className="text-[7px] text-slate-300">Coloring</span><span className="text-[7px] text-fuchsia-400">$80</span></div>
              </div>
            </div>

            <div className="absolute w-[140px] sm:w-[160px] h-[280px] sm:h-[320px] bg-[#0f172a] border-[3px] border-slate-700 rounded-[2rem] flex flex-col px-3 py-5 z-30 shadow-2xl" style={{ animation: 'floatPhoneLeft 5s ease-in-out infinite 0.2s' }}>
              <div className="w-10 h-2.5 bg-slate-800 rounded-full mx-auto mb-3"></div>
              <p className="text-[9px] text-blue-400 font-bold mb-2 text-center uppercase tracking-wider">Retail</p>
              <div className="space-y-2">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1.5 flex justify-between" style={{ animation: 'popItemLoop 6s infinite 2s' }}><span className="text-[7px] text-slate-300">Sneakers</span><span className="text-[7px] text-blue-400">$90</span></div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1.5 flex justify-between" style={{ animation: 'popItemLoop 6s infinite 2.5s' }}><span className="text-[7px] text-slate-300">T-Shirt</span><span className="text-[7px] text-blue-400">$25</span></div>
              </div>
            </div>

            <div className="absolute w-[170px] sm:w-[190px] h-[340px] sm:h-[380px] bg-[#0f172a] border-[4px] border-slate-500 rounded-[2.5rem] flex flex-col px-4 py-6 z-40 shadow-2xl" style={{ animation: 'floatPhoneCenter 5s ease-in-out infinite 0s' }}>
              <div className="w-14 h-3.5 bg-slate-800 rounded-full mx-auto mb-4"></div>
              <p className="text-[10px] sm:text-xs text-amber-400 font-bold mb-3 text-center uppercase tracking-widest">Cafe Menu</p>
              <div className="space-y-2.5">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex justify-between items-center shadow-sm" style={{ animation: 'popItemLoop 6s infinite 3s' }}>
                  <div><p className="text-[9px] text-white font-bold">Cappuccino</p><p className="text-[6px] text-slate-400">Hot beverage</p></div>
                  <span className="text-[9px] text-amber-400 font-bold">$4.00</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex justify-between items-center shadow-sm" style={{ animation: 'popItemLoop 6s infinite 3.5s' }}>
                  <div><p className="text-[9px] text-white font-bold">Croissant</p><p className="text-[6px] text-slate-400">Fresh pastry</p></div>
                  <span className="text-[9px] text-amber-400 font-bold">$3.50</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex justify-between items-center shadow-sm" style={{ animation: 'popItemLoop 6s infinite 4s' }}>
                  <div><p className="text-[9px] text-white font-bold">Avocado Toast</p><p className="text-[6px] text-slate-400">Healthy choice</p></div>
                  <span className="text-[9px] text-amber-400 font-bold">$8.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:flex-1 relative z-10 text-center lg:text-right">
            <p className="text-indigo-400 font-mono font-bold tracking-[0.2em] mb-3">02</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Multiple <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Catalog Options</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 lg:ml-auto mb-8">
              Whether you run a bustling cafe, a premium salon, or a retail boutique, our dynamic catalog system adapts to your business. Build and showcase your offerings in a beautiful interface that updates instantly.
            </p>
            <div className="inline-flex items-center gap-3 py-2 px-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shadow-md">
               <span className="text-xs sm:text-sm font-mono text-indigo-300 font-bold tracking-wide">Dynamic & Adaptive Menus</span>
               <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 03. SMART ANALYTICS DASHBOARD --- */}
      <section className="w-full max-w-7xl z-10 px-6 mb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 mb-16">
          <div className="w-full lg:flex-1 text-center lg:text-left relative z-20">
            <p className="text-fuchsia-400 font-mono font-bold tracking-[0.2em] mb-3">03</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Smart Analytics <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-400">Dashboard</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Track every interaction. Understand your audience with crystal-clear telemetry. Monitor scan rates, unique visitors, and conversion metrics in real-time across all your physical and digital touchpoints.
            </p>
          </div>

          <div className="w-full lg:flex-1 h-[350px] sm:h-[400px] perspective-scene relative flex items-center justify-center">
            <div className="absolute w-[180px] h-[130px] bg-cyan-500/10 border border-cyan-500/30 rounded-xl backdrop-blur-md z-0 -translate-x-24 sm:-translate-x-32 -translate-y-16 flex items-end p-2 gap-1" style={{ animation: 'floatGraphElement 6s ease-in-out infinite 1s' }}>
               <div className="w-full bg-cyan-500/40 rounded-sm" style={{ height: '40%' }}></div>
               <div className="w-full bg-cyan-500/60 rounded-sm" style={{ height: '70%' }}></div>
               <div className="w-full bg-cyan-400 rounded-sm shadow-[0_0_10px_#22d3ee]" style={{ height: '100%' }}></div>
            </div>
            
            <div className="absolute w-[160px] h-[110px] bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl backdrop-blur-md z-0 translate-x-24 sm:translate-x-32 translate-y-12 flex items-center justify-center p-3" style={{ animation: 'floatGraphElement 6s ease-in-out infinite 0s' }}>
              <div className="w-16 h-16 rounded-full border-4 border-fuchsia-500/20 border-t-fuchsia-400 animate-spin"></div>
            </div>

            <div className="relative preserve-3d z-20 flex flex-col items-center scale-90 sm:scale-100" style={{ animation: 'floatLaptop 6s ease-in-out infinite' }}>
              <div className="w-[300px] sm:w-[340px] h-[200px] sm:h-[220px] bg-[#0f172a] border-[4px] border-slate-700 rounded-t-2xl rounded-b-sm flex flex-col shadow-2xl relative overflow-hidden">
                <div className="w-full h-4 bg-slate-900 border-b border-slate-800 flex items-center px-3 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex-1 p-3 grid grid-cols-3 gap-2">
                  <div className="col-span-2 bg-slate-900/50 rounded flex items-end p-1 gap-1">
                    <div className="flex-1 bg-indigo-500/50 rounded-sm h-[30%]"></div><div className="flex-1 bg-indigo-500/60 rounded-sm h-[50%]"></div><div className="flex-1 bg-indigo-500/80 rounded-sm h-[80%]"></div><div className="flex-1 bg-indigo-400 rounded-sm h-[100%] shadow-[0_0_8px_#818cf8]"></div>
                  </div>
                  <div className="bg-slate-900/50 rounded flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-cyan-500/30 border-r-cyan-400 border-b-cyan-400"></div>
                  </div>
                </div>
              </div>
              <div className="w-[360px] sm:w-[400px] h-[12px] bg-slate-700 rounded-b-xl border-t border-slate-600 shadow-2xl relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-600 rounded-b-md"></div>
              </div>
            </div>

            <div className="absolute right-6 sm:right-12 -bottom-4 w-[100px] sm:w-[110px] h-[200px] sm:h-[220px] bg-[#0f172a] border-[3px] border-slate-700 rounded-3xl z-30 shadow-2xl flex flex-col p-2" style={{ animation: 'floatGentle 5s ease-in-out infinite 0.5s' }}>
              <div className="w-8 h-2 bg-slate-800 rounded-full mx-auto mb-2"></div>
              <div className="w-full bg-slate-900/50 rounded h-8 mb-2 flex items-center justify-center"><div className="w-5 h-5 rounded-full border-2 border-fuchsia-500/30 border-t-fuchsia-400"></div></div>
              <div className="w-full bg-slate-900/50 rounded flex-1 flex flex-col justify-end p-1 gap-1">
                <div className="w-[80%] h-2 bg-blue-400 rounded-sm"></div>
                <div className="w-[60%] h-2 bg-emerald-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#131B2E] border border-slate-700/60 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden h-[420px] sm:h-[450px] shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white relative z-20">Total Scans</h3>
            <h2 className="absolute top-20 sm:top-20 left-8 sm:left-10 text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 z-20 leading-tight max-w-[250px]">
              MEASURE EVERY INTERACTION.
            </h2>
            <div className="absolute bottom-0 left-6 sm:left-10 w-44 sm:w-48 h-44 sm:h-48 bg-[#0f172a] border-t-4 border-l-4 border-r-4 border-slate-700 rounded-t-3xl z-20 p-4 sm:p-5 flex flex-col shadow-2xl">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1">Total Volume</p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-white mb-3">12.4K</p>
              <div className="w-full flex-1 flex items-end gap-1.5">
                <div className="w-full bg-indigo-500/20 rounded-t-sm h-[30%]"></div>
                <div className="w-full bg-indigo-500/40 rounded-t-sm h-[50%]"></div>
                <div className="w-full bg-indigo-500/60 rounded-t-sm h-[80%]"></div>
                <div className="w-full bg-indigo-400 rounded-t-sm h-[100%] shadow-[0_0_10px_#818cf8]"></div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-72 sm:w-80 h-[120%] z-10 opacity-40 mix-blend-screen pointer-events-none" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 10%, black 70%)', maskImage: 'linear-gradient(to top, transparent 10%, black 70%)' }}>
               <img src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=600&auto=format&fit=crop" alt="Analytics Hologram" className="w-full h-full object-cover filter contrast-125 sepia hue-rotate-[180deg] saturate-[2]" />
            </div>
          </div>

          <div className="bg-[#131B2E] border border-slate-700/60 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 sm:mb-8">Popular Social Link Clicks</h3>
            <div className="bg-[#0f172a] border border-slate-700/60 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-1">Total Scans Today</p>
                <p className="text-3xl sm:text-4xl font-mono font-bold text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">8,492</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin"></div>
            </div>
            <div className="flex-1 space-y-4 sm:space-y-5">
              {[
                { name: 'Instagram', icon: 'bg-fuchsia-500', width: '85%', count: '7.2K', color: 'from-fuchsia-500 to-pink-500', shadow: 'shadow-fuchsia-500/50' },
                { name: 'Facebook', icon: 'bg-blue-500', width: '65%', count: '5.5K', color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/50' },
                { name: 'WhatsApp', icon: 'bg-emerald-500', width: '45%', count: '3.8K', color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/50' },
                { name: 'YouTube', icon: 'bg-red-500', width: '25%', count: '2.1K', color: 'from-red-500 to-orange-500', shadow: 'shadow-red-500/50' }
              ].map((social, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${social.icon} flex items-center justify-center flex-shrink-0 shadow-lg`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1"><span className="text-xs font-bold text-white">{social.name}</span><span className="text-xs font-mono text-slate-400">{social.count}</span></div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${social.color} rounded-full origin-left relative`} style={{ width: social.width, animation: 'barGrow 1.5s ease-out forwards', animationDelay: `${i * 0.2}s` }}>
                         <div className={`absolute right-0 top-0 w-4 h-full bg-white/50 blur-[2px] ${social.shadow}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 04. ONE QR FOR SOCIAL HANDLES (SYMMETRICAL ORBIT SECTION) --- */}
      <section className="w-full max-w-7xl z-10 px-6 mb-28">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-purple-400 font-mono font-bold tracking-[0.2em] mb-3">04</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            One QR for <br className="md:hidden"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">Social Handles</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Stop forcing your customers to juggle multiple links. Put a single QR code on your tables, and give them instant access to your Instagram, WhatsApp, Facebook, YouTube, and more in one sleek mobile menu.
          </p>
        </div>

        <div className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] flex items-center justify-center bg-[#131B2E] border border-slate-700/60 rounded-[3rem] shadow-2xl overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] border border-fuchsia-500/20 rounded-full absolute" style={{ animation: 'pulseRadar 4s linear infinite 0s' }}></div>
            <div className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] border border-fuchsia-500/20 rounded-full absolute" style={{ animation: 'pulseRadar 4s linear infinite 1.3s' }}></div>
            <div className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] border border-fuchsia-500/20 rounded-full absolute" style={{ animation: 'pulseRadar 4s linear infinite 2.6s' }}></div>
          </div>

          <div className="absolute z-30 w-[130px] sm:w-[150px] h-[260px] sm:h-[300px] bg-[#0f172a] border-[3px] border-slate-700 rounded-3xl shadow-2xl flex flex-col items-center px-3 py-5" style={{ animation: 'floatGentle 4s ease-in-out infinite' }}>
            <div className="w-8 h-2 bg-slate-800 rounded-full mb-3"></div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 mb-2 flex items-center justify-center shadow-lg">
               <span className="text-fuchsia-400 text-xs font-bold font-mono">SC</span>
            </div>
            <div className="w-14 sm:w-16 h-1 bg-slate-700 rounded-full mb-4"></div>
            <div className="w-full space-y-2">
              <div className="w-full h-5 sm:h-6 bg-blue-500/20 border border-blue-500/40 rounded-lg"></div>
              <div className="w-full h-5 sm:h-6 bg-emerald-500/20 border border-emerald-500/40 rounded-lg"></div>
              <div className="w-full h-5 sm:h-6 bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-lg"></div>
              <div className="w-full h-5 sm:h-6 bg-red-500/20 border border-red-500/40 rounded-lg"></div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full" style={{ animation: 'orbitSpin 35s linear infinite' }}>
              
              <div className="absolute -top-6 left-1/2 -ml-6 flex flex-col items-center" style={{ animation: 'counterOrbit 35s linear infinite' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1f2937] border border-fuchsia-500/50 rounded-2xl flex items-center justify-center shadow-2xl">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
              </div>

              <div className="absolute top-[18%] right-[2%] -mt-5 -mr-5 flex flex-col items-center" style={{ animation: 'counterOrbit 35s linear infinite' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1f2937] border border-blue-500/50 rounded-2xl flex items-center justify-center shadow-2xl">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
              </div>

              <div className="absolute bottom-[18%] right-[2%] -mb-5 -mr-5 flex flex-col items-center" style={{ animation: 'counterOrbit 35s linear infinite' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1f2937] border border-emerald-500/50 rounded-2xl flex items-center justify-center shadow-2xl">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
              </div>

              <div className="absolute -bottom-6 left-1/2 -ml-6 flex flex-col items-center" style={{ animation: 'counterOrbit 35s linear infinite' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1f2937] border border-red-500/50 rounded-2xl flex items-center justify-center shadow-2xl">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg>
                </div>
              </div>

              <div className="absolute bottom-[18%] left-[2%] -mb-5 -ml-5 flex flex-col items-center" style={{ animation: 'counterOrbit 35s linear infinite' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1f2937] border border-slate-500/50 rounded-2xl flex items-center justify-center shadow-2xl">
                   <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </div>
              </div>

              <div className="absolute top-[18%] left-[2%] -mt-5 -ml-5 flex flex-col items-center" style={{ animation: 'counterOrbit 35s linear infinite' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1f2937] border border-cyan-500/50 rounded-2xl flex items-center justify-center shadow-2xl">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURE GRID (NEON GLASS CARDS) --- */}
      <div className="w-full max-w-6xl z-10 px-6 mb-24 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="relative h-full bg-[#131B2E] p-8 rounded-[2rem] border border-slate-700/60 shadow-xl group-hover:border-indigo-500/40 transition-all duration-500 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-6 font-mono border border-indigo-500/20 shadow-lg">01</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Automated Reviews</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">Search your business name to automatically link your official Google Review page and capture more feedback.</p>
              </div>
            </div>
          </div>
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="relative h-full bg-[#131B2E] p-8 rounded-[2rem] border border-slate-700/60 shadow-xl group-hover:border-blue-500/40 transition-all duration-500 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-6 font-mono border border-blue-500/20 shadow-lg">02</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Dynamic Menus</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">Easily build and organize food menus or service rate lists by categories so customers can check prices instantly.</p>
              </div>
            </div>
          </div>
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="relative h-full bg-[#131B2E] p-8 rounded-[2rem] border border-slate-700/60 shadow-xl group-hover:border-fuchsia-500/40 transition-all duration-500 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center font-bold mb-6 font-mono border border-fuchsia-500/20 shadow-lg">03</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Unified Hub</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">Unify your digital footprint. Route customers to Instagram, WhatsApp, Facebook, and Twitter through a single code.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS PROTOCOL --- */}
      <div className="w-full max-w-6xl z-10 px-6 mb-24">
        <div className="p-12 bg-[#131B2E] border border-slate-700/60 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <h2 className="text-sm md:text-base font-mono font-bold text-indigo-400 uppercase tracking-[0.3em] text-center mb-12">Deployment Protocol // How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Add your business.', 'Add your social/review links.', 'Generate your QR.', 'Customers scan and engage.'].map((step, i) => (
              <div key={i} className="relative p-6 bg-[#0f172a] border border-slate-700/60 rounded-2xl flex flex-col items-center text-center shadow-md">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold mb-4 border border-indigo-500/30">
                  {i + 1}
                </div>
                <h4 className="text-white font-bold tracking-wide">{step}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CORE BENEFITS & FUTURE CHANNELS --- */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10 px-6 mb-32">
        <div className="p-10 bg-[#131B2E] border border-slate-700/60 rounded-[2rem] shadow-xl">
          <h2 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8">System Advantages // Benefits</h2>
          <ul className="space-y-4">
            {['Increase social followers', 'Make Google review access easier', 'Eliminate manual searching', 'Track QR engagement', 'One QR for multiple platforms', 'Mobile-first customer experience'].map((benefit, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-300 font-light">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-10 bg-[#131B2E] border border-slate-700/60 rounded-[2rem] shadow-xl flex flex-col justify-center">
          <h2 className="text-sm font-mono font-bold text-fuchsia-400 uppercase tracking-[0.2em] mb-8">Upcoming Modules // Future Channels</h2>
          <div className="flex flex-wrap gap-3">
            {['WhatsApp', 'LinkedIn', 'TikTok', 'Website', 'Menu', 'Booking', 'Contact', 'Directions', 'Custom Link'].map((channel, i) => (
              <span key={i} className="px-4 py-2 bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 rounded-lg text-sm font-mono tracking-wider">
                {channel}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- ENTERPRISE SITEMAP FOOTER --- */}
      <footer className="w-full relative z-10 bg-[#070b14] border-t border-slate-800 pt-20 pb-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
              <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_15px_#818cf8]"></div>
              <span className="text-lg font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-indigo-300 transition-colors">SCAN CIRCLE</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-mono pr-4">
              Empowering modern businesses with decentralized quantum-level QR routing, unified catalog networks, and automated feedback loops.
            </p>
          </div>
          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Platform</h4>
            <ul className="space-y-4 font-mono text-xs">
              <li><Link href="/what-we-do" className="text-slate-400 hover:text-indigo-400 transition-colors">What We Do</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Legal & Support</h4>
            <ul className="space-y-4 font-mono text-xs">
              <li><Link href="/privacy-policy" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Headquarters</h4>
            <ul className="space-y-4 font-mono text-xs text-slate-300">
              <li className="flex items-center gap-2"><span className="text-indigo-400">Office:</span> Kolkata, West Bengal</li>
              <li className="flex items-center gap-2"><span className="text-indigo-400">Mail:</span> getashish26@gmail.com</li>
              <li className="flex items-center gap-2"><span className="text-indigo-400">Sys:</span> Online / Operational</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Scan Circle. All systems nominal.</p>
          <div className="flex gap-4">
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">LinkedIn</span>
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">GitHub</span>
          </div>
        </div>
      </footer>
    </main>
  )
}