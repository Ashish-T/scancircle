'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Slideshow images (Place these in your /public folder)
const SLIDES = [
  '/slide1.jpg',
  '/slide2.jpg',
  '/slide3.jpg',
  '/slide4.jpg'
]

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-play slideshow
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
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center py-8 px-6 selection:bg-cyan-500/30">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 blur-[150px] pointer-events-none -z-10"></div>

      <nav className="w-full max-w-6xl flex justify-between items-center z-20 mb-8">
        <button onClick={handleAuthRedirect} className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-sm font-bold tracking-wider text-white font-mono uppercase">Scan Circle</span>
        </button>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold text-gray-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <button onClick={handleAuthRedirect} className="py-2 px-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold rounded-xl transition-all">
            Get Started Free
          </button>
        </div>
      </nav>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 z-10 mt-4 lg:mt-12">
        
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest">Smart Business QR & Review Hub</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            One Smart QR Code For All Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Social Links & Menus</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            Instantly route customers from a single scanned QR code to your social media profiles, digital menus, rate cards, and Google Reviews with built-in rating prompts.
          </p>

          <button onClick={handleAuthRedirect} className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] cursor-pointer">
            Create Your Business QR Now →
          </button>
        </div>

        {/* Slideshow: strict aspect-video & object-contain prevents cutting sides */}
        <div className="flex-1 w-full relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0f]">
          {SLIDES.map((slide, idx) => (
            <img 
              key={idx}
              src={slide}
              alt={`Scan Circle Slide ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#05050a]/40 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {SLIDES.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-cyan-400 w-6' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 my-20 z-10">
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold mb-4 font-mono">01</div>
          <h3 className="text-lg font-semibold text-white mb-2">Google Places Sync</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Search your business name to automatically link your official Google Review page and capture more 5-star customer feedback.</p>
        </div>

        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4 font-mono">02</div>
          <h3 className="text-lg font-semibold text-white mb-2">Dynamic Menus</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Easily build and organize food menus or service rate lists by categories so customers can check prices instantly.</p>
        </div>

        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4 font-mono">03</div>
          <h3 className="text-lg font-semibold text-white mb-2">Smart Analytics</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Track total scans, popular social link clicks, review conversions, and repeat customer scans occurring after 24 hours.</p>
        </div>
      </div>

      <footer className="w-full max-w-6xl text-center py-6 border-t border-white/5 z-10 text-xs text-gray-500 font-mono">
        © {new Date().getFullYear()} Scan Circle. All rights reserved.
      </footer>
    </main>
  )
}