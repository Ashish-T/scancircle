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

interface OrderItem {
  id: string
  item: string
  quantity: number
  amount: string
  date: string
  status: string
  utr?: string
  address?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('destinations')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  
  const [businessName, setBusinessName] = useState('My Business Name')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [deployMessage, setDeployMessage] = useState('')

  const [subscriptionStatus, setSubscriptionStatus] = useState('free')
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null)
  const [utrInput, setUtrInput] = useState('')
  const [submittingUtr, setSubmittingUtr] = useState(false)

  const [storeOrders, setStoreOrders] = useState<OrderItem[]>([])
  const [shippingAddress, setShippingAddress] = useState('')
  const [shopUtr, setShopUtr] = useState('')
  const [orderingStand, setOrderingStand] = useState(false)

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuCategories, setMenuCategories] = useState<string[]>(['Snacks', 'Drinks'])
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('Snacks')
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')

  const [qrCodesList, setQrCodesList] = useState<Array<{ id: string; createdAt: string; expiresAt: string }>>([])
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [qrColor, setQrColor] = useState('#22d3ee')
  const [brandLogoUrl, setBrandLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const qrRef = useRef<HTMLCanvasElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ name: string; address: string; reviewUrl: string }>>([])
  const [searching, setSearching] = useState(false)

  const [metrics, setMetrics] = useState({
    totalScans: 0, repeatScans: 0, instagramClicks: 0, youtubeClicks: 0, facebookClicks: 0, whatsappClicks: 0, reviewClicks: 0
  })
  
  const [destinations, setDestinations] = useState<DestinationItem[]>([
    { id: 1, title: 'Facebook', value: '', type: 'social', enabled: true },
    { id: 2, title: 'WhatsApp', value: '', type: 'social', enabled: true },
    { id: 3, title: 'Instagram', value: '', type: 'social', enabled: true },
    { id: 4, title: 'YouTube', value: '', type: 'social', enabled: true },
  ])

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setUserId(user.id)
      setUserEmail(user.email || 'user@scancircle.com')

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        if (data.business_name) setBusinessName(data.business_name)
        if (data.business_type) setBusinessType(data.business_type)
        if (data.google_review_url) setGoogleReviewUrl(data.google_review_url)
        if (data.links) setDestinations(data.links)
        if (data.brand_logo) setBrandLogoUrl(data.brand_logo)
        if (data.subscription_status) setSubscriptionStatus(data.subscription_status)
        if (data.subscription_expiry) setSubscriptionExpiry(data.subscription_expiry)
        if (data.store_orders) setStoreOrders(data.store_orders)
        
        if (data.business_menu) {
          setMenuItems(data.business_menu)
          const existingCats = Array.from(new Set(data.business_menu.map((item: MenuItem) => item.category))) as string[]
          if (existingCats.length > 0) {
            setMenuCategories(existingCats)
            setActiveMenuCategory(existingCats[0])
          }
        }
        
        if (data.qr_codes && Array.isArray(data.qr_codes)) {
          setQrCodesList(data.qr_codes)
        } else {
          const createdAt = new Date().toISOString()
          const expiresDate = new Date(); expiresDate.setDate(expiresDate.getDate() + 30)
          setQrCodesList([{ id: user.id, createdAt, expiresAt: expiresDate.toISOString() }])
        }
      }

      const { data: events } = await supabase.from('analytics_events').select('event_type').eq('business_id', user.id)
      if (events) {
        setMetrics({
          totalScans: events.filter(e => e.event_type === 'qr_scanned' || e.event_type === 'repeat_qr_scanned').length,
          repeatScans: events.filter(e => e.event_type === 'repeat_qr_scanned').length,
          instagramClicks: events.filter(e => e.event_type === 'instagram_clicked').length,
          youtubeClicks: events.filter(e => e.event_type === 'youtube_clicked').length,
          facebookClicks: events.filter(e => e.event_type === 'facebook_clicked').length,
          whatsappClicks: events.filter(e => e.event_type === 'whatsapp_clicked').length,
          reviewClicks: events.filter(e => e.event_type === 'google_review_clicked').length,
        })
      }
    }
    loadUserData()
  }, [router])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }
  const markAsUnsaved = () => { if (saveStatus === 'saved') setSaveStatus('idle') }

  const handleRemoveCategory = (catToRemove: string) => {
    if (confirm(`Delete category "${catToRemove}" and its items?`)) {
      const updatedCategories = menuCategories.filter(c => c !== catToRemove)
      setMenuCategories(updatedCategories)
      setMenuItems(menuItems.filter(item => item.category !== catToRemove))
      if (activeMenuCategory === catToRemove) {
        setActiveMenuCategory(updatedCategories.length > 0 ? updatedCategories[0] : '')
      }
      markAsUnsaved()
    }
  }

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index))
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
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file, { upsert: true })
      if (uploadError) { alert('Error: ' + uploadError.message); setUploadingLogo(false); return }
      const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(fileName)
      if (publicUrlData) { setBrandLogoUrl(publicUrlData.publicUrl); markAsUnsaved() }
      setUploadingLogo(false)
    } catch (err) { setUploadingLogo(false) }
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
          name: place.name, address: place.formatted_address, reviewUrl: `https://search.google.com/local/writereview?placeid=${place.place_id}`
        })))
      } else { setSearchResults([]) }
      setSearching(false)
    } catch { setSearching(false) }
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

  const handleOrderTableStand = async () => {
    if (!shippingAddress.trim() || !shopUtr.trim()) { alert('Enter Delivery Address & Payment UTR.'); return }
    setOrderingStand(true)
    const newOrder: OrderItem = {
      id: `ORD-${Date.now().toString().slice(-6)}`, item: 'Acrylic Table Stand with QR', quantity: 1, amount: '₹499', date: new Date().toLocaleDateString(), status: 'Payment Verification Pending', utr: shopUtr.trim(), address: shippingAddress.trim()
    }
    const updatedOrders = [newOrder, ...storeOrders]
    const { error } = await supabase.from('profiles').update({ store_orders: updatedOrders }).eq('id', userId)
    if (error) alert('Error: ' + error.message)
    else { setStoreOrders(updatedOrders); setShippingAddress(''); setShopUtr(''); alert('Order placed successfully!') }
    setOrderingStand(false)
  }

  const handleSubmitUtr = async () => {
    if (!utrInput.trim() || !userId) { alert('Enter 12-Digit UTR.'); return }
    setSubmittingUtr(true)
    const expiryDate = new Date(); expiryDate.setDate(expiryDate.getDate() + 30)
    const { error } = await supabase.from('profiles').update({ subscription_status: 'pro_pending_verification', subscription_expiry: expiryDate.toISOString(), pending_utr: utrInput.trim() }).eq('id', userId)
    setSubmittingUtr(false)
    if (error) alert('Error: ' + error.message)
    else { setSubscriptionStatus('pro_pending_verification'); setSubscriptionExpiry(expiryDate.toISOString()); alert('Payment submitted for verification!'); setUtrInput('') }
  }

  const handleDeployConfig = async () => {
    if (!userId) return
    setSaveStatus('saving')
    const { error } = await supabase.from('profiles').upsert({
      id: userId, business_name: businessName, business_type: businessType, google_review_url: googleReviewUrl,
      links: destinations, business_menu: menuItems, brand_logo: brandLogoUrl, store_orders: storeOrders,
      qr_codes: qrCodesList, updated_at: new Date()
    })
    if (error) setDeployMessage('Error: ' + error.message)
    else setSaveStatus('saved')
  }

  const downloadBrandedQRCode = () => {
    if (!qrRef.current) return
    const canvas = qrRef.current
    const qrImage = canvas.toDataURL('image/png')
    const exportCanvas = document.createElement('canvas'); exportCanvas.width = 800; exportCanvas.height = 950
    const ctx = exportCanvas.getContext('2d'); if (!ctx) return

    ctx.fillStyle = '#05050a'; ctx.fillRect(0, 0, 800, 950)
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 6; ctx.strokeRect(40, 40, 720, 870)
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px monospace'; ctx.textAlign = 'center'; ctx.fillText('SCAN CIRCLE', 400, 120)
    ctx.fillStyle = '#22d3ee'; ctx.font = '18px sans-serif'; ctx.fillText('• SCAN TO UNLOCK •', 400, 160)

    const img = new Image(); img.src = qrImage
    img.onload = () => {
      ctx.drawImage(img, 180, 200, 440, 440)
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px sans-serif'; ctx.fillText(businessName, 400, 740)
      ctx.fillStyle = '#9ca3af'; ctx.font = '16px monospace'; ctx.fillText('Holographic Node Matrix', 400, 790)
      const link = document.createElement('a'); link.download = `${businessName}_QR.png`; link.href = exportCanvas.toDataURL('image/png'); link.click()
    }
  }

  const conversionRate = metrics.totalScans > 0 ? ((metrics.reviewClicks / metrics.totalScans) * 100).toFixed(1) : '0'
  const publicProfileUrl = userId ? `https://scancircle.onrender.com/router/${userId}` : ''
  const displayExpiry = subscriptionExpiry ? new Date(subscriptionExpiry).toLocaleDateString() : 'Expiring Soon (Free Tier)'

  // --------------------------------------------------------
  // FUTURISTIC UI TABS
  // --------------------------------------------------------

  const renderSocialLinksTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-white/[0.04] to-cyan-500/[0.01] p-6 rounded-3xl border border-cyan-500/20 backdrop-blur-2xl shadow-[0_0_30px_rgba(34,211,238,0.05)]">
        <div>
          <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Business Designation</label>
          <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); markAsUnsaved(); }} className="w-full px-4 py-3 bg-[#030307] border border-cyan-500/30 rounded-xl text-sm text-cyan-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono" />
        </div>
        <div>
          <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Sector Classification</label>
          <select value={businessType} onChange={(e) => { setBusinessType(e.target.value); markAsUnsaved(); }} className="w-full px-4 py-3 bg-[#030307] border border-cyan-500/30 rounded-xl text-sm text-cyan-100 focus:border-cyan-400 outline-none appearance-none font-mono">
            <option value="Cafe & Restaurant">Cafe & Restaurant</option>
            <option value="Salon & Spa">Salon & Spa</option>
            <option value="Retail & Shopping">Retail & Shopping</option>
            <option value="Fitness & Gym">Fitness & Gym</option>
            <option value="Professional Services">Professional Services</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/[0.04] to-indigo-500/[0.01] p-8 rounded-3xl border border-indigo-500/20 backdrop-blur-2xl shadow-[0_0_40px_rgba(99,102,241,0.05)]">
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Neural Link Destinations
        </h3>
        <p className="text-sm text-gray-400 mb-8 font-mono">Configure encrypted endpoints for visitor redirection matrices.</p>
        <div className="space-y-4">
          {destinations.map((dest) => {
            const isUrl = dest.title.toLowerCase().includes('facebook') || dest.title.toLowerCase().includes('youtube')
            return (
              <div key={dest.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-black/60 rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-2">Protocol Node</label>
                    <input type="text" value={dest.title} onChange={(e) => { setDestinations(destinations.map(d => d.id === dest.id ? { ...d, title: e.target.value } : d)); markAsUnsaved() }} className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-cyan-400 outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-2">{isUrl ? 'ENDPOINT URI' : 'HANDLE / DIGIT'}</label>
                    <input type={isUrl ? 'url' : 'text'} value={dest.value} onChange={(e) => { setDestinations(destinations.map(d => d.id === dest.id ? { ...d, value: e.target.value } : d)); markAsUnsaved() }} placeholder="Target vector..." className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-cyan-400 outline-none font-mono" />
                  </div>
                </div>
                <div className="pt-2 md:pt-6 flex flex-col items-center">
                  <span className={`text-[10px] font-mono uppercase mb-2 ${dest.enabled ? 'text-cyan-400' : 'text-gray-600'}`}>{dest.enabled ? 'ONLINE' : 'OFFLINE'}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={dest.enabled} onChange={(e) => { setDestinations(destinations.map(d => d.id === dest.id ? { ...d, enabled: e.target.checked } : d)); markAsUnsaved() }} className="sr-only peer" />
                    <div className="w-14 h-7 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderMenuBuilderTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-white/[0.04] to-amber-500/[0.01] p-8 rounded-3xl border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_40px_rgba(245,158,11,0.05)]">
        <h3 className="text-xl font-bold text-white mb-2">Holographic Menu Matrix</h3>
        <p className="text-sm text-gray-400 mb-8 font-mono">Segment catalog vectors into secure menu categories.</p>

        <div className="mb-8 p-6 bg-black/60 border border-white/5 rounded-2xl">
          <label className="block text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">1. Catalog Categories</label>
          <div className="flex flex-wrap gap-3 mb-6">
            {menuCategories.map((cat, idx) => (
              <div key={idx} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeMenuCategory === cat ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'}`}>
                <button onClick={() => setActiveMenuCategory(cat)} className="outline-none tracking-wider">{cat}</button>
                <button onClick={() => handleRemoveCategory(cat)} className={`font-bold hover:scale-125 transition-transform ${activeMenuCategory === cat ? 'text-black' : 'text-red-400'}`}>×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-4 max-w-md">
            <input type="text" placeholder="New Category Vector..." value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} className="flex-1 px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-amber-500 outline-none font-mono" />
            <button onClick={() => { if(newCategoryInput && !menuCategories.includes(newCategoryInput)){ setMenuCategories([...menuCategories, newCategoryInput]); setActiveMenuCategory(newCategoryInput); setNewCategoryInput(''); markAsUnsaved(); } }} className="px-5 py-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30 transition-colors">Create Category</button>
          </div>
        </div>

        {activeMenuCategory && (
          <div className="mb-8 p-6 bg-black/60 border border-white/5 rounded-2xl">
            <label className="block text-xs font-mono text-amber-400 uppercase tracking-widest mb-4">2. Inject Item to: <span className="text-white font-bold">{activeMenuCategory}</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Item Designation" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 outline-none font-mono" />
              <input type="text" placeholder="Valuation (e.g. ₹299)" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 outline-none font-mono" />
              <input type="text" placeholder="Telemetry Description" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 outline-none font-mono" />
            </div>
            <button onClick={() => { if(newItemName && newItemPrice) { setMenuItems([...menuItems, { name: newItemName, price: newItemPrice, description: newItemDesc, category: activeMenuCategory }]); setNewItemName(''); setNewItemPrice(''); setNewItemDesc(''); markAsUnsaved() } }} className="py-3 px-6 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30">
              + Inject Item Vector
            </button>
          </div>
        )}

        {activeMenuCategory && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">Active Vectors in {activeMenuCategory}</h4>
            {menuItems.filter(item => item.category === activeMenuCategory).length === 0 && <p className="text-sm text-gray-500 italic">No items found in sector.</p>}
            {menuItems.map((item, idx) => {
              if (item.category !== activeMenuCategory) return null;
              return (
                <div key={idx} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-bold text-white mt-1">{item.name} <span className="text-amber-400 font-mono ml-2">{item.price}</span></h4>
                    <p className="text-xs text-gray-400 font-mono">{item.description}</p>
                  </div>
                  <button onClick={() => handleRemoveMenuItem(menuItems.indexOf(item))} className="text-xs text-red-400 hover:text-red-300 font-mono">Purge</button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-white/[0.04] to-emerald-500/[0.01] p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.05)]">
        <h3 className="text-xl font-bold text-white mb-2">Visitor Telemetry & Metrics</h3>
        <p className="text-sm text-gray-400 mb-8 font-mono">Real-time engagement tracking across customer interaction nodes.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-black/60 border border-emerald-500/20 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Total Scans</p>
            <h4 className="text-3xl font-extrabold text-white font-mono">{metrics.totalScans}</h4>
          </div>
          <div className="p-6 bg-black/60 border border-emerald-500/20 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Repeat Scans (&gt;24h)</p>
            <h4 className="text-3xl font-extrabold text-white font-mono">{metrics.repeatScans}</h4>
          </div>
          <div className="p-6 bg-black/60 border border-emerald-500/20 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Review Conversions</p>
            <h4 className="text-3xl font-extrabold text-white font-mono">{metrics.reviewClicks}</h4>
          </div>
          <div className="p-6 bg-black/60 border border-emerald-500/20 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Conversion Ratio</p>
            <h4 className="text-3xl font-extrabold text-emerald-400 font-mono">{conversionRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  )

  const renderQRStudioTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-white/[0.04] to-cyan-500/[0.01] p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-2xl flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <span className="text-xs font-mono text-cyan-400">Node Matrix: <strong className="text-white">{qrCodesList.length}/2 Active</strong></span>
        </div>

        <div className="w-72 bg-[#030307] rounded-3xl border-2 border-cyan-400/50 flex flex-col items-center p-6 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative">
          <h3 className="text-lg font-extrabold tracking-widest text-white mb-1 font-mono">SCAN CIRCLE</h3>
          <p className="text-[10px] font-mono text-cyan-400 mb-4 tracking-wider uppercase">• QUANTUM ENCRYPTION •</p>
          <div className="w-56 h-56 bg-black rounded-2xl border border-cyan-500/30 flex items-center justify-center p-3 mb-4 shadow-inner">
            {publicProfileUrl && (
              <QRCodeCanvas 
                ref={qrRef}
                value={publicProfileUrl}
                size={180}
                bgColor="#000000"
                fgColor={qrColor}
                level="H"
                imageSettings={brandLogoUrl ? { src: brandLogoUrl, height: 50, width: 50, excavate: true } : undefined}
              />
            )}
          </div>
          <h4 className="text-sm font-bold text-white text-center truncate w-full font-mono">{businessName}</h4>
        </div>

        <button onClick={downloadBrandedQRCode} className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:opacity-90 font-mono tracking-wider">Download Holographic QR</button>
      </div>

      <div className="bg-gradient-to-br from-white/[0.04] to-cyan-500/[0.01] p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Matrix Customizer</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Upload Brand Emblem</label>
            <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:text-cyan-300 cursor-pointer font-mono" />
            {uploadingLogo && <p className="text-xs text-cyan-400 mt-2 font-mono">Syncing emblem...</p>}
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Matrix Spectrum Theme</label>
            <div className="flex gap-4">
              <button onClick={() => { setQrColor('#22d3ee'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-cyan-400 ring-2 ring-offset-2 ring-offset-[#030307] ring-cyan-400 shadow-[0_0_10px_#22d3ee]"></button>
              <button onClick={() => { setQrColor('#f59e0b'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-amber-500 shadow-[0_0_10px_#f59e0b]"></button>
              <button onClick={() => { setQrColor('#10b981'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-emerald-500 shadow-[0_0_10px_#10b981]"></button>
              <button onClick={() => { setQrColor('#ffffff'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-white shadow-[0_0_10px_#ffffff]"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPlacesSyncTab = () => (
    <div className="bg-gradient-to-br from-white/[0.04] to-fuchsia-500/[0.01] p-8 rounded-3xl border border-fuchsia-500/20 backdrop-blur-2xl animate-in fade-in duration-500 shadow-[0_0_40px_rgba(217,70,239,0.05)]">
      <h3 className="text-xl font-bold text-white mb-2">Google Places Node Sync</h3>
      <p className="text-sm text-gray-400 mb-6 font-mono">Locate and sync your official Google Review matrix.</p>
      <form onSubmit={handleGooglePlaceSearch} className="flex gap-4 mb-6">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Query exact business name..." className="flex-1 px-5 py-4 bg-[#030307] border border-white/10 rounded-2xl text-sm text-gray-200 outline-none focus:border-fuchsia-400 font-mono" />
        <button type="submit" disabled={searching} className="py-4 px-8 bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 font-bold rounded-2xl hover:bg-fuchsia-500/30 font-mono">Scan Radar</button>
      </form>
      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((place, idx) => (
            <div key={idx} className="p-4 bg-black/60 border border-white/10 rounded-2xl flex justify-between items-center">
              <div><h4 className="text-sm font-bold text-white">{place.name}</h4><p className="text-xs text-gray-400 font-mono">{place.address}</p></div>
              <button onClick={() => handleSelectPlace(place)} className="py-2 px-4 bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold rounded-xl hover:bg-fuchsia-500/30 font-mono">Sync Node</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderShopTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-white/[0.04] to-rose-500/[0.01] p-8 rounded-3xl border border-rose-500/20 backdrop-blur-2xl shadow-[0_0_40px_rgba(244,63,94,0.05)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div><h3 className="text-xl font-bold text-white mb-1">Hardware Requisition (Acrylic Stands)</h3><p className="text-sm text-gray-400 font-mono">Deploy physical NFC/QR acrylic table hardware.</p></div>
          <span className="py-1 px-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs rounded-full">₹499 / Unit (Zero Freight)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 bg-black/60 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-60 h-72 bg-[#030307] rounded-2xl border-2 border-rose-500/40 flex flex-col items-center p-4 shadow-[0_0_20px_rgba(244,63,94,0.1)] mb-4">
              <span className="text-xs font-mono text-white font-bold tracking-widest">SCAN CIRCLE</span><span className="text-[9px] text-rose-400 uppercase mb-2">• SECURE HARDWARE •</span>
              <div className="w-32 h-32 bg-black rounded-xl border border-white/10 flex items-center justify-center my-auto"><span className="text-[10px] text-gray-500 font-mono">HARDWARE QR</span></div>
              <span className="text-xs font-bold text-white truncate w-full text-center font-mono">{businessName}</span>
            </div>
            <p className="text-xs text-gray-400 font-mono text-center">Titanium-Grade Acrylic Enclosure</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-4 font-mono text-xs text-gray-300">
              <p className="mb-2">1. Transfer ₹499 via UPI to: <strong className="text-rose-400 font-bold">scancircle@axl</strong></p>
              <p>2. Input dispatch coordinates and transaction UTR below.</p>
            </div>
            <div>
              <label className="block text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">Dispatch Coordinates (Address)</label>
              <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Street, Landmark, City, Pincode..." className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-rose-400 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">Transaction UTR</label>
              <input type="text" value={shopUtr} onChange={(e) => setShopUtr(e.target.value)} placeholder="12-digit UTR reference" className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-rose-400 font-mono" />
            </div>
            <button onClick={handleOrderTableStand} disabled={orderingStand} className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:opacity-90 disabled:opacity-50 mt-2 font-mono">
              {orderingStand ? 'Transmitting Order...' : 'Dispatch Requisition (₹499)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSubscriptionTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-white/[0.04] to-cyan-500/[0.01] p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.05)]">
        <h3 className="text-xl font-bold text-white mb-1">Quantum Cloud Subscription</h3>
        <p className="text-sm font-semibold text-cyan-300 italic mb-6 font-mono">"This will cost around 1 cup of Tea everyday ☕ • ₹399 / Month"</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-6 bg-black/60 border border-white/5 rounded-3xl text-center flex flex-col items-center">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">Scan Gateway (₹399 / 30 Days)</span>
            <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center justify-center mb-4">
              <img src="/payment-qr.png" alt="Payment QR" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs font-mono text-gray-300">UPI: <strong className="text-cyan-300 font-bold">scancircle@axl</strong></p>
              <button onClick={() => { navigator.clipboard.writeText('scancircle@axl'); alert('Copied!'); }} className="py-1 px-2.5 bg-white/10 hover:bg-white/20 text-cyan-400 rounded-lg text-[10px] font-mono">Copy</button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Node Status</p>
                <h4 className="text-sm font-bold text-white uppercase mt-0.5 font-mono">{subscriptionStatus}</h4>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Lease Expiry</p>
                 <h4 className="text-sm font-bold text-white mt-0.5 font-mono">{displayExpiry}</h4>
              </div>
            </div>
            <div className="bg-black/60 p-6 rounded-2xl border border-white/5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">Transaction UTR Reference</label>
                <input type="text" value={utrInput} onChange={(e) => setUtrInput(e.target.value)} placeholder="12-Digit UTR" className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-cyan-400 font-mono" />
              </div>
              <button onClick={handleSubmitUtr} disabled={submittingUtr} className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-bold text-xs rounded-xl hover:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 font-mono tracking-wide">
                {submittingUtr ? 'Verifying Node...' : 'Authenticate Lease (UTR)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // --------------------------------------------------------
  // MASTER FUTURISTIC RENDER
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#030307] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Cyberpunk Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a16_1px,transparent_1px),linear-gradient(to_bottom,#0a0a16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
      
      {/* Sidebar Command Center */}
      <aside className="w-full md:w-72 bg-black/40 border-r border-cyan-500/10 flex flex-col backdrop-blur-2xl z-20">
        <div className="p-8 border-b border-cyan-500/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <h2 className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-mono">SCAN_CIRCLE</h2>
          </div>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Neural Control Plane v2.4</p>
        </div>
        
        <nav className="p-6 space-y-2.5 flex-1 flex flex-col font-mono text-xs">
          <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'destinations' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// Social Links</button>
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'menu' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// Menu Matrix</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// Telemetry</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'qr' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// QR Studio</button>
          <button onClick={() => setActiveTab('places')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'places' ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// Google Places</button>
          <button onClick={() => setActiveTab('shop')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'shop' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// Hardware Store</button>
          
          <div className="mt-auto pt-4 border-t border-white/5">
            <button onClick={() => setActiveTab('subscription')} className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all ${activeTab === 'subscription' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-gray-400 hover:bg-white/5'}`}>// Subscription & Billing</button>
          </div>
        </nav>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1 font-mono flex items-center gap-3">
                COMMAND_CENTER
                <span className="text-[10px] font-mono px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full">SECURE_NODE</span>
              </h1>
              <p className="text-gray-400 text-xs font-mono">Manage neural endpoints, protocol menus, and hardware leasing.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1">
                {saveStatus === 'saved' ? (
                  <button onClick={handleDeployConfig} className="py-3 px-8 bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 border border-emerald-400/40 cursor-default">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>SYSTEM SAVED
                  </button>
                ) : (
                  <button onClick={handleDeployConfig} disabled={saveStatus === 'saving'} className="py-3 px-8 bg-gradient-to-r from-cyan-400 to-indigo-500 text-black text-xs font-mono font-bold rounded-xl hover:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50">
                    {saveStatus === 'saving' ? 'UPLOADING...' : 'SAVE CHANGES'}
                  </button>
                )}
                {deployMessage && <span className="text-[10px] font-mono text-cyan-400">{deployMessage}</span>}
              </div>

              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="w-12 h-12 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center justify-center hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#030307] border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-30 font-mono">
                    <div className="px-1 py-1 border-b border-white/5"><p className="text-xs font-bold text-white truncate">{businessName}</p><p className="text-[10px] text-gray-400 truncate mt-0.5">{userEmail}</p></div>
                    <div className="px-1 py-1 border-b border-white/5 space-y-1 my-2"><p className="text-[9px] text-cyan-400 uppercase">Node Matrix</p><p className="text-xs font-bold text-white">{qrCodesList.length} / 2 QRs Active</p></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">Terminate Session</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {activeTab === 'destinations' && renderSocialLinksTab()}
          {activeTab === 'menu' && renderMenuBuilderTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'qr' && renderQRStudioTab()}
          {activeTab === 'places' && renderPlacesSyncTab()}
          {activeTab === 'shop' && renderShopTab()}
          {activeTab === 'subscription' && renderSubscriptionTab()}
          
        </div>
      </main>
    </div>
  )
}