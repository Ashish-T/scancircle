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
  imageUrl?: string
}

// Industry-Specific Themes configuration (Fixed TypeScript type)
const THEMES: Record<string, { bg: string, card: string, accentText: string, accentBg: string, border: string, glow: string }> = {
  'Cafe & Restaurant': { bg: 'bg-[#1c1917]', card: 'bg-[#292524]', accentText: 'text-amber-400', accentBg: 'bg-amber-500', border: 'border-amber-500/30', glow: 'bg-amber-600/10' },
  'Salon & Spa': { bg: 'bg-[#0f1115]', card: 'bg-[#181a20]', accentText: 'text-yellow-500', accentBg: 'bg-yellow-500', border: 'border-yellow-500/30', glow: 'bg-yellow-600/10' },
  'Womens Parlour': { bg: 'bg-[#1f1619]', card: 'bg-[#2e1f25]', accentText: 'text-rose-400', accentBg: 'bg-rose-500', border: 'border-rose-400/30', glow: 'bg-rose-600/10' },
  'Retail & Shopping': { bg: 'bg-[#0f172a]', card: 'bg-[#1e293b]', accentText: 'text-blue-400', accentBg: 'bg-blue-500', border: 'border-blue-500/30', glow: 'bg-blue-600/10' },
  'Fitness & Gym': { bg: 'bg-[#064e3b]', card: 'bg-[#065f46]', accentText: 'text-emerald-400', accentBg: 'bg-emerald-500', border: 'border-emerald-500/30', glow: 'bg-emerald-600/10' },
  'Default': { bg: 'bg-[#05050a]', card: 'bg-[#0a0a0f]', accentText: 'text-cyan-400', accentBg: 'bg-cyan-500', border: 'border-cyan-500/30', glow: 'bg-cyan-600/10' }
}

