'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { QRCodeCanvas } from 'qrcode.react'
import { useRouter } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface MenuItem {
  name: string
  price: string
  description?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('destinations')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [businessName, setBusinessName] = useState('My Business Name')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ name: string; address: string; reviewUrl: string }>>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deployMessage, setDeployMessage] = useState('')

  // Menu / Rate Card Management State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: 'Signature Espresso', price: '$4.50', description: 'Rich dark roast blend' }
  ])
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')

  // QR Limit & Expiry Management States
  const [qrCodesList, setQrCodesList] = useState<Array<{ id: string; createdAt: string; expiresAt: string }>>([])
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Analytics Metrics State
  const [metrics, setMetrics] = useState({
    totalScans: 0,
    repeatScans: 0,
    instagramClicks: 0,
    youtubeClicks: 0,
    facebookClicks: 0,
    whatsappClicks: 0,
    reviewClicks: 0,
    otherOptionClicks: 0,
  })
  
  const [destinations, setDestinations] = useState([
    { id: 1, title: 'Facebook', value: '', type: 'social', enabled: true },
    { id: 2, title: 'WhatsApp', value: '', type: 'social', enabled: true },
    { id: 3, title: 'Instagram', value: '', type: 'social', enabled: true },
    { id: 4, title: 'YouTube', value: '', type: 'social', enabled: true },
    { id: 5, title: 'Twitter', value: '', type: 'social', enabled: true },
  ])

  const [qrColor, setQrColor] = useState('white')
  const [qrStyle, setQrStyle] = useState('Geometric Square')
  const qrRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      setUserEmail(user.email || 'user@scancircle.com')

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        if (data.business_name) setBusinessName(data.business_name)
        if (data.business_type) setBusinessType(data.business_type)
        if (data.google_review_url) setGoogleReviewUrl(data.google_review_url)
        if (data.links) setDestinations(data.links)
        if (data.business_menu) setMenuItems(data.business_menu)
        
        if (data.qr_codes && Array.isArray(data.qr_codes)) {
          setQrCodesList(data.qr_codes)
        } else {
          const createdAt = new Date().toISOString()
          const expiresDate = new Date()
          expiresDate.setDate(expiresDate.getDate() + 30)
          setQrCodesList([{ id: user.id, createdAt, expiresAt: expiresDate.toISOString() }])
        }
      }

      // Fetch Analytics Events
      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type')
        .eq('business_id', user.id)

      if (events) {
        setMetrics({
          totalScans: events.filter(e => e.event_type === 'qr_scanned' || e.event_type === 'repeat_qr_scanned').length,
          repeatScans: events.filter(e => e.event_type === 'repeat_qr_scanned').length,
          instagramClicks: events.filter(e => e.event_type === 'instagram_clicked').length,
          youtubeClicks: events.filter(e => e.event_type === 'youtube_clicked').length,
          facebookClicks: events.filter(e => e.event_type === 'facebook_clicked').length,
          whatsappClicks: events.filter(e => e.event_type === 'whatsapp_clicked').length,
          reviewClicks: events.filter(e => e.event_type === 'google_review_clicked').length,
          otherOptionClicks: events.filter(e => e.event_type === 'option_clicked').length,
        })
      }
    }
    loadUserData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleCreateNewQR = () => {
    if (qrCodesList.length >= 2) {
      alert('Maximum limit reached: You can only generate up to 2 QR codes. Each code remains preserved for 30 days.')
      return
    }
    const createdAt = new Date().toISOString()
    const expiresDate = new Date()
    expiresDate.setDate(expiresDate.getDate() + 30)
    setQrCodesList([...qrCodesList, { id: `${userId}-${Date.now()}`, createdAt, expiresAt: expiresDate.toISOString() }])
  }

  const handleAddMenuItem = () => {
    if (!newItemName || !newItemPrice) return
    setMenuItems([...menuItems, { name: newItemName, price: newItemPrice, description: newItemDesc }])
    setNewItemName('')
    setNewItemPrice('')
    setNewItemDesc('')
  }

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index))
  }

  const handleGooglePlaceSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)

    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.results) {
        setSearchResults(data.results.map((place: any) => ({
          name: place.name,
          address: place.formatted_address,
          reviewUrl: `https://search.google.com/local/writereview?placeid=${place.place_id}`
        })))
      } else {
        setSearchResults([])
      }
      setSearching(false)
    } catch {
      setSearching(false)
    }
  }

  const handleSelectPlace = (place: { name: string; reviewUrl: string }) => {
    setBusinessName(place.name)
    setGoogleReviewUrl(place.reviewUrl)
    setSearchResults([])
    setSearchQuery('')
    setDeployMessage('Google Place synced successfully! Click Deploy to save.')
    setTimeout(() => setDeployMessage(''), 4000)
  }

  const handleDeployConfig = async () => {
    if (!userId) return
    setSaving(true)
    setDeployMessage('')

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      business_name: businessName,
      business_type: businessType,
      google_review_url: googleReviewUrl,
      links: destinations,
      business_menu: menuItems,
      qr_codes: qrCodesList,
      updated_at: new Date()
    })

    setSaving(false)
    if (error) {
      setDeployMessage('Failed to deploy configuration.')
    } else {
      setDeployMessage('Configuration deployed successfully!')
      setTimeout(() => setDeployMessage(''), 4000)
    }
  }

  const getQRColorHex = (color: string) => {
    switch(color) {
      case 'cyan': return '#22d3ee'
      case 'fuchsia': return '#d946ef'
      case 'emerald': return '#34d399'
      case 'white': 
      default: return '#ffffff'
    }
  }

  const downloadQRCode = () => {
    if (!qrRef.current) return
    const canvas = qrRef.current
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'ScanCircle-Matrix.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUpdateDestination = (id: number, field: string, value: string | boolean) => {
    setDestinations(destinations.map(dest => dest.id === id ? { ...dest, [field]: value } : dest))
  }

  const handleAddDestination = () => {
    const newId = destinations.length > 0 ? Math.max(...destinations.map(d => d.id)) + 1 : 1
    setDestinations([...destinations, { id: newId, title: '', value: '', type: 'custom', enabled: true }])
  }

  const getTargetConfig = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('facebook')) return { label: 'FULL PAGE URL', placeholder: 'https://facebook.com/yourpage', type: 'url' }
    if (t.includes('whatsapp')) return { label: 'PHONE NUMBER', placeholder: '+1234567890', type: 'tel' }
    if (t.includes('instagram')) return { label: 'USERNAME / HANDLE', placeholder: '@yourhandle', type: 'text' }
    if (t.includes('youtube')) return { label: 'FULL CHANNEL LINK', placeholder: 'https://youtube.com/@yourchannel', type: 'url' }
    if (t.includes('twitter') || t.includes('x')) return { label: 'USERNAME', placeholder: '@yourusername', type: 'text' }
    return { label: 'VECTOR TARGET URL', placeholder: 'https://...', type: 'url' }
  }

  const publicProfileUrl = userId ? `https://scancircle.onrender.com/router/${userId}` : ''
  const conversionRate = metrics.totalScans > 0 ? ((metrics.reviewClicks / metrics.totalScans) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-2xl z-20">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Scan Circle
          </h2>
          <p className="text-xs text-cyan-500/70 mt-2 font-mono tracking-wider uppercase">Nexus Hub v2.0</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-1">
          <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'destinations' ? 'bg-gradient-to-r from-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}>Neural Links</button>
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'menu' ? 'bg-gradient-to-r from-amber-500/15 text-amber-300 border-l-2 border-amber-400' : 'text-gray-400 hover:bg-white/5'}`}>Menu / Rate Card</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-gradient-to-r from-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400' : 'text-gray-400 hover:bg-white/5'}`}>Analytics & Metrics</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-gradient-to-r from-indigo-500/15 text-indigo-300 border-l-2 border-indigo-400' : 'text-gray-400 hover:bg-white/5'}`}>QR Matrix Engine</button>
          <button onClick={() => setActiveTab('places')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'places' ? 'bg-gradient-to-r from-fuchsia-500/15 text-fuchsia-300 border-l-2 border-fuchsia-400' : 'text-gray-400 hover:bg-white/5'}`}>Global Sync</button>
        </nav>

        {/* Profile Dropdown with Profile Icon */}
        <div className="p-6 border-t border-white/5 relative">
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{businessName}</p>
              <p className="text-[10px] font-mono text-gray-400 truncate">{userEmail}</p>
            </div>
            
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {profileDropdownOpen && (
            <div className="absolute bottom-24 left-6 right-6 bg-[#0d0d14] border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl z-30 space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Active QR Allocation</p>
                <p className="text-xs font-bold text-white mt-0.5">{qrCodesList.length} / 2 Scanners Created</p>
              </div>
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Retention Window</p>
                <p className="text-xs text-gray-300 mt-0.5">30-Day Preservation Active</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Secure Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">Command Center</h1>
              <p className="text-gray-400 text-sm font-mono">SYS.STATUS: <span className="text-emerald-400">ONLINE</span></p>
            </div>
            <button 
              onClick={handleDeployConfig}
              disabled={saving}
              className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
            >
              {saving ? 'Deploying...' : 'Deploy Configuration'}
            </button>
          </header>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Business Name</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Business Category</label>
              <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 appearance-none">
                <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                <option value="Salon & Spa">Salon & Spa</option>
                <option value="Retail & Shopping">Retail & Shopping</option>
                <option value="Fitness & Gym">Fitness & Gym</option>
              </select>
            </div>
          </div>

          {/* Menu / Rate Card Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {businessType.toLowerCase().includes('salon') ? 'Service Rate List Builder' : 'Digital Menu Bar Builder'}
                </h3>
                <p className="text-sm text-gray-400 mb-6 font-mono">Add items that will instantly display on your mobile routing page.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <input type="text" placeholder="Item Name (e.g. Latte)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200" />
                  <input type="text" placeholder="Price (e.g. $4.00)" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200" />
                  <input type="text" placeholder="Description (Optional)" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200" />
                </div>
                <button onClick={handleAddMenuItem} className="py-2.5 px-6 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30 mb-8">
                  + Add Item
                </button>

                <div className="space-y-3">
                  {menuItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.name} <span className="text-cyan-400 font-mono ml-2">{item.price}</span></h4>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                      <button onClick={() => handleRemoveMenuItem(idx)} className="text-xs text-red-400 hover:text-red-300 font-mono">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">Telemetry & Performance Metrics</h3>
                <p className="text-sm text-gray-400 mb-8 font-mono">Track option engagement and 24-hour repeat customer scanners.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs font-mono text-cyan-400 uppercase mb-1">Total QR Scans</p>
                    <h4 className="text-3xl font-bold text-white">{metrics.totalScans}</h4>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs font-mono text-indigo-400 uppercase mb-1">Repeat Scans (&gt;24h)</p>
                    <h4 className="text-3xl font-bold text-white">{metrics.repeatScans}</h4>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs font-mono text-amber-400 uppercase mb-1">Google Review Clicks</p>
                    <h4 className="text-3xl font-bold text-white">{metrics.reviewClicks}</h4>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs font-mono text-emerald-400 uppercase mb-1">Conversion Rate</p>
                    <h4 className="text-3xl font-bold text-white">{conversionRate}%</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-300">Instagram Clicks</span>
                    <span className="font-mono text-cyan-400 font-bold">{metrics.instagramClicks}</span>
                  </div>
                  <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-300">YouTube Clicks</span>
                    <span className="font-mono text-cyan-400 font-bold">{metrics.youtubeClicks}</span>
                  </div>
                  <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-300">Facebook Clicks</span>
                    <span className="font-mono text-cyan-400 font-bold">{metrics.facebookClicks}</span>
                  </div>
                  <div className="p-4 bg-black/30 border border-white/5 rounded-2xl flex justify-between items-center">
                    <span className="text-xs text-gray-300">WhatsApp Clicks</span>
                    <span className="font-mono text-cyan-400 font-bold">{metrics.whatsappClicks}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-8">Active Routing Array</h3>
                <div className="space-y-4">
                  {destinations.map((dest) => {
                    const inputConfig = getTargetConfig(dest.title)
                    return (
                      <div key={dest.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-black/40 rounded-2xl border border-white/5">
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Parameter ID</label>
                            <input type="text" value={dest.title} onChange={(e) => handleUpdateDestination(dest.id, 'title', e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2">{inputConfig.label}</label>
                            <input type={inputConfig.type} value={dest.value} onChange={(e) => handleUpdateDestination(dest.id, 'value', e.target.value)} placeholder={inputConfig.placeholder} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-full flex justify-between items-center mb-4 px-2">
                  <span className="text-xs font-mono text-gray-400">Active Scanners: <strong className="text-cyan-400">{qrCodesList.length}/2</strong></span>
                  <button onClick={handleCreateNewQR} disabled={qrCodesList.length >= 2} className="py-1.5 px-3 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl disabled:opacity-40">+ Generate New QR</button>
                </div>
                <div className="w-72 h-72 bg-[#05050a] rounded-3xl border border-white/10 flex items-center justify-center mb-6 relative p-6">
                  {publicProfileUrl && <QRCodeCanvas ref={qrRef} value={publicProfileUrl} size={200} bgColor="#05050a" fgColor={getQRColorHex(qrColor)} level="H" />}
                </div>
                <p className="text-[11px] font-mono text-gray-400 mb-6 text-center">Preserved for 30 days. Expires on: <span className="text-indigo-400">{new Date(qrCodesList[0]?.expiresAt || Date.now()).toLocaleDateString()}</span></p>
                <button onClick={downloadQRCode} className="w-full py-4 px-6 bg-white/5 border border-indigo-500/30 text-indigo-300 font-bold rounded-xl">Extract Holographic Matrix</button>
              </div>
            </div>
          )}

          {activeTab === 'places' && (
            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Global Satellite Link (Google Places Sync)</h3>
              <form onSubmit={handleGooglePlaceSearch} className="flex gap-4 mb-6">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter exact business name..." className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-sm text-gray-200" />
                <button type="submit" disabled={searching} className="py-4 px-8 bg-white/5 border border-fuchsia-500/30 text-fuchsia-300 font-bold rounded-2xl">Search Place</button>
              </form>
              {searchResults.length > 0 && (
                <div className="space-y-3 mb-6">
                  {searchResults.map((place, idx) => (
                    <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div><h4 className="text-sm font-bold text-white">{place.name}</h4><p className="text-xs text-gray-400">{place.address}</p></div>
                      <button type="button" onClick={() => handleSelectPlace(place)} className="py-2 px-4 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-xl">Sync Location</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}