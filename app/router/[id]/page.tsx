'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface PageProps {
  params: Promise<{ id: string }>
}

interface LinkItem {
  id: number
  title: string
  value: string
  type: string
  enabled: boolean
}

export default function RouterProfilePage({ params }: PageProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('Scan Circle Business')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)

  // Interactive Review States
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const resolvedParams = await params
      setUserId(resolvedParams.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (profile) {
        if (profile.business_name) setBusinessName(profile.business_name)
        if (profile.business_type) setBusinessType(profile.business_type)
        if (profile.google_review_url) setGoogleReviewUrl(profile.google_review_url)
        if (profile.links) setLinks(profile.links)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [params])

  const getDestinationUrl = (title: string, value: string) => {
    if (!value) return '#'
    const t = title.toLowerCase()
    const cleanVal = value.trim()

    if (t.includes('instagram')) {
      const handle = cleanVal.startsWith('@') ? cleanVal.slice(1) : cleanVal
      return `https://instagram.com/${handle}`
    }
    if (t.includes('whatsapp')) {
      const phone = cleanVal.replace(/[^0-9]/g, '')
      return `https://wa.me/${phone}`
    }
    if (t.includes('twitter') || t.includes('x')) {
      const handle = cleanVal.startsWith('@') ? cleanVal.slice(1) : cleanVal
      return `https://twitter.com/${handle}`
    }
    return cleanVal.startsWith('http') ? cleanVal : `https://${cleanVal}`
  }

  const getPlatformStyle = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('instagram')) return { color: 'from-fuchsia-500 to-pink-500', hover: 'group-hover:text-pink-400' }
    if (t.includes('whatsapp')) return { color: 'from-emerald-400 to-emerald-600', hover: 'group-hover:text-emerald-400' }
    if (t.includes('youtube')) return { color: 'from-red-500 to-red-700', hover: 'group-hover:text-red-500' }
    if (t.includes('facebook')) return { color: 'from-blue-500 to-blue-700', hover: 'group-hover:text-blue-500' }
    return { color: 'from-cyan-500 to-indigo-600', hover: 'group-hover:text-cyan-400' }
  }

  // Generate Smart Review Prompts based on Business Type & Rating
  const getReviewPrompts = () => {
    if (!selectedRating) return []
    const type = businessType.toLowerCase()

    if (selectedRating >= 4) {
      if (type.includes('cafe') || type.includes('restaurant')) {
        return [
          "Amazing food quality and incredible ambiance! Will definitely visit again.",
          "Outstanding service and delicious items. Highly recommended for families and friends!",
          "Great coffee, great food, and a very warm atmosphere. Five stars!"
        ]
      } else if (type.includes('salon') || type.includes('spa')) {
        return [
          "Absolute best service! The staff is extremely professional and polite.",
          "Loved my styling experience here. Very relaxing and clean environment!",
          "Exceeded my expectations! Will be coming back regularly."
        ]
      } else {
        return [
          "Exceptional service and seamless experience. Highly recommended!",
          "Very professional staff and top-tier quality. Five stars all around!",
          "Quick, efficient, and extremely friendly team. Loved it!"
        ]
      }
    } else {
      return [
        "The experience could have been improved regarding waiting times.",
        "A bit more attention to detail would make this a 5-star experience."
      ]
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPrompt(text)
    setTimeout(() => setCopiedPrompt(null), 3000)
  }

  const activeLinks = links.filter(l => l.enabled && l.value.trim() !== '')

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05050a] text-gray-400 flex items-center justify-center font-mono text-sm">
        ESTABLISHING SECURE HANDSHAKE...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center py-16 px-6">
      
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none -z-10"></div>

      {/* Profile Header */}
      <div className="w-full max-w-md flex flex-col items-center mb-8 z-10">
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 mb-4 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center border-2 border-[#05050a] px-2 text-center">
            <span className="text-xs font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase leading-tight">
              Scan Circle
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1 text-center">{businessName}</h1>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">{businessType}</p>
      </div>

      {/* Interactive Google Review Widget */}
      {googleReviewUrl && (
        <div className="w-full max-w-md mb-8 p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl z-10 shadow-xl text-center">
          <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider font-mono">Rate Your Experience</h3>
          <p className="text-xs text-gray-400 mb-4">Tap a star rating to generate instant review templates.</p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                className={`text-3xl transition-transform hover:scale-125 focus:outline-none ${selectedRating && selectedRating >= star ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-gray-600'}`}
              >
                ★
              </button>
            ))}
          </div>

          {selectedRating && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {selectedRating >= 4 ? (
                <div>
                  <p className="text-xs font-mono text-cyan-400 mb-2 uppercase">Suggested Review Templates (Tap to Copy):</p>
                  <div className="space-y-2">
                    {getReviewPrompts().map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => copyToClipboard(prompt)}
                        className="w-full text-left p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-300 hover:border-cyan-500/50 transition-all"
                      >
                        {prompt} {copiedPrompt === prompt && <span className="float-right text-emerald-400 font-mono">COPIED!</span>}
                      </button>
                    ))}
                  </div>
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl block shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:opacity-90 transition-all"
                  >
                    Proceed to Google Reviews ↗
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                  <p className="text-xs text-gray-300 mb-2">We are sorry your experience wasn't 5-star. Please share your private feedback with management:</p>
                  <input 
                    type="text" 
                    placeholder="Type your feedback here..." 
                    className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-gray-200 mb-2 focus:outline-none focus:border-cyan-500"
                  />
                  <button onClick={() => alert('Feedback submitted privately. Thank you!')} className="w-full py-2 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-all">
                    Submit Private Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Links Container */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10">
        {activeLinks.length > 0 ? (
          activeLinks.map((link) => {
            const style = getPlatformStyle(link.title)
            const destinationUrl = getDestinationUrl(link.title, link.value)

            return (
              <a
                key={link.id}
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full p-3 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl flex items-center justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-gray-400 transition-all duration-300 group-hover:scale-110 ${style.hover}`}>
                    <span className="text-xs font-mono font-bold uppercase">{link.title.slice(0, 2)}</span>
                  </div>
                  <span className="font-semibold text-gray-300 group-hover:text-white transition-colors tracking-wide">
                    {link.title}
                  </span>
                </div>

                <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-all group-hover:translate-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            )
          })
        ) : null}
      </div>

      {/* Powered By Footer */}
      <div className="mt-auto pt-16 z-10">
        <Link href="/" className="inline-flex items-center gap-2 py-2 px-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Powered by Scan Circle</span>
        </Link>
      </div>

    </main>
  )
}