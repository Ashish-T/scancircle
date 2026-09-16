'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#020205] text-gray-200 flex flex-col items-center">
      <nav className="w-full max-w-[1400px] flex justify-between items-center z-50 mt-8 mb-12 px-6 py-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl">
        <Link href="/" className="flex items-center gap-3"><span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase">SCAN CIRCLE</span></Link>
        <Link href="/dashboard" className="text-cyan-400 font-mono text-xs">Return to Node →</Link>
      </nav>

      <div className="w-full max-w-4xl p-10 bg-[#07070e] border border-cyan-500/20 rounded-[2rem] shadow-[0_0_30px_rgba(34,211,238,0.05)] mb-20 font-mono">
        <h1 className="text-2xl text-cyan-400 mb-8 tracking-widest uppercase font-bold">Privacy Policy v2.0</h1>
        <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
          <p><strong>1. Data Collection:</strong> Scan Circle collects standard operational telemetry including scanning metrics, user navigation behavior, and linked endpoints (social media, Google review links) provided during dashboard configuration.</p>
          <p><strong>2. Information Usage:</strong> Data is strictly utilized to render the digital routing experience for physical QR scans and to compile aggregate analytic insights for the business owner.</p>
          <p><strong>3. Third-Party Sharing:</strong> We do not sell, distribute, or broker your digital matrices to unauthorized third-party networks.</p>
          <p><strong>4. Security Protocols:</strong> All endpoint routing and backend architecture are protected under modern encryption standards via our Supabase cloud infrastructure.</p>
          <p>For data purge requests, contact our Kolkata HQ at: <span className="text-cyan-300">getashish26@gmail.com</span>.</p>
        </div>
      </div>
    </main>
  )
}