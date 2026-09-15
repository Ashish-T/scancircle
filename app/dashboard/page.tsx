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
  category: string
}

interface DestinationItem {
  id: number
  title: string
  value: string
  type: string
  enabled: boolean
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
  
  // Button State: 'idle' (Save Changes), 'saving' (Saving...), 'saved' (Saved in Green)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [deployMessage, setDeployMessage] = useState('')

  // Menu / Rate Card State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: 'Signature Espresso', price: '$4.50', description: 'Rich dark roast blend', category: 'Drinks' },
    { name: 'Truffle Fries', price: '$6.00', description: 'Crispy fries with truffle oil', category: 'Snacks' }
  ])
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('Snacks')

  // QR Customization & Logo State
  const [qrCodesList, setQrCodesList] = useState<Array<{ id: string; createdAt: string; expiresAt: string }>>([])
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [qrColor, setQrColor] = useState('white')
  const [brandLogoUrl, setBrandLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const qrRef = useRef<HTMLCanvasElement>(null)

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
  
  const [destinations, setDestinations] = useState<DestinationItem[]>([
    { id: 1, title: 'Facebook', value: '', type: 'social', enabled: true },
    { id: 2, title: 'WhatsApp', value: '', type: 'social', enabled: true },
    { id: 3, title: 'Instagram', value: '', type: 'social', enabled: true },
    { id: 4, title: 'YouTube', value: '', type: 'social', enabled: true },
    { id: 5, title: 'Twitter', value: '', type: 'social', enabled: true },
  ])

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)
      setUserEmail(user.email || 'user@scancircle.com')

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        if (data.business_name) setBusinessName(data.business_name)
        if (data.business_type) setBusinessType(data.business_type)
        if (data.google_review_url) setGoogleReviewUrl(data.google_review_url)
        if (data.links) setDestinations(data.links)
        if (data.business_menu) setMenuItems(data.business_menu)
        if (data.brand_logo) setBrandLogoUrl(data.brand_logo)
        
        if (data.qr_codes && Array.isArray(data.qr_codes)) {
          setQrCodesList(data.qr_codes)
        } else {
          const createdAt = new Date().toISOString()
          const expiresDate = new Date()
          expiresDate.setDate(expiresDate.getDate() + 30)
          setQrCodesList([{ id: user.id, createdAt, expiresAt: expiresDate.toISOString() }])
        }
      }

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
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Any changes revert the save button back to "Save Changes"
  const markAsUnsaved = () => {
    if (saveStatus === 'saved') {
      setSaveStatus('idle')
    }
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
    markAsUnsaved()
  }

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !userId) return

    const file = files[0]
    setUploadingLogo(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        alert('Error uploading logo: ' + uploadError.message)
        setUploadingLogo(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath)

      if (publicUrlData) {
        setBrandLogoUrl(publicUrlData.publicUrl)
        markAsUnsaved()
      }
      setUploadingLogo(false)
    } catch (err) {
      console.error('Logo upload exception:', err)
      setUploadingLogo(false)
    }
  }

  const handleAddMenuItem = () => {
    if (!newItemName || !newItemPrice) return
    setMenuItems([...menuItems, { name: newItemName, price: newItemPrice, description: newItemDesc, category: newItemCategory }])
    setNewItemName('')
    setNewItemPrice('')
    setNewItemDesc('')
    markAsUnsaved()
  }

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index))
    markAsUnsaved()
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
    markAsUnsaved()
    setDeployMessage('Google Place synced! Click Save Changes.')
    setTimeout(() => setDeployMessage(''), 4000)
  }

  const handleDeployConfig = async () => {
    if (!userId) return
    setSaveStatus('saving')
    setDeployMessage('')

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      business_name: businessName,
      business_type: businessType,
      google_review_url: googleReviewUrl,
      links: destinations,
      business_menu: menuItems,
      brand_logo: brandLogoUrl,
      qr_codes: qrCodesList,
      updated_at: new Date()
    })

    if (error) {
      setSaveStatus('idle')
      setDeployMessage('Failed to save: ' + error.message)
    } else {
      setSaveStatus('saved') // Changes button text to "Saved" and color to green
    }
  }

  const getQRColorHex = (color: string) => {
    switch(color) {
      case 'cyan': return '#22d3ee'
      case 'amber': return '#f59e0b'
      case 'emerald': return '#10b981'
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
    link.download = `${businessName.replace(/\s+/g, '_')}_ScanCircle_QR.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUpdateDestination = (id: number, field: string, value: string | boolean) => {
    setDestinations(destinations.map(dest => dest.id === id ? { ...dest, [field]: value } : dest))
    markAsUnsaved()
  }

  const getTargetConfig = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('facebook')) return { label: 'PAGE URL', placeholder: 'https://facebook.com/yourpage', type: 'url' }
    if (t.includes('whatsapp')) return { label: 'PHONE NUMBER', placeholder: '+1234567890', type: 'tel' }
    if (t.includes('instagram')) return { label: 'USERNAME / HANDLE', placeholder: '@yourhandle', type: 'text' }
    if (t.includes('youtube')) return { label: 'CHANNEL LINK', placeholder: 'https://youtube.com/@yourchannel', type: 'url' }
    if (t.includes('twitter') || t.includes('x')) return { label: 'USERNAME', placeholder: '@yourusername', type: 'text' }
    return { label: 'TARGET URL', placeholder: 'https://...', type: 'url' }
  }

  const publicProfileUrl = userId ? `https://scancircle.onrender.com/router/${userId}` : ''
  const conversionRate = metrics.totalScans > 0 ? ((metrics.reviewClicks / metrics.totalScans) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-2xl z-20">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Scan Circle
          </h2>
          <p className="text-xs text-gray-400 mt-1">Business Control Panel</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-1">
          <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'destinations' ? 'bg-gradient-to-r from-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}>Social Links</button>
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'menu' ? 'bg-gradient-to-r from-amber-500/15 text-amber-300 border-l-2 border-amber-400' : 'text-gray-400 hover:bg-white/5'}`}>Menu / Rate Card</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-gradient-to-r from-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400' : 'text-gray-400 hover:bg-white/5'}`}>Analytics & Insights</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-gradient-to-r from-indigo-500/15 text-indigo-300 border-l-2 border-indigo-400' : 'text-gray-400 hover:bg-white/5'}`}>QR Code Studio</button>
          <button onClick={() => setActiveTab('places')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'places' ? 'bg-gradient-to-r from-fuchsia-500/15 text-fuchsia-300 border-l-2 border-fuchsia-400' : 'text-gray-400 hover:bg-white/5'}`}>Google Places Sync</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage your links, digital menus, and customer reviews.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1">
                {/* Dynamic Save Changes / Saved Button */}
                {saveStatus === 'saved' ? (
                  <button 
                    onClick={handleDeployConfig}
                    className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-default"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Saved
                  </button>
                ) : (
                  <button 
                    onClick={handleDeployConfig}
                    disabled={saveStatus === 'saving'}
                    className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 cursor-pointer"
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
                {deployMessage && <span className="text-xs font-mono text-cyan-400">{deployMessage}</span>}
              </div>

              {/* Profile Dropdown Menu */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-200 hover:bg-white/[0.08] hover:border-cyan-500/40 transition-all shadow-lg group"
                >
                  <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0d0d14] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-30 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="px-1 py-1 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">{businessName}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p>
                    </div>
                    <div className="px-1 py-1 border-b border-white/5 space-y-1">
                      <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Active QR Allocation</p>
                      <p className="text-xs font-bold text-white">{qrCodesList.length} / 2 QR Codes Created</p>
                    </div>
                    <div className="px-1 py-1 border-b border-white/5 space-y-1">
                      <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Retention Window</p>
                      <p className="text-xs text-gray-300">30-Day Preservation Active</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Secure Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Business Name</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => { setBusinessName(e.target.value); markAsUnsaved(); }} 
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Nature of Business (Category)</label>
              <select 
                value={businessType} 
                onChange={(e) => { setBusinessType(e.target.value); markAsUnsaved(); }} 
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 appearance-none"
              >
                <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                <option value="Salon & Spa">Salon & Spa</option>
                <option value="Retail & Shopping">Retail & Shopping</option>
                <option value="Fitness & Gym">Fitness & Gym</option>
                <option value="Professional Services">Professional Services</option>
                <option value="General & Other">General & Other</option>
              </select>
            </div>
          </div>

          {/* Menu / Rate Card Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {businessType.toLowerCase().includes('salon') ? 'Service Rate List Builder' : 'Digital Menu Builder'}
                </h3>
                <p className="text-sm text-gray-400 mb-6">Organize items by categories (e.g. Snacks, Drinks, Main Course).</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <input type="text" placeholder="Item Name (e.g. Latte)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
                  <input type="text" placeholder="Price (e.g. $4.00)" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
                  <input type="text" placeholder="Category (e.g. Snacks)" value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
                  <input type="text" placeholder="Description (Optional)" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
                </div>
                <button onClick={handleAddMenuItem} className="py-2.5 px-6 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30 mb-8">
                  + Add Item
                </button>

                <div className="space-y-3">
                  {menuItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
                      <div>
                        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded uppercase">{item.category}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{item.name} <span className="text-cyan-400 font-mono ml-2">{item.price}</span></h4>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                      <button onClick={() => handleRemoveMenuItem(idx)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
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
                <h3 className="text-xl font-semibold text-white mb-2">Analytics & Insights</h3>
                <p className="text-sm text-gray-400 mb-8">Monitor your total QR scans, repeat customer visits, and review conversions.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs text-gray-400 uppercase mb-1">Total QR Scans</p>
                    <h4 className="text-3xl font-bold text-white">{metrics.totalScans}</h4>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs text-gray-400 uppercase mb-1">Repeat Scans (&gt;24h)</p>
                    <h4 className="text-3xl font-bold text-white">{metrics.repeatScans}</h4>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs text-gray-400 uppercase mb-1">Google Review Clicks</p>
                    <h4 className="text-3xl font-bold text-white">{metrics.reviewClicks}</h4>
                  </div>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                    <p className="text-xs text-gray-400 uppercase mb-1">Conversion Rate</p>
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

          {/* Social Links Tab */}
          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">Social Links & Destinations</h3>
                <p className="text-sm text-gray-400 mb-8">Configure the links that customers will see when they scan your QR code.</p>
                
                <div className="space-y-4">
                  {destinations.map((dest) => {
                    const inputConfig = getTargetConfig(dest.title)
                    return (
                      <div key={dest.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-black/40 rounded-2xl border border-white/5">
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">Platform Name</label>
                            <input 
                              type="text" 
                              value={dest.title} 
                              onChange={(e) => handleUpdateDestination(dest.id, 'title', e.target.value)} 
                              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2">{inputConfig.label}</label>
                            <input 
                              type={inputConfig.type} 
                              value={dest.value} 
                              onChange={(e) => handleUpdateDestination(dest.id, 'value', e.target.value)} 
                              placeholder={inputConfig.placeholder} 
                              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500" 
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2 md:pt-6 flex flex-col items-center">
                          <label className="block text-[10px] font-mono text-gray-400 uppercase mb-2">{dest.enabled ? 'Active' : 'Disabled'}</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={dest.enabled} 
                              onChange={(e) => handleUpdateDestination(dest.id, 'enabled', e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-14 h-7 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500"></div>
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* QR Code Studio */}
          {activeTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-full flex justify-between items-center mb-4 px-2">
                  <span className="text-xs text-gray-400">Active Scanners: <strong className="text-cyan-400">{qrCodesList.length}/2</strong></span>
                  <button onClick={handleCreateNewQR} disabled={qrCodesList.length >= 2} className="py-1.5 px-3 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl disabled:opacity-40">+ Generate New QR</button>
                </div>
                
                <div className="w-72 h-72 bg-[#05050a] rounded-3xl border border-white/10 flex items-center justify-center mb-6 relative p-6 shadow-inner">
                  {publicProfileUrl && (
                    <QRCodeCanvas 
                      ref={qrRef}
                      value={publicProfileUrl}
                      size={200}
                      bgColor="#05050a"
                      fgColor={getQRColorHex(qrColor)}
                      level="H"
                      imageSettings={
                        brandLogoUrl ? {
                          src: brandLogoUrl,
                          height: 48,
                          width: 48,
                          excavate: true,
                        } : undefined
                      }
                    />
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mb-6 text-center">Preserved for 30 days. Expires on: <span className="text-indigo-400">{new Date(qrCodesList[0]?.expiresAt || Date.now()).toLocaleDateString()}</span></p>
                <button onClick={downloadQRCode} className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:opacity-90 transition-all">Download Branded QR</button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <h3 className="text-xl font-semibold text-white mb-6">QR Customizer & Logo Upload</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">Upload Brand Logo Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                      />
                      {uploadingLogo && <p className="text-xs text-cyan-400 mt-2 font-mono">Uploading logo to cloud...</p>}
                      {brandLogoUrl && !uploadingLogo && <p className="text-xs text-emerald-400 mt-2 font-mono">Logo successfully uploaded and embedded!</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-3">Matrix Color Palette</label>
                      <div className="flex gap-4">
                        <button onClick={() => { setQrColor('white'); markAsUnsaved(); }} className={`w-10 h-10 rounded-xl bg-white transition-all ${qrColor === 'white' ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#05050a]' : 'opacity-60'}`}></button>
                        <button onClick={() => { setQrColor('cyan'); markAsUnsaved(); }} className={`w-10 h-10 rounded-xl bg-cyan-400 transition-all ${qrColor === 'cyan' ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#05050a]' : 'opacity-60'}`}></button>
                        <button onClick={() => { setQrColor('amber'); markAsUnsaved(); }} className={`w-10 h-10 rounded-xl bg-amber-500 transition-all ${qrColor === 'amber' ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#05050a]' : 'opacity-60'}`}></button>
                        <button onClick={() => { setQrColor('emerald'); markAsUnsaved(); }} className={`w-10 h-10 rounded-xl bg-emerald-500 transition-all ${qrColor === 'emerald' ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#05050a]' : 'opacity-60'}`}></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'places' && (
            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Google Places Sync</h3>
              <p className="text-sm text-gray-400 mb-6">Search your business name to automatically locate and sync your official Google Review page.</p>
              <form onSubmit={handleGooglePlaceSearch} className="flex gap-4 mb-6">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter exact business name..." className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500" />
                <button type="submit" disabled={searching} className="py-4 px-8 bg-white/5 border border-fuchsia-500/30 text-fuchsia-300 font-bold rounded-2xl hover:bg-fuchsia-500/10 transition-all">Search Place</button>
              </form>
              {searchResults.length > 0 && (
                <div className="space-y-3 mb-6">
                  {searchResults.map((place, idx) => (
                    <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div><h4 className="text-sm font-bold text-white">{place.name}</h4><p className="text-xs text-gray-400">{place.address}</p></div>
                      <button type="button" onClick={() => handleSelectPlace(place)} className="py-2 px-4 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-xl hover:bg-cyan-500/30">Sync Location</button>
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