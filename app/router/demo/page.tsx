import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RouterDemoPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const businessNameQuery = resolvedParams.business
  
  // Dynamic business name from user/business configuration
  const businessName = typeof businessNameQuery === 'string' 
    ? decodeURIComponent(businessNameQuery) 
    : 'Scan Circle Business'

  const activeLinks = [
    { 
      id: 1, 
      title: 'Follow on Instagram', 
      platform: 'instagram', 
      color: 'from-fuchsia-500 to-pink-500',
      iconHover: 'group-hover:text-pink-400 group-hover:border-pink-500/30',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    },
    { 
      id: 2, 
      title: 'Chat on WhatsApp', 
      platform: 'whatsapp', 
      color: 'from-emerald-400 to-emerald-600',
      iconHover: 'group-hover:text-emerald-400 group-hover:border-emerald-500/30',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    },
    { 
      id: 3, 
      title: 'Watch on YouTube', 
      platform: 'youtube', 
      color: 'from-red-500 to-red-700',
      iconHover: 'group-hover:text-red-500 group-hover:border-red-500/30',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    },
    { 
      id: 4, 
      title: 'Visit Facebook Page', 
      platform: 'facebook', 
      color: 'from-blue-500 to-blue-700',
      iconHover: 'group-hover:text-blue-500 group-hover:border-blue-500/30',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    },
    { 
      id: 5, 
      title: 'Follow on Twitter / X', 
      platform: 'twitter', 
      color: 'from-gray-500 to-gray-700',
      iconHover: 'group-hover:text-gray-300 group-hover:border-gray-500/30',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    },
  ]

  return (
    <main className="min-h-screen bg-[#05050a] text-gray-200 relative overflow-hidden flex flex-col items-center py-16 px-6">
      
      {/* Ambient Mobile Background Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none -z-10"></div>

      {/* Profile Header */}
      <div className="w-full max-w-md flex flex-col items-center mb-10 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        {/* Updated Avatar to spell Scan Circle instead of SC */}
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 mb-4 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center border-2 border-[#05050a] px-2 text-center">
            <span className="text-xs font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase leading-tight">
              Scan Circle
            </span>
          </div>
        </div>
        
        {/* Dynamic Business Name */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1 text-center">{businessName}</h1>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Verified Hub</p>
      </div>

      {/* Links Container */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10">
        {activeLinks.map((link, index) => (
          <a
            key={link.id}
            href="#"
            className="group relative w-full p-2 pr-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl flex items-center justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.04]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Ambient Background Gradient Reveal */}
            <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Left Content: Icon & Title */}
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-gray-400 transition-all duration-300 group-hover:scale-110 ${link.iconHover} shadow-sm`}>
                {link.icon}
              </div>
              <span className="font-semibold text-gray-300 group-hover:text-white transition-colors tracking-wide">
                {link.title}
              </span>
            </div>

            {/* Right Content: Action Arrow */}
            <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 group-hover:translate-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </a>
        ))}
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