export default function RouterProfilePage({ params }: PageProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('Scan Circle Business')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [brandLogo, setBrandLogo] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState('active')
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
        if (profile.brand_logo) setBrandLogo(profile.brand_logo)
        if (profile.subscription_status) setSubscriptionStatus(profile.subscription_status)
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

    if (selectedRating === 5) {
      if (type.includes('cafe') || type.includes('restaurant')) {
        return [
          "Absolutely phenomenal experience! The food was exceptionally fresh, delicious, and beautifully presented. The ambiance and staff hospitality made our visit truly memorable. Five stars well deserved!",
          "Top-tier quality from start to finish. Every single dish we ordered exceeded expectations, and the service was warm and attentive. Can't wait to come back again with friends!",
          "A hidden gem! Incomparable flavors, cozy atmosphere, and prompt service. If you are looking for an incredible dining experience, this is the place to be."
        ]
      } else if (type.includes('salon') || type.includes('spa') || type.includes('parlour')) {
        return [
          "Absolute perfection! The stylists here are true artists who listen carefully to what you want. Clean facilities, soothing ambiance, and unmatched professionalism. Highly recommended!",
          "Best experience I’ve had in a long time! Extremely hygienic, polite staff, and top-quality treatment results. Completely worth every penny.",
          "Exceeded all my expectations! Relaxing environment and phenomenal attention to detail. I am definitely becoming a regular client here."
        ]
      } else if (type.includes('fitness') || type.includes('gym')) {
        return [
          "Amazing facility with state-of-the-art equipment and extremely knowledgeable trainers! Highly motivating environment to reach your fitness goals.",
          "Clean, well-maintained, and spacious gym floor with top-notch coaching. Love working out here every single day!",
          "Best fitness center around! Great community vibe, clean locker rooms, and fantastic trainers."
        ]
      } else {
        return [
          "Outstanding service and flawless execution! The team went above and beyond to ensure everything was perfect. Five stars all around!",
          "Extremely professional, prompt, and high quality. One of the best experiences I’ve had. Highly recommend to everyone!",
          "Brilliant customer care and stellar results. Truly a 5-star establishment!"
        ]
      }
    } else if (selectedRating === 4) {
      if (type.includes('cafe') || type.includes('restaurant')) {
        return [
          "Great food and lovely ambiance! Service was slightly slow due to the weekend rush, but the taste and quality more than made up for it. Would happily visit again.",
          "Delicious meals and very courteous staff. Enjoyed the overall experience thoroughly, just minor room for speed optimization during peak hours. Great spot!",
          "Very solid menu options with wonderful flavors. Clean seating area and polite attendants. A wonderful place for casual hangouts."
        ]
      } else if (type.includes('salon') || type.includes('spa') || type.includes('parlour')) {
        return [
          "Very professional service and clean setup. Took a little longer than expected to get started, but the final styling result was fantastic!",
          "Skilled staff and wonderful results! Very satisfying experience overall, would love to see slightly shorter wait times next time.",
          "Clean environment, polite team, and great quality treatment. Very happy with the outcome!"
        ]
      } else if (type.includes('fitness') || type.includes('gym')) {
        return [
          "Great gym with excellent equipment. Can get a bit crowded during peak evening hours, but overall a fantastic place to train.",
          "Solid equipment and helpful trainers. Very clean and well-organized facility."
        ]
      } else {
        return [
          "Very good service overall! Prompt response and helpful staff. Minor room for improvement in coordination, but highly satisfied with the outcome.",
          "Solid experience with professional personnel. Quality of work is great and meets expectations."
        ]
      }
    } else {
      return [
        "The experience could have been improved regarding waiting times and overall execution.",
        "A bit more attention to detail and faster service would make this a much better experience."
      ]
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPrompt(text)
    if (userId) logEvent('feedback_completed', userId)
    setTimeout(() => setCopiedPrompt(null), 3000)
  }

  if (loading) {
    return <main className="min-h-screen bg-[#05050a] text-gray-400 flex items-center justify-center font-mono text-sm">INITIALIZING TERMINAL...</main>
  }

  // --- 🔴 THE EXPIRED SUBSCRIPTION SCREEN 🔴 ---
  if (subscriptionStatus === 'expired') {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Service Temporarily Paused</h1>
        <p className="text-slate-400 max-w-sm mb-10 font-light leading-relaxed">
          The digital catalog for <strong className="text-white">{businessName}</strong> is currently offline. Please notify the staff to renew their matrix lease.
        </p>
        <div className="py-4 px-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl font-mono text-sm font-bold tracking-widest text-black uppercase shadow-xl animate-pulse">
          Get the good thing done
        </div>
      </div>
    )
  }

  // --- ✅ ACTIVE BUSINESS SCREEN ---
  
  // Resolve Theme based on Business Type
  const theme = THEMES[businessType] || THEMES['Cafe & Restaurant'] || THEMES['Default']

  const activeLinks = links.filter(l => l.enabled && l.value.trim() !== '')
  const menuButtonTitle = businessType.toLowerCase().includes('salon') || businessType.toLowerCase().includes('parlour') ? 'View Service Menu' : 'View Digital Menu'

  // Filter out empty or "general" categories from filter buttons
  const validCategories = menuItems.map(item => item.category?.trim()).filter(Boolean) as string[]
  const categories = ['All', ...Array.from(new Set(validCategories))]
  
  const filteredMenuItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => (item.category?.trim() || '') === activeCategory)

  return (
    <main className={`min-h-screen ${theme.bg} text-gray-200 relative overflow-hidden flex flex-col items-center py-16 px-6 transition-colors duration-500`}>
      <div className={`absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full ${theme.glow} blur-[100px] pointer-events-none -z-10`}></div>
      <div className={`absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] rounded-full ${theme.glow} blur-[100px] pointer-events-none -z-10`}></div>

      {/* Brand Header */}
      <div className="w-full max-w-md flex flex-col items-center mb-8 z-10">
        {brandLogo && (
          <div className={`w-24 h-24 mb-4 rounded-full border-2 ${theme.border} p-1 bg-black/50 shadow-xl`}>
            <img src={brandLogo} alt={businessName} className="w-full h-full object-cover rounded-full" />
          </div>
        )}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1 text-center">{businessName}</h1>
        <p className={`text-sm font-mono ${theme.accentText} tracking-widest uppercase`}>{businessType}</p>
      </div>

      {/* Dynamic Menu / Rate Card Action Button */}
      {menuItems.length > 0 && (
        <div className="w-full max-w-md mb-6 z-10">
          <button
            onClick={() => {
              setShowMenuModal(true)
              if (userId) logEvent('menu_viewed', userId)
            }}
            className={`w-full p-4 ${theme.card} border ${theme.border} rounded-2xl backdrop-blur-xl flex items-center justify-between text-white transition-all shadow-lg group hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-5 h-5 ${theme.accentText} group-hover:scale-110 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span className="font-bold text-sm tracking-wide">{menuButtonTitle}</span>
            </div>
            <span className={`text-xs font-mono bg-black/40 py-1 px-2.5 rounded-lg ${theme.accentText} border ${theme.border}`}>{menuItems.length} items</span>
          </button>
        </div>
      )}

      {/* Google Review Widget */}
      {googleReviewUrl && (
        <div className={`w-full max-w-md mb-8 p-6 ${theme.card} border ${theme.border} rounded-3xl backdrop-blur-xl z-10 shadow-xl text-center`}>
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
                  <p className={`text-xs font-mono ${theme.accentText} mb-2 uppercase`}>
                    {selectedRating === 5 ? '★ 5-Star Premium Templates:' : '★ 4-Star Balanced Templates:'} (Tap to Copy)
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {getReviewPrompts().map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => copyToClipboard(prompt)}
                        className={`w-full text-left p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-300 hover:border-white/30 transition-all leading-relaxed`}
                      >
                        {prompt} {copiedPrompt === prompt && <span className="float-right text-emerald-400 font-mono font-bold">COPIED!</span>}
                      </button>
                    ))}
                  </div>
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { if (userId) logEvent('google_review_clicked', userId) }}
                    className="mt-6 w-full py-3 px-4 bg-white text-black text-xs font-bold rounded-xl block shadow-lg hover:bg-gray-200 transition-all"
                  >
                    Proceed to Google Reviews ↗
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                  <p className="text-xs text-gray-300 mb-2">Please share your private feedback with management:</p>
                  <input type="text" placeholder="Type feedback..." className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs text-gray-200 mb-2 focus:outline-none" />
                  <button onClick={() => alert('Feedback submitted!')} className="w-full py-2 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20">Submit Feedback</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Social Links Container */}
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
              className={`group relative w-full p-3 pr-4 ${theme.card} border ${theme.border} rounded-2xl backdrop-blur-xl flex items-center justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <span className="font-semibold text-gray-300 group-hover:text-white relative z-10">{link.title}</span>
            </a>
          )
        })}
      </div>

      {/* Categorized Menu / Rate Card Popup Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
          <div className={`${theme.bg} border ${theme.border} rounded-3xl w-full max-w-md p-6 relative max-h-[85vh] flex flex-col shadow-2xl`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{businessType.toLowerCase().includes('salon') || businessType.toLowerCase().includes('parlour') ? 'Service Rate Card' : 'Digital Menu'}</h3>
              <button onClick={() => setShowMenuModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">✕</button>
            </div>

            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin scrollbar-thumb-white/10 shrink-0">
                {categories.map((cat, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? `${theme.accentBg} text-white shadow-lg border border-white/20` : 'bg-black/40 text-gray-400 border border-white/5 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {filteredMenuItems.map((item, idx) => (
                <div key={idx} className={`p-4 ${theme.card} border ${theme.border} rounded-2xl flex gap-4 items-start`}>
                  {/* Newly Added Image Support for Menu Items */}
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-black/50 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        {item.category?.trim() && (
                          <span className={`text-[9px] font-mono ${theme.accentText} bg-black/40 px-2 py-0.5 rounded uppercase block w-max mb-1`}>{item.category}</span>
                        )}
                        <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                      </div>
                      <span className={`font-mono ${theme.accentText} text-sm font-bold ml-3 shrink-0`}>{item.price}</span>
                    </div>
                    {item.description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowMenuModal(false)} className="mt-4 w-full py-3 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all shrink-0">Close</button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-16 z-10">
        <Link href="/" className={`inline-flex items-center gap-2 py-2 px-4 ${theme.card} rounded-full border ${theme.border} transition-colors`}>
          <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} animate-pulse`}></span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Powered by Scan Circle</span>
        </Link>
      </div>
    </main>
  )
}