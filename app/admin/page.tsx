'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { QRCodeCanvas } from 'qrcode.react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface BusinessProfile {
  id: string
  email: string
  business_name: string
  business_type: string
  subscription_status: string
  subscription_expiry: string
  theme_id: string
  google_review_url: string
  business_menu: Array<{ name: string; price: string; description: string; imageUrl: string; category: string }>
  links: Array<{ title: string; value: string; enabled: boolean }>
}

export default function AdminPanelPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'directory' | 'customizer' | 'qrgenerator'>('directory')

  // Menu item state for selected business
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [newItemImage, setNewItemImage] = useState('')
  const [newItemCat, setNewItemCat] = useState('Main')

  const qrRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function checkAdminAndLoad() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Security check
      if (user.email !== 'getashish26@gmail.com') {
        alert('Access Denied: Admin privileges required.')
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await fetchAllBusinesses()
      setLoading(false)
    }
    checkAdminAndLoad()
  }, [router])

  const fetchAllBusinesses = async () => {
    const { data, error } = await supabase.from('profiles').select('*')
    if (data) {
      setBusinesses(data as BusinessProfile[])
      if (data.length > 0 && !selectedBusiness) {
        setSelectedBusiness(data[0] as BusinessProfile)
      }
    }
  }

  const handleUpdateBusiness = async () => {
    if (!selectedBusiness) return
    const { error } = await supabase.from('profiles').update({
      business_name: selectedBusiness.business_name,
      business_type: selectedBusiness.business_type,
      subscription_status: selectedBusiness.subscription_status,
      subscription_expiry: selectedBusiness.subscription_expiry,
      google_review_url: selectedBusiness.google_review_url,
      theme_id: selectedBusiness.theme_id,
      business_menu: selectedBusiness.business_menu,
      links: selectedBusiness.links
    }).eq('id', selectedBusiness.id)

    if (error) {
      alert('Error updating business: ' + error.message)
    } else {
      alert('Business profile updated successfully!')
      fetchAllBusinesses()
    }
  }

  const handleAddMenuItem = () => {
    if (!selectedBusiness || !newItemName || !newItemPrice) return
    const updatedMenu = [
      ...(selectedBusiness.business_menu || []),
      { name: newItemName, price: newItemPrice, description: newItemDesc, imageUrl: newItemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', category: newItemCat }
    ]
    setSelectedBusiness({ ...selectedBusiness, business_menu: updatedMenu })
    setNewItemName('')
    setNewItemPrice('')
    setNewItemDesc('')
    setNewItemImage('')
  }

  const handleRemoveMenuItem = (index: number) => {
    if (!selectedBusiness) return
    const updatedMenu = (selectedBusiness.business_menu || []).filter((_, i) => i !== index)
    setSelectedBusiness({ ...selectedBusiness, business_menu: updatedMenu })
  }

  const downloadAdminQR = () => {
    if (!qrRef.current || !selectedBusiness) return
    const canvas = qrRef.current
    const qrImage = canvas.toDataURL('image/png')

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = 800
    exportCanvas.height = 1000
    const ctx = exportCanvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0B0F19'
    ctx.fillRect(0, 0, 800, 1000)

    ctx.strokeStyle = '#818cf8'
    ctx.lineWidth = 6
    ctx.strokeRect(40, 40, 720, 920)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('SCAN CIRCLE', 400, 110)

    ctx.fillStyle = '#22d3ee'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('Scan to Unlock Exciting Features', 400, 155)

    const img = new Image()
    img.src = qrImage
    img.onload = () => {
      ctx.drawImage(img, 175, 190, 450, 450)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 34px sans-serif'
      ctx.fillText(selectedBusiness.business_name, 400, 700)

      // Social Icons Badges Box
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(80, 740, 640, 100)
      
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      
      // Top Row
      ctx.fillText('[ 📸 Instagram ]     [ ★★★★★ Google Reviews ]', 400, 780)

      // Check if YouTube is enabled
      const hasYouTube = selectedBusiness.links?.some(l => l.title.toLowerCase().includes('youtube') && l.enabled);
      
      // Bottom Row
      if (hasYouTube) {
        ctx.fillText('[ 💬 WhatsApp ]     [ 🎬 YouTube ]', 400, 815)
      } else {
        ctx.fillText('[ 💬 WhatsApp ]', 400, 815)
      }

      ctx.fillStyle = '#94a3b8'
      ctx.font = '14px monospace'
      ctx.fillText('Powered by Scan Circle • Kolkata, India', 400, 910)

      const link = document.createElement('a')
      link.download = `${selectedBusiness.business_name.replace(/\s+/g, '_')}_QR_Card.png`
      link.href = exportCanvas.toDataURL('image/png')
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center font-mono">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping"></div>
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-[#131B2E] border-r border-slate-700/60 flex flex-col p-6 z-20">
        <div className="mb-8">
          <Link href="/dashboard" className="text-xl font-extrabold text-white font-mono tracking-widest">SCAN_CIRCLE</Link>
          <span className="block text-[10px] font-mono text-indigo-400 mt-1 uppercase tracking-widest">Master Admin Portal</span>
        </div>

        <nav className="space-y-2 font-mono text-xs">
          <button onClick={() => setActiveTab('directory')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'directory' ? 'bg-indigo-600 text-white font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            📁 Business Directory
          </button>
          <button onClick={() => setActiveTab('customizer')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'customizer' ? 'bg-indigo-600 text-white font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            🎨 Client Profile Manager
          </button>
          <button onClick={() => setActiveTab('qrgenerator')} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'qrgenerator' ? 'bg-indigo-600 text-white font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            🖨️ Branded QR Generator
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <Link href="/dashboard" className="block text-xs font-mono text-slate-400 hover:text-white">← Return to User Dashboard</Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admin Command Center</h1>
              <p className="text-sm text-slate-400 font-mono mt-1">Manage client activations, industry themes, and dynamic menus.</p>
            </div>
            {selectedBusiness && (
              <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-xs font-mono text-indigo-300">
                Active Client: <strong className="text-white">{selectedBusiness.business_name}</strong>
              </div>
            )}
          </header>

          {/* TAB 1: BUSINESS DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-[#131B2E] border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Registered Business Clients</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-xs font-mono text-slate-400 uppercase">
                        <th className="py-3 px-4">Business Name</th>
                        <th className="py-3 px-4">Industry Type</th>
                        <th className="py-3 px-4">Subscription</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                      {businesses.map((biz) => (
                        <tr key={biz.id} className="hover:bg-white/[0.02]">
                          <td className="py-4 px-4 font-bold text-white">{biz.business_name}</td>
                          <td className="py-4 px-4 font-mono text-indigo-400">{biz.business_type}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase ${biz.subscription_status === 'active' || biz.subscription_status === 'pro_pending_verification' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                              {biz.subscription_status || 'free'}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-slate-300">
                            {biz.subscription_expiry ? new Date(biz.subscription_expiry).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-4 px-4">
                            <button onClick={() => { setSelectedBusiness(biz); setActiveTab('customizer'); }} className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono rounded-lg">
                              Manage Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT PROFILE MANAGER */}
          {activeTab === 'customizer' && selectedBusiness && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Theme & Expiry Control Box */}
              <div className="bg-[#131B2E] border border-slate-700/60 rounded-3xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Business Name</label>
                  <input type="text" value={selectedBusiness.business_name || ''} onChange={(e) => setSelectedBusiness({ ...selectedBusiness, business_name: e.target.value })} className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Industry Theme</label>
                  <select value={selectedBusiness.business_type || 'Cafe & Restaurant'} onChange={(e) => setSelectedBusiness({ ...selectedBusiness, business_type: e.target.value })} className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white outline-none font-mono">
                    <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                    <option value="Salon & Spa">Salon & Spa</option>
                    <option value="Retail & Shopping">Retail & Shopping</option>
                    <option value="Fitness & Gym">Fitness & Gym</option>
                    <option value="Womens Parlour">Women's Parlour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Subscription Status</label>
                  <select value={selectedBusiness.subscription_status || 'expired'} onChange={(e) => setSelectedBusiness({ ...selectedBusiness, subscription_status: e.target.value })} className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white outline-none font-mono">
                    <option value="active">Active</option>
                    <option value="free">Free Trial</option>
                    <option value="pro_pending_verification">Pending Verification</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    value={selectedBusiness.subscription_expiry ? new Date(selectedBusiness.subscription_expiry).toISOString().split('T')[0] : ''} 
                    onChange={(e) => setSelectedBusiness({ ...selectedBusiness, subscription_expiry: new Date(e.target.value).toISOString() })} 
                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white outline-none font-mono" 
                  />
                </div>
              </div>

              {/* Advanced Controls: Social Links & Reviews */}
              <div className="bg-[#131B2E] border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">Social Destinations & Google Reviews</h3>
                <p className="text-sm text-slate-400 mb-6 font-mono">Configure the client's routing logic directly.</p>

                <div className="mb-6">
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Google Review URL</label>
                  <input type="url" value={selectedBusiness.google_review_url || ''} onChange={(e) => setSelectedBusiness({...selectedBusiness, google_review_url: e.target.value})} className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-sm text-white outline-none" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBusiness.links?.map((link, idx) => (
                    <div key={idx} className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white">{link.title}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={link.enabled} onChange={(e) => {
                            const newLinks = [...selectedBusiness.links];
                            newLinks[idx].enabled = e.target.checked;
                            setSelectedBusiness({...selectedBusiness, links: newLinks});
                          }} className="sr-only peer" />
                          <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                      <input type="text" placeholder="URL or Handle" value={link.value} onChange={(e) => {
                         const newLinks = [...selectedBusiness.links];
                         newLinks[idx].value = e.target.value;
                         setSelectedBusiness({...selectedBusiness, links: newLinks});
                      }} className="w-full px-3 py-2 bg-[#131B2E] border border-slate-700 rounded-lg text-xs text-white outline-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu & Pictures Editor */}
              <div className="bg-[#131B2E] border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">Menu Items & Item Pictures</h3>
                <p className="text-sm text-slate-400 mb-6 font-mono">Add dishes or services with image URLs.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-[#0f172a] rounded-2xl border border-slate-800">
                  <input type="text" placeholder="Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-3 py-2 bg-[#131B2E] border border-slate-700 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Price (e.g. ₹299)" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="px-3 py-2 bg-[#131B2E] border border-slate-700 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Category" value={newItemCat} onChange={(e) => setNewItemCat(e.target.value)} className="px-3 py-2 bg-[#131B2E] border border-slate-700 rounded-xl text-xs text-white" />
                  <input type="url" placeholder="Image URL (Unsplash/Cloud)" value={newItemImage} onChange={(e) => setNewItemImage(e.target.value)} className="px-3 py-2 bg-[#131B2E] border border-slate-700 rounded-xl text-xs text-white" />
                  <button onClick={handleAddMenuItem} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl py-2">Add Item</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(selectedBusiness.business_menu || []).map((item, idx) => (
                    <div key={idx} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 flex gap-4 items-center relative group">
                      <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase">{item.category}</span>
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <p className="text-xs font-mono text-emerald-400">{item.price}</p>
                      </div>
                      <button onClick={() => handleRemoveMenuItem(idx)} className="text-rose-400 text-xs hover:text-rose-300 font-mono">Delete</button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleUpdateBusiness} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-2xl shadow-xl hover:opacity-90 font-mono tracking-wider">
                SAVE ALL CHANGES FOR {selectedBusiness.business_name.toUpperCase()}
              </button>
            </div>
          )}

          {/* TAB 3: BRANDED QR GENERATOR */}
          {activeTab === 'qrgenerator' && selectedBusiness && (
            <div className="bg-[#131B2E] border border-slate-700/60 rounded-3xl p-8 shadow-2xl flex flex-col items-center animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Branded QR Card Generator</h3>
              <p className="text-sm text-slate-400 mb-8 font-mono text-center">Generates professional QR card including Business Name, "Scan to Unlock Exciting Features", and Social Badges.</p>

              <div className="w-80 bg-[#0f172a] rounded-3xl border-2 border-indigo-500/50 flex flex-col items-center p-6 mb-8 shadow-2xl text-center">
                <h4 className="text-xl font-black tracking-widest text-white font-mono mb-1">SCAN CIRCLE</h4>
                <p className="text-[11px] font-bold text-cyan-400 mb-5 font-sans">Scan to Unlock Exciting Features</p>
                
                <div className="w-56 h-56 bg-white p-3 rounded-2xl flex items-center justify-center mb-5">
                  <QRCodeCanvas 
                    ref={qrRef}
                    value={`https://scancircle.onrender.com/router/${selectedBusiness.id}`}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="H"
                  />
                </div>

                <h5 className="text-base font-bold text-white truncate w-full mb-2">{selectedBusiness.business_name}</h5>
                
                {/* DYNAMIC ICONS & LABELS */}
                <div className="w-full mt-2 py-3 px-4 bg-slate-800 rounded-xl text-[10px] font-sans text-slate-200 flex flex-wrap gap-4 justify-center items-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[14px]">📸</span>
                    <span className="font-semibold">Instagram</span>
                  </div>
                  
                  <div className="w-[1px] h-6 bg-slate-600"></div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-amber-400 text-[10px] tracking-[0.2em] leading-none mt-1">★★★★★</span>
                    <span className="font-semibold mt-0.5">Google Reviews</span>
                  </div>
                  
                  <div className="w-[1px] h-6 bg-slate-600"></div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[14px]">💬</span>
                    <span className="font-semibold">WhatsApp</span>
                  </div>

                  {/* Render YouTube dynamically if enabled */}
                  {selectedBusiness.links?.some(l => l.title.toLowerCase().includes('youtube') && l.enabled) && (
                    <>
                      <div className="w-[1px] h-6 bg-slate-600"></div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[14px]">🎬</span>
                        <span className="font-semibold">YouTube</span>
                      </div>
                    </>
                  )}
                </div>

              </div>

              <button onClick={downloadAdminQR} className="py-4 px-8 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-2xl shadow-xl hover:opacity-90 font-mono tracking-wider">
                DOWNLOAD PRINT-READY QR CARD
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}