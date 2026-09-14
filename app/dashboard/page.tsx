'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('destinations')
  
  // New State for Business Identity
  const [businessName, setBusinessName] = useState('My Business Name')
  
  // State for Links
  const [destinations, setDestinations] = useState([
    { id: 1, title: 'Facebook', value: '', type: 'social', enabled: true },
    { id: 2, title: 'WhatsApp', value: '', type: 'social', enabled: true },
    { id: 3, title: 'Instagram', value: '', type: 'social', enabled: true },
    { id: 4, title: 'YouTube', value: '', type: 'social', enabled: true },
    { id: 5, title: 'Twitter', value: '', type: 'social', enabled: true },
  ])

  // State for QR Studio
  const [qrColor, setQrColor] = useState('white')
  const [qrStyle, setQrStyle] = useState('Geometric Square')
  const qrRef = useRef<HTMLCanvasElement>(null)

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

  // Automatically embed the custom business name into the QR code link via query parameter
  const encodedBusinessName = encodeURIComponent(businessName)
  const publicProfileUrl = `https://scancircle.onrender.com/router/demo?business=${encodedBusinessName}`

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Ambient Futuristic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none"></div>

      {/* Glass Sidebar */}
      <aside className="w-full md:w-72 bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-2xl z-10">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Scan Circle
          </h2>
          <p className="text-xs text-cyan-500/70 mt-2 font-mono tracking-wider uppercase">Nexus Hub v2.0</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-1">
          <button 
            onClick={() => setActiveTab('destinations')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${activeTab === 'destinations' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 text-cyan-300 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            Neural Links
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${activeTab === 'qr' ? 'bg-gradient-to-r from-indigo-500/10 to-transparent border-l-2 border-indigo-400 text-indigo-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            QR Matrix Engine
          </button>
          <button 
            onClick={() => setActiveTab('places')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${activeTab === 'places' ? 'bg-gradient-to-r from-fuchsia-500/10 to-transparent border-l-2 border-fuchsia-400 text-fuchsia-300 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            Global Sync
          </button>
        </nav>
      </aside>

      {/* Main Holographic Canvas */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          
          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">Command Center</h1>
              <p className="text-gray-400 text-sm font-mono">SYS.STATUS: <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">ONLINE</span></p>
            </div>
            <button className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Deploy Configuration
            </button>
          </header>

          {/* Business Identity Configuration Card */}
          <div className="mb-8 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Establishment / Business Name</label>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name..."
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>

          {/* Links & Menus Tab */}
          {activeTab === 'destinations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <h3 className="text-xl font-semibold text-white">Active Routing Array</h3>
                </div>
                
                <div className="space-y-4">
                  {destinations.map((dest) => {
                    const inputConfig = getTargetConfig(dest.title)
                    return (
                      <div key={dest.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors duration-300 group">
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Parameter ID</label>
                            <input 
                              type="text" 
                              value={dest.title}
                              onChange={(e) => handleUpdateDestination(dest.id, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-cyan-500/70 uppercase tracking-widest mb-2">{inputConfig.label}</label>
                            <input 
                              type={inputConfig.type} 
                              value={dest.value}
                              onChange={(e) => handleUpdateDestination(dest.id, 'value', e.target.value)}
                              placeholder={inputConfig.placeholder}
                              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 transition-all shadow-inner placeholder-gray-600"
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
                
                <button 
                  onClick={handleAddDestination}
                  className="mt-8 flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Initialize New Vector
                </button>
              </div>
            </div>
          )}

          {/* QR Studio Tab */}
          {activeTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-72 h-72 bg-[#05050a] rounded-3xl border border-white/10 flex items-center justify-center mb-8 relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden p-6">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_15px_#6366f1] animate-[ping_3s_ease-in-out_infinite] opacity-50 z-0"></div>
                  
                  <div className={`relative z-10 p-2 bg-[#05050a] transition-all duration-500 ${qrStyle === 'Orbital Rounded' ? 'rounded-2xl' : 'rounded-none'}`}>
                    <QRCodeCanvas 
                      ref={qrRef}
                      value={publicProfileUrl}
                      size={200}
                      bgColor="#05050a"
                      fgColor={getQRColorHex(qrColor)}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
                
                <button 
                  onClick={downloadQRCode}
                  className="w-full py-4 px-6 bg-white/5 border border-indigo-500/30 text-indigo-300 font-bold tracking-wide rounded-xl hover:bg-indigo-500/20 hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                >
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
                        <button onClick={() => setQrColor('white')} className={`w-10 h-10 rounded-full bg-white transition-all ${qrColor === 'white' ? 'ring-2 ring-offset-4 ring-offset-[#05050a] ring-white' : 'hover:scale-110'}`}></button>
                        <button onClick={() => setQrColor('cyan')} className={`w-10 h-10 rounded-full bg-cyan-400 transition-all ${qrColor === 'cyan' ? 'ring-2 ring-offset-4 ring-offset-[#05050a] ring-cyan-400' : 'hover:scale-110'}`}></button>
                        <button onClick={() => setQrColor('fuchsia')} className={`w-10 h-10 rounded-full bg-fuchsia-500 transition-all ${qrColor === 'fuchsia' ? 'ring-2 ring-offset-4 ring-offset-[#05050a] ring-fuchsia-500' : 'hover:scale-110'}`}></button>
                        <button onClick={() => setQrColor('emerald')} className={`w-10 h-10 rounded-full bg-emerald-400 transition-all ${qrColor === 'emerald' ? 'ring-2 ring-offset-4 ring-offset-[#05050a] ring-emerald-400' : 'hover:scale-110'}`}></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Geometry Structure</label>
                      <select 
                        value={qrStyle}
                        onChange={(e) => setQrStyle(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500 appearance-none"
                      >
                        <option>Geometric Square</option>
                        <option>Orbital Rounded</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Places Tab */}
          {activeTab === 'places' && (
            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Global Satellite Link</h3>
              <p className="text-sm text-gray-400 mb-8">Establish a geospatial link to sync physical coordinate metadata.</p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Enter location coordinates or nomenclature..."
                  className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500 shadow-inner"
                />
                <button className="py-4 px-8 bg-white/5 border border-fuchsia-500/30 text-fuchsia-300 font-bold rounded-2xl hover:bg-fuchsia-500/20 hover:text-white transition-all">
                  Scan Coordinates
                </button>
              </div>
              
              <div className="p-12 text-center border border-dashed border-fuchsia-500/30 rounded-2xl bg-fuchsia-500/[0.02]">
                <p className="text-sm font-mono text-fuchsia-400/70 animate-pulse">WAITING FOR SATELLITE HANDSHAKE...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}