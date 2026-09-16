'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AboutPage() {
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
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* --- FLOATING GLASS NAVIGATION --- */}
      <nav className="w-full max-w-[1400px] flex justify-between items-center z-50 mt-8 mb-16 px-6 py-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
          <span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase group-hover:text-cyan-300 transition-colors">SCAN CIRCLE</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 font-mono text-[11px] font-bold tracking-[0.15em] uppercase">
          <Link href="/" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">Home</Link>
          <Link href="/what-we-do" className="text-gray-400 hover:text-cyan-300 transition-colors duration-300">What We Do</Link>
          <Link href="/about" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">About Us</Link>
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
            Followers & Reviews
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop losing physical foot traffic to the digital void. Scan Circle helps businesses convert in-store customers into lifelong digital engagement using a single, unified QR code.
        </p>
        <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-1 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
          <div className="absolute w-[200%] h-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
          <div className="relative inline-flex items-center justify-center w-full h-full px-10 py-5 bg-[#0a0a12] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 rounded-xl transition-all duration-300">
            <span className="text-white font-mono font-bold tracking-widest uppercase text-sm">
              Start Free 14-Day Trial →
            </span>
          </div>
        </button>
      </section>

      {/* --- 2 & 3. PROBLEM VS SOLUTION --- */}
      <section className="w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 mb-32">
        {/* The Problem */}
        <div className="p-10 bg-gradient-to-br from-[#1a0b0f] to-[#070204] border border-rose-500/20 rounded-[2rem] shadow-[0_0_30px_rgba(225,29,72,0.05)]">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/30">
            <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">The Friction</h3>
          <ul className="space-y-4 text-gray-400 font-light">
            <li className="flex items-start gap-3"><span className="text-rose-400 mt-1">✕</span> Businesses lose customers the moment they walk out the door.</li>
            <li className="flex items-start gap-3"><span className="text-rose-400 mt-1">✕</span> Asking customers to manually search for your Instagram or Google page creates friction.</li>
            <li className="flex items-start gap-3"><span className="text-rose-400 mt-1">✕</span> Friction leads to drop-offs, resulting in lost followers and missing 5-star reviews.</li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="p-10 bg-gradient-to-br from-[#041216] to-[#01080a] border border-cyan-500/20 rounded-[2rem] shadow-[0_0_30px_rgba(34,211,238,0.05)]">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/30">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">The Gateway</h3>
          <ul className="space-y-4 text-gray-400 font-light">
            <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span> One unified QR code connects your entire digital ecosystem.</li>
            <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span> No searching required. Just point, scan, and click.</li>
            <li className="flex items-start gap-3"><span className="text-cyan-400 mt-1">✓</span> Instant redirection to specific social platforms, menus, and automated review prompts.</li>
          </ul>
        </div>
      </section>

      {/* --- 4. HOW IT WORKS (VISUAL FLOW) --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32">
        <div className="p-12 bg-[#07070e] border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <h2 className="text-sm md:text-base font-mono font-bold text-indigo-400 uppercase tracking-[0.3em] text-center mb-16">Deployment Protocol // How It Works</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center w-48">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h4 className="text-white font-bold mb-1">Add Business</h4>
              <p className="text-xs text-gray-500">Create your node.</p>
            </div>

            <div className="hidden md:block w-16 h-[1px] bg-indigo-500/30"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center w-48">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <h4 className="text-white font-bold mb-1">Link Assets</h4>
              <p className="text-xs text-gray-500">Add social & review URLs.</p>
            </div>

            <div className="hidden md:block w-16 h-[1px] bg-indigo-500/30"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center w-48">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
              </div>
              <h4 className="text-white font-bold mb-1">Generate QR</h4>
              <p className="text-xs text-gray-500">Deploy physical hardware.</p>
            </div>

            <div className="hidden md:block w-16 h-[1px] bg-indigo-500/30"></div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center w-48">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-indigo-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
              </div>
              <h4 className="text-white font-bold mb-1">Customers Scan</h4>
              <p className="text-xs text-gray-500">Watch engagement grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. FEATURES & DIFFERENTIATION --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Features */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-white mb-8">System Capabilities</h2>
          {[
            { title: 'Smart QR Generation', desc: 'Beautifully branded circular QR codes that never expire.' },
            { title: 'Social Media Routing', desc: 'Connect Instagram, WhatsApp, X, and YouTube in one tap.' },
            { title: 'Automated Review Collection', desc: 'Direct routing to Google Reviews with 5-star nudges.' },
            { title: 'Analytics Tracking', desc: 'Monitor scan rates and conversion metrics in real-time.' }
          ].map((f, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors flex items-center gap-6">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">{f.title}</h4>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Why Us? */}
        <div className="p-10 bg-gradient-to-br from-[#041216] to-[#070204] border border-cyan-500/20 rounded-[2rem] shadow-[0_0_40px_rgba(34,211,238,0.05)] h-full flex flex-col">
          <h2 className="text-xl font-mono font-bold text-cyan-400 uppercase tracking-widest mb-8">Why Scan Circle?</h2>
          <div className="space-y-6 flex-1">
            {[
              'Mobile-first customer experience',
              'No app required for users to scan',
              'Faster customer conversion rates',
              'Instant, simple setup under 5 minutes',
              'One QR replaces multiple tabletop signs'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-200 text-lg font-light">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                  <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                {benefit}
              </div>
            ))}
          </div>
          
          {/* Metrics */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-extrabold text-white font-mono">10x</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Faster Engagement</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white font-mono">0</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Friction Left</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 7 & 9. FOUNDER STORY & LIVE DEMO --- */}
      <section className="w-full max-w-6xl z-10 px-6 mb-32 grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Founder Story */}
        <div className="lg:col-span-3 p-10 md:p-14 bg-[#07070e] border border-white/5 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px]"></div>
          <h2 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Origin Story</h2>
          <h3 className="text-3xl font-bold text-white mb-6 leading-tight">Built to solve real-world friction.</h3>
          <p className="text-gray-400 leading-relaxed font-light text-lg space-y-4">
            <span className="block mb-4">Based in Kolkata, we noticed a recurring problem: local cafes, salons, and stores had incredibly loyal physical customers, but completely invisible digital footprints.</span>
            <span className="block">The friction of telling a customer to "search for us on Instagram" or "leave a review on Google" was just too high. People get distracted. We built Scan Circle to eliminate that gap. No apps, no typing, no searching—just one scan to connect physical reality to digital growth.</span>
          </p>
        </div>

        {/* Live Demo Node */}
        <div className="lg:col-span-2 p-10 bg-gradient-to-br from-[#0a0a12] to-cyan-900/10 border border-cyan-500/30 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(34,211,238,0.1)] relative group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030307_120%)] pointer-events-none rounded-[2.5rem]"></div>
          
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-[0.2em] mb-8 relative z-10">Live System Demo</h3>
          
          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)] relative z-10 mb-6 group-hover:scale-105 transition-transform duration-500">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://scancircle.onrender.com" alt="Scan Circle Demo QR" className="w-full h-full object-contain" />
          </div>
          
          <p className="text-gray-300 font-light relative z-10">Scan this code with your camera to experience the Scan Circle mobile interface.</p>
        </div>
      </section>

      {/* --- 10. FINAL CTA --- */}
      <section className="w-full max-w-4xl text-center z-10 px-6 mb-32">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to turn every customer into an online follower?</h2>
        <button onClick={handleAuthRedirect} className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-1 transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]">
          <div className="absolute w-[200%] h-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,#22d3ee_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
          <div className="relative inline-flex items-center justify-center w-full h-full px-12 py-5 bg-[#0a0a12] group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 rounded-xl transition-all duration-300">
            <span className="text-white font-mono font-bold tracking-widest uppercase text-sm">
              👉 Start Your 14-Day Free Trial
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
              <li><Link href="/what-we-do" className="text-gray-400 hover:text-cyan-400 transition-colors">What We Do</Link></li>
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