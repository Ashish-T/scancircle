import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

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

export default async function RouterProfilePage({ params }: PageProps) {
  const resolvedParams = await params
  const userId = resolvedParams.id

  // Fetch profile and links from Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const businessName = profile?.business_name || 'Scan Circle Business'
  const links: LinkItem[] = profile?.links || []

  // Helper to format handles/numbers into active redirect URLs
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
    // For Facebook, YouTube, or custom, use value directly (ensuring https://)
    return cleanVal.startsWith('http') ? cleanVal : `https://${cleanVal}`
  }

  // Get Brand Color styling & Icons
  const getPlatformStyle = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('instagram')) return { color: 'from-fuchsia-500 to-pink-500', hover: 'group-hover:text-pink-400' }
    if (t.includes('whatsapp')) return { color: 'from-emerald-400 to-emerald-600', hover: 'group-hover:text-emerald-400' }
    if (t.includes('youtube')) return { color: 'from-red-500 to-red-700', hover: 'group-hover:text-red-500' }
    if (t.includes('facebook')) return { color: 'from-blue-500 to-blue-700', hover: 'group-hover:text-blue-500' }
    return { color: 'from-cyan-500 to-indigo-600', hover: 'group-hover:text-cyan-400' }
  }

  const activeLinks = links.filter(l => l.enabled && l.value.trim() !== '')

  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center py-16 px-6">
      
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none -z-10"></div>

      {/* Profile Header */}
      <div className="w-full max-w-md flex flex-col items-center mb-10 z-10">
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 mb-4 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center border-2 border-[#05050a] px-2 text-center">
            <span className="text-xs font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase leading-tight">
              Scan Circle
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1 text-center">{businessName}</h1>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Verified Hub</p>
      </div>

      {/* Dynamic Links Container */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10">
        {activeLinks.length > 0 ? (
          activeLinks.map((link) => {
            const style = getPlatformStyle(link.title)
            const destinationUrl = getDestinationUrl(link.title, link.value)

            return (
              <a
                key={link.id}
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full p-3 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl flex items-center justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-gray-400 transition-all duration-300 group-hover:scale-110 ${style.hover}`}>
                    <span className="text-xs font-mono font-bold uppercase">{link.title.slice(0, 2)}</span>
                  </div>
                  <span className="font-semibold text-gray-300 group-hover:text-white transition-colors tracking-wide">
                    {link.title}
                  </span>
                </div>

                <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-all group-hover:translate-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </a>
            )
          })
        ) : (
          <p className="text-center text-gray-500 font-mono text-sm py-8">No routing vectors configured yet.</p>
        )}
      </div>

      {/* Powered By Footer */}
      <div className="mt-auto pt-16 z-10">
        <Link href="/" className="inline-flex items-center gap-2 py-2 px-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Powered by Scan Circle</span>
        </Link>
      </div>

    </main>
  )
}