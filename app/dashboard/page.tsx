'use class'

'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { QRCodeCanvas } from 'qrcode.react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('destinations')
  const [userId, setUserId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('My Business Name')
  const [businessType, setBusinessType] = useState('Cafe & Restaurant')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ name: string; address: string; reviewUrl: string }>>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deployMessage, setDeployMessage] = useState('')
  
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
      if (user) {
        setUserId(user.id)
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          if (data.business_name) setBusinessName(data.business_name)
          if (data.business_type) setBusinessType(data.business_type)
          if (data.google_review_url) setGoogleReviewUrl(data.google_review_url)
          if (data.links) setDestinations(data.links)
        }
      }
    }
    loadUserData()
  }, [])

  // Google Places Search Handler (Simulated or connected via API)
  const handleGooglePlaceSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)

    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()

      if (data.results) {
        const formattedResults = data.results.map((place: any) => ({
          name: place.name,
          address: place.formatted_address,
          reviewUrl: `https://search.google.com/local/writereview?placeid=${place.place_id}`
        }))
        setSearchResults(formattedResults)
      } else {
        setSearchResults([])
      }
      setSearching(false)
    } catch (error) {
      console.error('Search error:', error)
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
    if (!userId) {
      setDeployMessage('Error: Not authenticated')
      return
    }
    setSaving(true)
    setDeployMessage('')

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      business_name: businessName,
      business_type: businessType,
      google_review_url: googleReviewUrl,
      links: destinations,
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
    setDestinations(destinations.map(dest => 
      dest.id === id ? { ...dest, [field]: value } : dest
    ))
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

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      
      <aside className="w-full md:w-72 bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-2xl z-10">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Scan Circle
          </h2>
          <p className="text-xs text-cyan-500/70 mt-2 font-mono tracking-wider uppercase">Nexus Hub v2.0</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-1">
          <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'destinations' ? 'bg-gradient-to-r from-cyan-500/10 text-cyan-300 border-l-2 border-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}>Neural Links</button>
          <button onClick={() => setActiveTab('qr')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-gradient-to-r from-indigo-500/10 text-indigo-300 border-l-2 border-indigo-400' : 'text-gray-400 hover:bg-white/5'}`}>QR Matrix Engine</button>
          <button onClick={() => setActiveTab('places')} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${activeTab === 'places' ? 'bg-gradient-to-r from-fuchsia-500/10 text-fuchsia-300 border-l-2 border-fuchsia-400' : 'text-gray-400 hover:bg-white/5'}`}>Global Sync</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">Command Center</h1>
              <p className="text-gray-400 text-sm font-mono">SYS.STATUS: <span className="text-emerald-400">ONLINE</span></p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={handleDeployConfig}
                disabled={saving}
                className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
              >
                {saving ? 'Deploying...' : 'Deploy Configuration'}
              </button>
              {deployMessage && <span className="text-xs font-mono text-cyan-400">{deployMessage}</span>}
            </div>
          </header>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Business Name</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="My Business Name"
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Business Category</label>
              <select 
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 shadow-inner appearance-none"
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
                            <input 
                              type="text" 
                              value={dest.title}
                              onChange={(e) => handleUpdateDestination(dest.id, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 shadow-inner"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2">{inputConfig.label}</label>
                            <input 
                              type={inputConfig.type} 
                              value={dest.value}
                              onChange={(e) => handleUpdateDestination(dest.id, 'value', e.target.value)}
                              placeholder={inputConfig.placeholder}
                              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 shadow-inner placeholder-gray-600"
                            />
                          </div>
                        </div>
                        <div className="pt-2 md:pt-6">
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
                
                <button onClick={handleAddDestination} className="mt-8 text-sm font-medium text-cyan-400 hover:text-cyan-300">
                  Initialize New Vector
                </button>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-72 h-72 bg-[#05050a] rounded-3xl border border-white/10 flex items-center justify-center mb-8 relative p-6">
                  {publicProfileUrl ? (
                    <QRCodeCanvas 
                      ref={qrRef}
                      value={publicProfileUrl}
                      size={200}
                      bgColor="#05050a"
                      fgColor={getQRColorHex(qrColor)}
                      level="H"
                      includeMargin={false}
                    />
                  ) : (
                    <span className="text-xs font-mono text-gray-500">Loading Matrix URL...</span>
                  )}
                </div>
                
                <button onClick={downloadQRCode} className="w-full py-4 px-6 bg-white/5 border border-indigo-500/30 text-indigo-300 font-bold rounded-xl hover:bg-indigo-500/20">
                  Extract Holographic Matrix
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <h3 className="text-xl font-semibold text-white mb-8">Matrix Configuration</h3>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Spectrum Override</label>
                      <div className="flex gap-4">
                        <button onClick={() => setQrColor('white')} className={`w-10 h-10 rounded-full bg-white ${qrColor === 'white' ? 'ring-2 ring-white' : ''}`}></button>
                        <button onClick={() => setQrColor('cyan')} className={`w-10 h-10 rounded-full bg-cyan-400 ${qrColor === 'cyan' ? 'ring-2 ring-cyan-400' : ''}`}></button>
                        <button onClick={() => setQrColor('fuchsia')} className={`w-10 h-10 rounded-full bg-fuchsia-500 ${qrColor === 'fuchsia' ? 'ring-2 ring-fuchsia-500' : ''}`}></button>
                        <button onClick={() => setQrColor('emerald')} className={`w-10 h-10 rounded-full bg-emerald-400 ${qrColor === 'emerald' ? 'ring-2 ring-emerald-400' : ''}`}></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'places' && (
            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Global Satellite Link (Google Places Sync)</h3>
              <p className="text-sm text-gray-400 mb-6">Search your business name to automatically locate and sync your official Google Review coordinates.</p>
              
              <form onSubmit={handleGooglePlaceSearch} className="flex gap-4 mb-6">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter exact business name or location..."
                  className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={searching}
                  className="py-4 px-8 bg-white/5 border border-fuchsia-500/30 text-fuchsia-300 font-bold rounded-2xl hover:bg-fuchsia-500/20 transition-all disabled:opacity-50"
                >
                  {searching ? 'Scanning...' : 'Search Place'}
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Select Your Establishment:</p>
                  {searchResults.map((place, idx) => (
                    <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{place.name}</h4>
                        <p className="text-xs text-gray-400">{place.address}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className="py-2 px-4 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-xl hover:bg-cyan-500/30 transition-all"
                      >
                        Sync Location
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {googleReviewUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">Active Synced Review URL:</p>
                  <p className="text-xs text-gray-300 break-all">{googleReviewUrl}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}