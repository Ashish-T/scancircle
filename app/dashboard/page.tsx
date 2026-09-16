'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { QRCodeCanvas } from 'qrcode.react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

  // Fixed logout redirects straight to login page
  const handleLogout = async () => { 
    await supabase.auth.signOut()
    router.push('/login') 
  }

  const markAsUnsaved = () => { if (saveStatus === 'saved') setSaveStatus('idle') }

  // --------------------------------------------------------
  // HELPER FUNCTIONS
  // --------------------------------------------------------

  const handleRemoveCategory = (catToRemove: string) => {
    if (confirm(`Are you sure you want to delete the category "${catToRemove}" and all items inside it?`)) {
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

      if (uploadError) {
        alert('Error uploading logo: ' + uploadError.message)
        setUploadingLogo(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(fileName)
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
    if (!shippingAddress.trim() || !shopUtr.trim()) {
      alert('Please enter both your Delivery Address and Payment UTR.')
      return
    }

    setOrderingStand(true)
    const newOrder: OrderItem = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      item: 'Acrylic Table Stand with QR',
      quantity: 1,
      amount: '₹499',
      date: new Date().toLocaleDateString(),
      status: 'Payment Verification Pending',
      utr: shopUtr.trim(),
      address: shippingAddress.trim()
    }

    const updatedOrders = [newOrder, ...storeOrders]
    const { error } = await supabase.from('profiles').update({ store_orders: updatedOrders }).eq('id', userId)

    if (error) {
      alert('Error placing order: ' + error.message)
    } else {
      setStoreOrders(updatedOrders)
      setShippingAddress('')
      setShopUtr('')
      alert('Order placed successfully! We will dispatch the stand after payment verification.')
    }
    setOrderingStand(false)
  }

  const handleSubmitUtr = async () => {
    if (!utrInput.trim() || !userId) {
      alert('Please enter your UPI Transaction ID (UTR).')
      return
    }

    setSubmittingUtr(true)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // Set validity to 30 Days

    const { error } = await supabase.from('profiles').update({
      subscription_status: 'pro_pending_verification',
      subscription_expiry: expiryDate.toISOString(),
      pending_utr: utrInput.trim()
    }).eq('id', userId)

    setSubmittingUtr(false)
    if (error) {
      alert('Failed to submit UTR: ' + error.message)
    } else {
      setSubscriptionStatus('pro_pending_verification')
      setSubscriptionExpiry(expiryDate.toISOString())
      alert('Payment reference submitted successfully! Verification usually takes less than 30 minutes.')
      setUtrInput('')
    }
  }

  const handleDeployConfig = async () => {
    if (!userId) return
    setSaveStatus('saving')
    const { error } = await supabase.from('profiles').upsert({
      id: userId, business_name: businessName, business_type: businessType, google_review_url: googleReviewUrl,
      links: destinations, business_menu: menuItems, brand_logo: brandLogoUrl, store_orders: storeOrders,
      qr_codes: qrCodesList, updated_at: new Date()
    })
    if (error) setDeployMessage('Failed to save: ' + error.message)
    else setSaveStatus('saved')
  }

  const downloadBrandedQRCode = () => {
    if (!qrRef.current) return
    const canvas = qrRef.current
    const qrImage = canvas.toDataURL('image/png')

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = 800
    exportCanvas.height = 950
    const ctx = exportCanvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, 800, 950)

    ctx.strokeStyle = qrColor
    ctx.lineWidth = 6
    ctx.strokeRect(40, 40, 720, 870)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('SCAN CIRCLE', 400, 120)

    ctx.fillStyle = qrColor
    ctx.font = '18px sans-serif'
    ctx.fillText('• Scan to Unlock •', 400, 160)

    const img = new Image()
    img.src = qrImage
    img.onload = () => {
      ctx.drawImage(img, 180, 200, 440, 440)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px sans-serif'
      ctx.fillText(businessName, 400, 740)

      ctx.fillStyle = '#9ca3af'
      ctx.font = '16px monospace'
      ctx.fillText('Powered by Scan Circle', 400, 790)

      const link = document.createElement('a')
      link.download = `${businessName.replace(/\s+/g, '_')}_ScanCircle_QR.png`
      link.href = exportCanvas.toDataURL('image/png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const conversionRate = metrics.totalScans > 0 ? ((metrics.reviewClicks / metrics.totalScans) * 100).toFixed(1) : '0'
  const publicProfileUrl = userId ? `https://scancircle.onrender.com/router/${userId}` : ''
  const displayExpiry = subscriptionExpiry ? new Date(subscriptionExpiry).toLocaleDateString() : 'Expiring Soon (Free Trial)'

  // --------------------------------------------------------
  // UI RENDER COMPONENTS
  // --------------------------------------------------------

  const renderSocialLinksTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-lg">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Business Name</label>
          <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); markAsUnsaved(); }} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-cyan-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">Nature of Business (Category)</label>
          <select value={businessType} onChange={(e) => { setBusinessType(e.target.value); markAsUnsaved(); }} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-cyan-500 outline-none appearance-none">
            <option value="Cafe & Restaurant">Cafe & Restaurant</option>
            <option value="Salon & Spa">Salon & Spa</option>
            <option value="Retail & Shopping">Retail & Shopping</option>
            <option value="Fitness & Gym">Fitness & Gym</option>
            <option value="Professional Services">Professional Services</option>
          </select>
        </div>
      </div>

      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-2">Social Links & Destinations</h3>
        <p className="text-sm text-gray-400 mb-8">Configure the links that customers will see when they scan your QR code.</p>
        <div className="space-y-4">
          {destinations.map((dest) => {
            const isUrl = dest.title.toLowerCase().includes('facebook') || dest.title.toLowerCase().includes('youtube')
            return (
              <div key={dest.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Platform Name</label>
                    <input type="text" value={dest.title} onChange={(e) => { setDestinations(destinations.map(d => d.id === dest.id ? { ...d, title: e.target.value } : d)); markAsUnsaved() }} className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-cyan-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">{isUrl ? 'URL LINK' : 'USERNAME / NUMBER'}</label>
                    <input type={isUrl ? 'url' : 'text'} value={dest.value} onChange={(e) => { setDestinations(destinations.map(d => d.id === dest.id ? { ...d, value: e.target.value } : d)); markAsUnsaved() }} placeholder="..." className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-cyan-500 outline-none" />
                  </div>
                </div>
                <div className="pt-2 md:pt-6 flex flex-col items-center">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-2">{dest.enabled ? 'Active' : 'Disabled'}</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={dest.enabled} onChange={(e) => { setDestinations(destinations.map(d => d.id === dest.id ? { ...d, enabled: e.target.checked } : d)); markAsUnsaved() }} className="sr-only peer" />
                    <div className="w-14 h-7 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500"></div>
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
      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-2">Digital Menu Builder</h3>
        <p className="text-sm text-gray-400 mb-8">Create categories first, then select a category to add items to it.</p>

        {/* Category Manager */}
        <div className="mb-8 p-6 bg-black/30 border border-white/5 rounded-2xl">
          <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">1. Menu Categories</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {menuCategories.map((cat, idx) => (
              <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeMenuCategory === cat ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                <button onClick={() => setActiveMenuCategory(cat)} className="outline-none">{cat}</button>
                <button onClick={() => handleRemoveCategory(cat)} className={`ml-2 font-bold hover:scale-125 transition-transform ${activeMenuCategory === cat ? 'text-black' : 'text-red-400'}`}>×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-4 max-w-md">
            <input type="text" placeholder="New Category (e.g. Desserts)" value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} className="flex-1 px-4 py-2.5 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:border-amber-500 outline-none" />
            <button onClick={() => { if(newCategoryInput && !menuCategories.includes(newCategoryInput)){ setMenuCategories([...menuCategories, newCategoryInput]); setActiveMenuCategory(newCategoryInput); setNewCategoryInput(''); markAsUnsaved(); } }} className="px-5 py-2.5 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30 transition-colors">+ Add Category</button>
          </div>
        </div>

        {/* Item Adder */}
        {activeMenuCategory && (
          <div className="mb-8 p-6 bg-black/30 border border-white/5 rounded-2xl">
            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">2. Add Item to: <span className="text-white">{activeMenuCategory}</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Item Name (e.g. Latte)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 outline-none" />
              <input type="text" placeholder="Price (e.g. $4.00)" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 outline-none" />
              <input type="text" placeholder="Description (Optional)" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 outline-none" />
            </div>
            <button onClick={() => { if(newItemName && newItemPrice) { setMenuItems([...menuItems, { name: newItemName, price: newItemPrice, description: newItemDesc, category: activeMenuCategory }]); setNewItemName(''); setNewItemPrice(''); setNewItemDesc(''); markAsUnsaved() } }} className="py-2.5 px-6 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl hover:bg-amber-500/30">
              + Add Item to {activeMenuCategory}
            </button>
          </div>
        )}

        {/* Filtered Item List */}
        {activeMenuCategory && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">Items in {activeMenuCategory}</h4>
            {menuItems.filter(item => item.category === activeMenuCategory).length === 0 && <p className="text-sm text-gray-500 italic">No items in this category yet.</p>}
            {menuItems.map((item, idx) => {
              if (item.category !== activeMenuCategory) return null;
              return (
                <div key={idx} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
                  <div>
                    <h4 className="text-sm font-bold text-white mt-1">{item.name} <span className="text-cyan-400 font-mono ml-2">{item.price}</span></h4>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <button onClick={() => handleRemoveMenuItem(menuItems.indexOf(item))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
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

        {/* Restored Specific Social Link Metrics */}
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
  )

  const renderQRStudioTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <span className="text-xs text-gray-400">Active Scanners: <strong className="text-cyan-400">{qrCodesList.length}/2</strong></span>
        </div>

        {/* Standard Matrix QR with Resized Center Logo */}
        <div className="w-72 bg-[#0a0a0f] rounded-3xl border-2 border-cyan-500/40 flex flex-col items-center p-6 mb-6 shadow-2xl relative">
          <h3 className="text-lg font-extrabold tracking-widest text-white mb-1 font-mono">SCAN CIRCLE</h3>
          <p className="text-[11px] font-medium text-cyan-400 mb-4 tracking-wider uppercase">• Scan to Unlock •</p>
          <div className="w-56 h-56 bg-[#05050a] rounded-2xl border border-white/10 flex items-center justify-center p-3 mb-4 shadow-inner">
            {publicProfileUrl && (
              <QRCodeCanvas 
                ref={qrRef}
                value={publicProfileUrl}
                size={180}
                bgColor="#05050a"
                fgColor={qrColor}
                level="H"
                imageSettings={brandLogoUrl ? { src: brandLogoUrl, height: 50, width: 50, excavate: true } : undefined}
              />
            )}
          </div>
          <h4 className="text-sm font-bold text-white text-center truncate w-full">{businessName}</h4>
        </div>

        <button onClick={downloadBrandedQRCode} className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:opacity-90">Download Branded QR</button>
      </div>

      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-white mb-6">QR Customizer & Logo</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Upload Brand Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-cyan-500/20 file:text-cyan-300 cursor-pointer" />
            {uploadingLogo && <p className="text-xs text-cyan-400 mt-2 font-mono">Uploading...</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-3">Matrix Color Theme</label>
            <div className="flex gap-4">
              <button onClick={() => { setQrColor('#22d3ee'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-cyan-400 ring-2 ring-offset-2 ring-offset-[#05050a] ring-cyan-400"></button>
              <button onClick={() => { setQrColor('#f59e0b'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-amber-500"></button>
              <button onClick={() => { setQrColor('#10b981'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-emerald-500"></button>
              <button onClick={() => { setQrColor('#ffffff'); markAsUnsaved(); }} className="w-10 h-10 rounded-xl bg-white"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPlacesSyncTab = () => (
    <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold text-white mb-2">Google Places Sync</h3>
      <p className="text-sm text-gray-400 mb-6">Search your business name to automatically locate and sync your official Google Review page.</p>
      <form onSubmit={handleGooglePlaceSearch} className="flex gap-4 mb-6">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter exact business name..." className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-sm text-gray-200 outline-none focus:border-fuchsia-500" />
        <button type="submit" disabled={searching} className="py-4 px-8 bg-white/5 border border-fuchsia-500/30 text-fuchsia-300 font-bold rounded-2xl hover:bg-fuchsia-500/10">Search Place</button>
      </form>
      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((place, idx) => (
            <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex justify-between items-center">
              <div><h4 className="text-sm font-bold text-white">{place.name}</h4><p className="text-xs text-gray-400">{place.address}</p></div>
              <button onClick={() => handleSelectPlace(place)} className="py-2 px-4 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-xl hover:bg-cyan-500/30">Sync Location</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderShopTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div><h3 className="text-xl font-semibold text-white mb-1">Hardware Store (Acrylic Table Stands)</h3><p className="text-sm text-gray-400">Order professional stands with your custom Scan Circle QR pre-printed.</p></div>
          <span className="py-1 px-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs rounded-full">₹499 per Stand (Free Delivery)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-60 h-72 bg-[#0a0a0f] rounded-2xl border-2 border-cyan-500/40 flex flex-col items-center p-4 shadow-xl mb-4">
              <span className="text-xs font-mono text-white font-bold tracking-widest">SCAN CIRCLE</span><span className="text-[9px] text-cyan-400 uppercase mb-2">• Scan to Unlock •</span>
              <div className="w-32 h-32 bg-black rounded-xl border border-white/10 flex items-center justify-center my-auto overflow-hidden"><span className="text-[10px] text-gray-500 font-mono">Your QR Matrix</span></div>
              <span className="text-xs font-bold text-white truncate w-full text-center">{businessName}</span>
            </div>
            <p className="text-xs text-gray-400 font-mono text-center">Premium White Acrylic Stand</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-4">
              <p className="text-xs text-gray-300 font-mono mb-2">1. Pay ₹499 via UPI to: <strong className="text-rose-400 font-bold">scancircle@axl</strong></p>
              <p className="text-xs text-gray-300 font-mono">2. Enter your Shipping Address & 12-Digit UTR below to confirm order.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Delivery Shipping Address</label>
              <textarea rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Full street address, landmark, city..." className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Payment UTR (Transaction ID)</label>
              <input type="text" value={shopUtr} onChange={(e) => setShopUtr(e.target.value)} placeholder="e.g. 435678912345" className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-rose-500" />
            </div>
            <button onClick={handleOrderTableStand} disabled={orderingStand} className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:opacity-90 disabled:opacity-50 mt-2">
              {orderingStand ? 'Saving Order...' : 'Place Order (₹499)'}
            </button>
          </div>
        </div>

        {storeOrders.length > 0 && (
          <div className="mt-8 pt-8 border-t border-white/5">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Your Order History</h4>
            <div className="space-y-3">
              {storeOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-xs font-mono text-cyan-400">{ord.id} <span className="text-gray-400 ml-2">({ord.date})</span></p>
                    <h5 className="text-sm font-bold text-white mt-0.5">{ord.item}</h5>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">{ord.status}</span>
                    <span className="font-mono text-white font-bold">{ord.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSubscriptionTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-2">Subscription & Billing</h3>
        <p className="text-sm font-semibold text-rose-300 italic mb-6">"This will cost around 1 cup of Tea everyday ☕"</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-6 bg-black/40 border border-white/5 rounded-3xl text-center flex flex-col items-center">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">Scan to Pay via Any UPI App (₹399 / Month)</span>
            <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.2)] flex items-center justify-center mb-4">
              <img src="/payment-qr.png" alt="Payment QR" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs font-mono text-gray-300">UPI ID: <strong className="text-cyan-300 font-bold">scancircle@axl</strong></p>
              <button onClick={() => { navigator.clipboard.writeText('scancircle@axl'); alert('Copied!'); }} className="py-1 px-2.5 bg-white/10 hover:bg-white/20 text-cyan-400 rounded-lg text-[10px] font-mono">Copy</button>
            </div>
            <p className="text-[11px] text-gray-500 font-mono mt-2">Supports GPay, PhonePe, Paytm & BHIM</p>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Account Tier</p>
                <h4 className="text-sm font-bold text-white uppercase mt-0.5">{subscriptionStatus}</h4>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Valid Until</p>
                 <h4 className="text-sm font-bold text-white mt-0.5">{displayExpiry}</h4>
              </div>
            </div>
            <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Enter 12-Digit UPI Transaction ID (UTR)</label>
                <input type="text" value={utrInput} onChange={(e) => setUtrInput(e.target.value)} placeholder="e.g. 435678912345" className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:border-cyan-500 font-mono" />
              </div>
              <button onClick={handleSubmitUtr} disabled={submittingUtr} className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl hover:from-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50">
                {submittingUtr ? 'Submitting...' : 'Submit Payment Reference (UTR)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // --------------------------------------------------------
  // MASTER RENDER
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-2xl z-20">
        <div className="p-8 border-b border-white/5">
          {/* Logo link directs to Dashboard when logged in */}
          <Link href="/dashboard" className="flex flex-col focus:outline-none group">
            <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 group-hover:opacity-80 transition-opacity">Scan Circle</h2>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Business Control Panel</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-1 flex flex-col">
          <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'destinations' ? 'bg-gradient-to-r from-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}>Social Links</button>
          <button onClick={() => setActiveTab('menu')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'menu' ? 'bg-gradient-to-r from-amber-500/15 text-amber-300 border-l-2 border-amber-400' : 'text-gray-400 hover:bg-white/5'}`}>Menu / Rate Card</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-gradient-to-r from-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400' : 'text-gray-400 hover:bg-white/5'}`}>Analytics & Insights</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-gradient-to-r from-indigo-500/15 text-indigo-300 border-l-2 border-indigo-400' : 'text-gray-400 hover:bg-white/5'}`}>QR Code Studio</button>
          <button onClick={() => setActiveTab('places')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'places' ? 'bg-gradient-to-r from-fuchsia-500/15 text-fuchsia-300 border-l-2 border-fuchsia-400' : 'text-gray-400 hover:bg-white/5'}`}>Google Places Sync</button>
          <button onClick={() => setActiveTab('shop')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'shop' ? 'bg-gradient-to-r from-rose-500/15 text-rose-300 border-l-2 border-rose-400' : 'text-gray-400 hover:bg-white/5'}`}>Shop (Table Stands)</button>
          
          <div className="mt-auto pt-4 border-t border-white/5">
            <button onClick={() => setActiveTab('subscription')} className={`w-full flex items-start px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'subscription' ? 'bg-gradient-to-r from-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}>Subscription & Billing</button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage your links, digital menus, subscriptions, and hardware.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1">
                {saveStatus === 'saved' ? (
                  <button onClick={handleDeployConfig} className="py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-default">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>Saved
                  </button>
                ) : (
                  <button onClick={handleDeployConfig} disabled={saveStatus === 'saving'} className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50">
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
                {deployMessage && <span className="text-xs font-mono text-cyan-400">{deployMessage}</span>}
              </div>

              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] hover:border-cyan-500/40">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#0d0d14] border border-white/10 rounded-2xl p-4 shadow-2xl z-30">
                    <div className="px-1 py-1 border-b border-white/5"><p className="text-xs font-bold text-white truncate">{businessName}</p><p className="text-xs text-gray-400 truncate mt-0.5">{userEmail}</p></div>
                    <div className="px-1 py-1 border-b border-white/5 space-y-1"><p className="text-[10px] font-mono text-cyan-400 uppercase">Active QR Allocation</p><p className="text-xs font-bold text-white">{qrCodesList.length} / 2 QR Codes</p></div>
                    {/* Fixed logout redirects to /login */}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 mt-2">Secure Logout</button>
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