'use client'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#020205] text-gray-200 relative overflow-x-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
      
      {/* Navigation */}
      <nav className="w-full max-w-[1400px] flex justify-between items-center z-50 mt-8 mb-12 px-6 py-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
          <span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase">SCAN CIRCLE</span>
        </Link>
        <div className="hidden lg:flex items-center gap-10 font-mono text-[11px] font-bold tracking-[0.15em] uppercase">
          <Link href="/" className="text-gray-400 hover:text-cyan-300 transition-colors">Home</Link>
          <Link href="/what-we-do" className="text-gray-400 hover:text-cyan-300 transition-colors">What We Do</Link>
          <Link href="/about" className="text-gray-400 hover:text-cyan-300 transition-colors">About Us</Link>
          <Link href="/contact" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Contact</Link>
        </div>
        <Link href="/login" className="bg-[#05050a] px-6 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-300 font-bold font-mono text-xs uppercase hover:bg-cyan-500/10">Get Started Free</Link>
      </nav>

      <div className="w-full max-w-5xl z-10 px-6 mt-12 mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="p-10 bg-gradient-to-br from-[#07070e] to-blue-900/10 border border-blue-500/20 rounded-[2rem]">
          <h1 className="text-4xl font-extrabold text-white mb-4">Get in <span className="text-blue-400">Touch</span></h1>
          <p className="text-gray-400 mb-12">Need help with your QR codes, hardware orders, or billing inquiries? Send us a message and our support team will help you out.</p>
          
          <div className="space-y-8 font-mono">
            <div>
              <p className="text-xs text-blue-400 uppercase tracking-widest mb-1">Headquarters</p>
              <p className="text-white text-lg">Kolkata, West Bengal</p>
              <p className="text-gray-500 text-sm">India</p>
            </div>
            <div>
              <p className="text-xs text-cyan-400 uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-white text-lg">getashish26@gmail.com</p>
            </div>
            <div>
              <p className="text-xs text-indigo-400 uppercase tracking-widest mb-1">Official UPI ID</p>
              <p className="text-white text-lg">scancircle@axl</p>
            </div>
          </div>
        </div>

        {/* Console Form */}
        <div className="p-10 bg-[#07070e] border border-white/5 rounded-[2rem]">
          <h3 className="text-sm font-mono font-bold text-gray-300 uppercase tracking-widest mb-6">Send us a Message</h3>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message Sent! We will contact you shortly.'); }}>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Full Name</label>
              <input type="text" required placeholder="John Doe" className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Email Address</label>
              <input type="email" required placeholder="hello@example.com" className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Your Message</label>
              <textarea rows={5} required placeholder="How can we help you today?" className="w-full px-4 py-3 bg-[#030307] border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors"></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold rounded-xl font-mono uppercase tracking-widest hover:bg-cyan-500/30 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <footer className="w-full z-10 bg-[#07070e] border-t border-cyan-500/20 pt-10 pb-10 text-center font-mono text-xs text-gray-500">
        © {new Date().getFullYear()} Scan Circle. Kolkata, West Bengal.
      </footer>
    </main>
  )
}