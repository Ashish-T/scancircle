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
    <main className="min-h-screen bg-[#020205] text-gray-200 relative overflow-x-hidden flex flex-col items-center selection:bg-cyan-500/40 selection:text-white">
      
      {/* --- ADVANCED CYBERPUNK BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20 opacity-30"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* --- FLOATING GLASS NAVIGATION --- */}
      <nav className="w-full max-w-[1400px] flex justify-between items-center z-50 mt-8 mb-12 px-6 py-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
          <span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-cyan-300 transition-colors">SCAN CIRCLE</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 font-mono text-[11px] font-bold tracking-[0.15em] uppercase">
          <Link href="/" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Home</Link>
          <Link href="/what-we-do" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">What We Do</Link>
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

      {/* --- HERO SECTION --- */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-16 z-10 px-6 mt-4 lg:mt-8 mb-24">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left relative z-20">
          <div className="inline-flex items-center gap-3 py-1.5 px-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 rounded-full mb-8 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping"></span>
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-[0.3em] font-bold">Smart Business QR & Review Hub</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]">
            One Smart QR <br className="hidden lg:block"/>Code For All Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 animate-gradient-x drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              Social Links & Menus
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed font-light tracking-wide">
            Instantly route customers from a single scanned QR code to your social media profiles, digital menus, rate cards, and Google Reviews with built-in rating prompts.
          </p>

          <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center w-full sm:w-auto overflow-hidden rounded-2xl p-1 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <div className="absolute w-[200%] h-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
            <div className="relative inline-flex items-center justify-center w-full h-full px-8 py-4 bg-[#0a0a12] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 rounded-xl transition-all duration-300">
              <span className="text-white font-mono font-bold tracking-widest uppercase text-xs md:text-sm">
                Start Your 14-Day Free Trial →
              </span>
            </div>
          </button>
        </div>

        {/* Right Holographic Slideshow */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative aspect-video z-10 group perspective-[1000px]">
          <div className="w-full h-full relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)] bg-[#030307] transition-all duration-700 transform group-hover:-translate-y-4 group-hover:shadow-[0_20px_80px_rgba(34,211,238,0.3)] group-hover:border-cyan-400/60">
            {SLIDES.map((slide, idx) => (
              <img 
                key={idx}
                src={slide}
                alt={`Scan Circle Slide ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-overlay z-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030307_120%)] pointer-events-none z-30"></div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
              {SLIDES.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-cyan-400 w-8 shadow-[0_0_10px_#22d3ee]' : 'bg-white/20 w-2 hover:bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURE GRID (NEON GLASS CARDS) --- */}
      <div className="w-full max-w-6xl z-10 px-6 mb-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12"><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono tracking-tight">SYSTEM CAPABILITIES</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-cyan-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold mb-6 font-mono border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                01
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Automated Google Reviews</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Search your business name to automatically link your official Google Review page and seamlessly capture more 5-star customer feedback.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-indigo-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-6 font-mono border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                02
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Multiple Catalog Options</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Easily build and organize food menus or service rate lists by categories so customers can check your catalog variations instantly.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-6 font-mono border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                03
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Smart Analytics Dashboard</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Track total scans, popular social link clicks, review conversions, and monitor repeat customer scans occurring after 24 hours.</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#07070e] p-8 rounded-[2rem] border border-white/5 group-hover:border-fuchsia-500/30 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 left-8 w-20 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center font-bold mb-6 font-mono border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)] group-hover:scale-110 group-hover:bg-fuchsia-500/20 transition-all duration-300">
                04
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">One QR for Social Handles</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">Unify your entire digital footprint. Route customers to Instagram, WhatsApp, Facebook, and Twitter through a single, beautifully branded QR code.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- HOW IT WORKS PROTOCOL --- */}
      <div className="w-full max-w-6xl z-10 px-6 mb-24">
        <div className="p-12 bg-gradient-to-b from-[#0a0a12] to-[#030307] border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40"></div>
          
          <h2 className="text-sm md:text-base font-mono font-bold text-indigo-400 uppercase tracking-[0.3em] text-center mb-12">Deployment Protocol // How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Add your business.', 'Add your social/review links.', 'Generate your QR.', 'Customers scan and engage.'].map((step, i) => (
              <div key={i} className="relative p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors group">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold mb-4 border border-indigo-500/30 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-shadow">
                  {i + 1}
                </div>
                <h4 className="text-white font-bold tracking-wide">{step}</h4>
                {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-indigo-500/30"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CORE BENEFITS & FUTURE CHANNELS --- */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10 px-6 mb-32">
        
        {/* Benefits Matrix */}
        <div className="p-10 bg-[#07070e] border border-white/5 rounded-[2rem] hover:border-cyan-500/20 transition-all">
          <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-[0.2em] mb-8">System Advantages // Benefits</h2>
          <ul className="space-y-4">
            {['Increase social followers', 'Make Google review access easier', 'Eliminate manual searching', 'Track QR engagement', 'One QR for multiple platforms', 'Mobile-first customer experience'].map((benefit, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-300 font-light">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Future Integrations */}
        <div className="p-10 bg-[#07070e] border border-white/5 rounded-[2rem] hover:border-fuchsia-500/20 transition-all flex flex-col justify-center">
          <h2 className="text-sm font-mono font-bold text-fuchsia-400 uppercase tracking-[0.2em] mb-8">Upcoming Modules // Future Channels</h2>
          <div className="flex flex-wrap gap-3">
            {['WhatsApp', 'LinkedIn', 'TikTok', 'Website', 'Menu', 'Booking', 'Contact', 'Directions', 'Custom Link'].map((channel, i) => (
              <span key={i} className="px-4 py-2 bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 rounded-lg text-sm font-mono tracking-wider hover:bg-fuchsia-500/20 transition-colors cursor-default">
                {channel}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* --- ENTERPRISE SITEMAP FOOTER --- */}
      <footer className="w-full relative z-10 bg-gradient-to-b from-[#07070e] to-[#020205] border-t border-cyan-500/20 pt-20 pb-10 overflow-hidden">
        {/* Footer Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
              <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
              <span className="text-lg font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-cyan-300 transition-colors">SCAN CIRCLE</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed font-mono pr-4">
              Empowering modern businesses with decentralized quantum-level QR routing, unified catalog networks, and automated feedback loops.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Platform</h4>
            <ul className="space-y-4 font-mono text-xs">
              <li><Link href="/what-we-do" className="text-gray-400 hover:text-cyan-400 transition-colors">What We Do</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div>
            <h4 className="text-white font-mono font-bold tracking-widest uppercase mb-6 text-xs">Legal & Support</h4>
            <ul className="space-y-4 font-mono text-xs">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
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

        {/* Copyright */}
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