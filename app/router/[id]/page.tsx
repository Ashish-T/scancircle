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
}

export default function RouterProfilePage({ params }: PageProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('Scan Circle Business')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [links, setLinks] = useState<LinkItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
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

      // Check 24-hour repeat scan logic using localStorage
      const lastScanKey = `sc_last_scan_${targetBusinessId}`
      const lastScanTime = localStorage.getItem(lastScanKey)
      const now = Date.now()
      let finalEventType = eventType

      if (eventType === 'qr_scanned') {
        if (lastScanTime) {
          const hoursElapsed = (now - Number(lastScanTime)) / (1000 * 60 * 60)
          if (hoursElapsed >= 24) {
            finalEventType = 'repeat_qr_scanned' // Logged as repeat scan after 24 hours
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

  const activeLinks = links.filter(l => l.enabled && l.value.trim() !== '')

  if (loading) {
    return <main className="min-h-screen bg-[#05050a] text-gray-400 flex items-center justify-center font-mono text-sm">INITIALIZING TERMINAL...</main>
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-md flex flex-col items-center mb-8 z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1 text-center">{businessName}</h1>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">{businessType}</p>
      </div>

      {/* Dynamic Menu Bar or Rate List Section */}
      {menuItems.length > 0 && (
        <div className="w-full max-w-md mb-8 p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl z-10">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono text-center">
            {businessType.toLowerCase().includes('salon') ? 'Service Rate Card' : 'Digital Menu Bar'}
          </h3>
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  {item.description && <p className="text-[10px] text-gray-400">{item.description}</p>}
                </div>
                <span className="font-mono text-cyan-400 text-xs font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links / Options Container */}
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
    </main>
  )
}