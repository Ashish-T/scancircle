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

interface MenuItem {
  name: string
  price: string
  description?: string
  category: string
}

export default function RouterProfilePage({ params }: PageProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('Scan Circle Business')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [links, setLinks] = useState<LinkItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const logEvent = async (eventType: string, targetBusinessId: string) => {
    try {
      const ua = navigator.userAgent
      let device = 'Desktop'
      if (/mobi/i.test(ua)) device = 'Mobile'
      if (/tablet|ipad/i.test(ua)) device = 'Tablet'

      let browser = 'Unknown'
      if (/chrome|crios/i.test(ua)) browser = 'Chrome'
      else if (/safari/i.test(ua)) browser = 'Safari'
      else if (/firefox/i.test(ua)) browser = 'Firefox'

      const lastScanKey = `sc_last_scan_${targetBusinessId}`
      const lastScanTime = localStorage.getItem(lastScanKey)
      const now = Date.now()
      let finalEventType = eventType

      if (eventType === 'qr_scanned') {
        if (lastScanTime) {
          const hoursElapsed = (now - Number(lastScanTime)) / (1000 * 60 * 60)
          if (hoursElapsed >= 24) {
            finalEventType = 'repeat_qr_scanned'
          }
        }
        localStorage.setItem(lastScanKey, now.toString())
      }

      await supabase.from('analytics_events').insert({
        business_id: targetBusinessId,
        event_type: finalEventType,
        device_type: device,
        browser: browser,
        country: 'IN',
        referrer: document.referrer || 'Direct QR Scan'
      })
    } catch (err) {
      console.error('Analytics tracking error:', err)
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      const resolvedParams = await params
      const id = resolvedParams.id
      setUserId(id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (profile) {
        if (profile.business_name) setBusinessName(profile.business_name)
        if (profile.business_type) setBusinessType(profile.business_type)
        if (profile.google_review_url) setGoogleReviewUrl(profile.google_review_url)
        if (profile.links) setLinks(profile.links)
        if (profile.business_menu) setMenuItems(profile.business_menu)
      }
      setLoading(false)

      logEvent('qr_scanned', id)
    }
    fetchProfile()
  }, [params])

  const handleOptionClick = (title: string) => {
    if (!userId) return
    const t = title.toLowerCase()
    if (t.includes('instagram')) logEvent('instagram_clicked', userId)
    else if (t.includes('youtube')) logEvent('youtube_clicked', userId)
    else if (t.includes('facebook')) logEvent('facebook_clicked', userId)
    else if (t.includes('whatsapp')) logEvent('whatsapp_clicked', userId)
    else logEvent('option_clicked', userId)
  }

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

  const getReviewPrompts = () => {
    if (!selectedRating) return []
    const type = businessType.toLowerCase()

    if (selectedRating >= 4) {
      if (type.includes('cafe') || type.includes('restaurant')) {
        return [
          "Amazing food quality and incredible ambiance! Will definitely visit again.",
          "Outstanding service and delicious items. Highly recommended!",
          "Great coffee, great food, and a very warm atmosphere. Five stars!"
        ]
      } else {
        return [
          "Exceptional service and seamless experience. Highly recommended!",
          "Very professional staff and top-tier quality. Five stars all around!"
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
    if (userId) logEvent('feedback_completed', userId)
    setTimeout(() => setCopiedPrompt(null), 3000)
  }

  const activeLinks = links.filter(l => l.enabled && l.value.trim() !== '')
  const menuButtonTitle = businessType.toLowerCase().includes('salon') ? 'View Rate Card' : 'View Digital Menu'

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category || 'General')))]
  const filteredMenuItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => (item.category || 'General') === activeCategory)

  if (loading) {
    return <main className="min-h-screen bg-[#05050a] text-gray-400 flex items-center justify-center font-mono text-sm">INITIALIZING TERMINAL...</main>
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center py-16 px-6">
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md flex flex-col items-center mb-8 z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1 text-center">{businessName}</h1>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">{businessType}</p>
      </div>

      {/* Dynamic Menu / Rate Card Action Button */}
      {menuItems.length > 0 && (
        <div className="w-full max-w-md mb-6 z-10">
          <button
            onClick={() => {
              setShowMenuModal(true)
              if (userId) logEvent('menu_viewed', userId)
            }}
            className="w-full p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-2xl backdrop-blur-xl flex items-center justify-between text-amber-300 hover:border-amber-400 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span className="font-bold text-sm tracking-wide">{menuButtonTitle}</span>
            </div>
            <span className="text-xs font-mono bg-amber-500/20 py-1 px-2.5 rounded-lg text-amber-200">{menuItems.length} items</span>
          </button>
        </div>
      )}

      {/* Google Review Widget */}
      {googleReviewUrl && (
        <div className="w-full max-w-md mb-8 p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl z-10 shadow-xl text-center">
          <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider font-mono">Rate Your Experience</h3>
          <p className="text-xs text-gray-400 mb-4">Tap a star rating to generate review templates.</p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setSelectedRating(star)
                  if (userId && star >= 4) logEvent('feedback_started', userId)
                }}
                className={`text-3xl transition-transform hover:scale-125 focus:outline-none ${selectedRating && selectedRating >= star ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-gray-600'}`}
              >
                ★
              </button>
            ))}
          </div>

          {selectedRating && (
            <div className="space-y-4">
              {selectedRating >= 4 ? (
                <div>
                  <p className="text-xs font-mono text-cyan-400 mb-2 uppercase">Suggested Review Templates:</p>
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
                    onClick={() => { if (userId) logEvent('google_review_clicked', userId) }}
                    className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl block shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:opacity-90 transition-all"
                  >
                    Proceed to Google Reviews ↗
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                  <p className="text-xs text-gray-300 mb-2">Please share your private feedback with management:</p>
                  <input type="text" placeholder="Type feedback..." className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-gray-200 mb-2 focus:outline-none" />
                  <button onClick={() => alert('Feedback submitted!')} className="w-full py-2 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20">Submit Feedback</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Links Container */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10">
        {activeLinks.map((link) => {
          const style = getPlatformStyle(link.title)
          const destinationUrl = getDestinationUrl(link.title, link.value)

          return (
            <a
              key={link.id}
              href={destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleOptionClick(link.title)}
              className="group relative w-full p-3 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl flex items-center justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <span className="font-semibold text-gray-300 group-hover:text-white relative z-10">{link.title}</span>
            </a>
          )
        })}
      </div>

      {/* Categorized Menu / Rate Card Popup Modal with Horizontal Scrollbar */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className="bg-[#0d0d14] border border-white/10 rounded-3xl w-full max-w-md p-6 relative max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{businessType.toLowerCase().includes('salon') ? 'Service Rate Card' : 'Digital Menu'}</h3>
              <button onClick={() => setShowMenuModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">✕</button>
            </div>

            {/* Horizontal Scrollable Category Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin scrollbar-thumb-white/10 shrink-0">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable Items List */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {filteredMenuItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded uppercase">{item.category || 'General'}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </div>
                  <span className="font-mono text-cyan-400 text-sm font-bold ml-4">{item.price}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setShowMenuModal(false)} className="mt-4 w-full py-3 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all shrink-0">Close</button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-16 z-10">
        <Link href="/" className="inline-flex items-center gap-2 py-2 px-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Powered by Scan Circle</span>
        </Link>
      </div>
    </main>
  )
}