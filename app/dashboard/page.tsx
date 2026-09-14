'use client'

import { useState } from 'react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('destinations')
  const [destinations, setDestinations] = useState([
    { id: 1, title: 'Facebook', url: '', type: 'social', enabled: true },
    { id: 2, title: 'WhatsApp', url: '', type: 'social', enabled: true },
    { id: 3, title: 'Instagram', url: '', type: 'social', enabled: true },
    { id: 4, title: 'YouTube', url: '', type: 'social', enabled: true },
    { id: 5, title: 'Twitter', url: '', type: 'social', enabled: true },
  ])

  return (
    <div className="min-h-screen bg-[#05050a] text-gray-200 flex flex-col md:flex-row relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* 2030 Ambient Background Glows */}
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            Neural Links
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${activeTab === 'qr' ? 'bg-gradient-to-r from-indigo-500/10 to-transparent border-l-2 border-indigo-400 text-indigo-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            QR Matrix Engine
          </button>
          <button 
            onClick={() => setActiveTab('places')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${activeTab === 'places' ? 'bg-gradient-to-r from-fuchsia-500/10 to-transparent border-l-2 border-fuchsia-400 text-fuchsia-300 shadow-[inset_0_0_20px_rgba(217,70,239,0.05)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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
            <button className="py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transform hover:-translate-y-0.5">
              Deploy Configuration
            </button>
          </header>

          {/* Links & Menus Tab */}
          {activeTab === 'destinations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <h3 className="text-xl font-semibold text-white">Active Routing Array</h3>
                </div>
                
                <div className="space-y-4">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors duration-300 group">
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Parameter ID</label>
                          <input 
                            type="text" 
                            defaultValue={dest.title}
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Vector Target</label>
                          <input 
                            type="url" 
                            placeholder="https://"
                            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                          />
                        </div>
                      </div>
                      <div className="pt-2 md:pt-6">
                        <label className="relative inline-flex items-center cursor-pointer group-hover:scale-105 transition-transform">
                          <input type="checkbox" defaultChecked={dest.enabled} className="sr-only peer" />
                          <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500 peer-checked:shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-8 flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Initialize New Vector
                </button>
              </div>
            </div>
          )}

          {/* QR Studio Tab */}
          {activeTab === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center min-h-[450px]">
                <div className="w-72 h-72 bg-[#05050a] rounded-3xl border border-white/10 flex items-center justify-center mb-8 relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden group">
                  {/* Scanning Laser Animation overlay */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_15px_#6366f1] animate-[ping_3s_ease-in-out_infinite] opacity-50"></div>
                  
                  <svg className="w-16 h-16 text-indigo-500/30 group-hover:text-indigo-400/80 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-indigo-500/10 backdrop-blur-md transition-all duration-500 cursor-pointer">
                     <span className="font-mono text-sm tracking-widest text-indigo-200">RENDER_PREVIEW</span>
                  </div>
                </div>
                <button className="w-full py-4 px-6 bg-white/5 border border-indigo-500/30 text-indigo-300 font-bold tracking-wide rounded-xl hover:bg-indigo-500/20 hover:border-indigo-400 hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
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
                        <button className="w-10 h-10 rounded-full bg-white ring-2 ring-offset-4 ring-offset-[#05050a] ring-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"></button>
                        <button className="w-10 h-10 rounded-full bg-cyan-400 hover:scale-110 transition-transform"></button>
                        <button className="w-10 h-10 rounded-full bg-fuchsia-500 hover:scale-110 transition-transform"></button>
                        <button className="w-10 h-10 rounded-full bg-emerald-400 hover:scale-110 transition-transform"></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Geometry Structure</label>
                      <select className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none">
                        <option>Geometric Square</option>
                        <option>Fluid Smooth</option>
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
            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-semibold text-white mb-2">Global Satellite Link</h3>
              <p className="text-sm text-gray-400 mb-8">Establish a geospatial link to sync physical coordinate metadata.</p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Enter location coordinates or nomenclature..."
                  className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-inner"
                />
                <button className="py-4 px-8 bg-white/5 border border-fuchsia-500/30 text-fuchsia-300 font-bold rounded-2xl hover:bg-fuchsia-500/20 hover:text-white transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                  Scan Coordinates
                </button>
              </div>
              
              <div className="p-12 text-center border border-dashed border-fuchsia-500/30 rounded-2xl bg-fuchsia-500/[0.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <p className="text-sm font-mono text-fuchsia-400/70 animate-pulse relative z-10">WAITING FOR SATELLITE HANDSHAKE...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}