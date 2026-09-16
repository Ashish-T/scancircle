'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Table of Contents Data
const TOC = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Description of Service' },
  { id: 'accounts', title: '3. User Accounts' },
  { id: 'trial-subscription', title: '4. Free Trial & Subscription' },
  { id: 'business-listings', title: '5. Business Listings & Ownership' },
  { id: 'acceptable-use', title: '6. Acceptable Use' },
  { id: 'third-party', title: '7. Third-Party Services' },
  { id: 'reviews-disclaimer', title: '8. Reviews & Content Disclaimer' },
  { id: 'payments', title: '9. Payments & Billing' },
  { id: 'termination', title: '10. Termination' },
  { id: 'liability', title: '11. Limitation of Liability' },
  { id: 'changes', title: '12. Changes to Terms' },
  { id: 'contact', title: '13. Contact Information' },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('')

  // Intersection Observer to highlight active TOC item during scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    TOC.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for sticky nav/header
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <main className="min-h-screen bg-[#020205] text-gray-300 relative selection:bg-cyan-500/40 selection:text-white">
      
      {/* Background Mesh (Subtle for readability) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20 opacity-10"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none -z-10"></div>

      {/* Top Navigation */}
      <div className="w-full flex justify-center z-50 pt-8 pb-4 px-6 sticky top-0 bg-[#020205]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <nav className="w-full max-w-[1400px] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
            <span className="text-sm font-bold tracking-[0.2em] text-white font-mono uppercase">SCAN CIRCLE</span>
          </Link>
          <Link href="/dashboard" className="text-cyan-400 font-mono text-xs hover:text-cyan-300 transition-colors border border-cyan-500/30 px-4 py-2 rounded-lg">
            Return to Dashboard →
          </Link>
        </nav>
      </div>

      {/* Page Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-20 border-b border-white/5">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Terms of Service</h1>
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
          Please read these terms carefully before using Scan Circle. By accessing or using our platform, you agree to be bound by these terms.
        </p>
        <p className="mt-6 text-xs font-mono text-cyan-500 uppercase tracking-widest">
          Last Updated: September 16, 2026
        </p>
      </header>

      {/* Main Content & Sidebar Layout */}
      <div className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Left: Sticky Sidebar (Table of Contents) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32">
            <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-6">Table of Contents</h4>
            <nav className="flex flex-col space-y-3 border-l border-white/10 pl-4">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleScroll(e, item.id)}
                  className={`text-sm transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-cyan-400 font-semibold -ml-[17px] pl-4 border-l-2 border-cyan-400' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right: Legal Content */}
        <div className="flex-1 max-w-3xl space-y-16">
          
          <section id="acceptance" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>By accessing or using the Scan Circle web application ("Service", "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you do not have permission to access the Service.</p>
            </div>
          </section>

          <section id="description" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">2. Description of Service</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>Scan Circle is a digital platform designed to help physical businesses convert foot traffic into digital engagement. The Service allows businesses to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Generate and download high-resolution, branded QR codes.</li>
                <li>Link and route customers to social media profiles (including Instagram, YouTube, and Facebook).</li>
                <li>Direct customers to Google Review pages to facilitate feedback collection.</li>
                <li>Host digital menus and service rate catalogs.</li>
                <li>Track customer interaction analytics and scan conversions.</li>
              </ul>
            </div>
          </section>

          <section id="accounts" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">3. User Accounts</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>To use Scan Circle, you must create an account via Email and One-Time Password (OTP) authentication. You agree to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide accurate, current, and complete business information.</li>
                <li>Maintain the security of your authentication credentials.</li>
                <li>Take full responsibility for all activities or actions that occur under your account.</li>
              </ul>
            </div>
          </section>

          <section id="trial-subscription" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">4. Free Trial & Subscription</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p><strong>Free Trial:</strong> Scan Circle offers a 14-day free trial for new users to evaluate the platform. No credit card is required to begin the trial.</p>
              <p><strong>Paid Subscription:</strong> After the 14-day period, continued use of the platform requires an active paid subscription (e.g., ₹399/Month). Failure to remit payment will result in the suspension of routing services and dashboard access.</p>
              <p><strong>Service Continuity:</strong> While we strive for 99.9% uptime, we do not guarantee uninterrupted service. Pricing is subject to change with a 30-day notice provided to all active users.</p>
            </div>
          </section>

          <section id="business-listings" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">5. Business Listings & Ownership</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>Businesses map their digital routing via Google Places API integration. To protect business integrity:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Duplicate registrations of the exact same physical business entity are strictly prohibited.</li>
                <li>Scan Circle reserves the right to restrict, merge, or delete duplicate node registrations.</li>
                <li>In the event of an ownership dispute regarding a business listing, Scan Circle will handle the resolution internally and may request official documentation to verify physical ownership.</li>
              </ul>
            </div>
          </section>

          <section id="acceptable-use" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">6. Acceptable Use</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>As a condition of your use of the Service, you must NOT:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Misuse generated QR codes for spam, phishing, or malicious routing.</li>
                <li>Redirect users to harmful, explicit, or illegal content.</li>
                <li>Impersonate a business, brand, or entity that you do not legally represent.</li>
                <li>Attempt to reverse-engineer, disrupt, or abuse the platform's API or routing infrastructure.</li>
              </ul>
            </div>
          </section>

          <section id="third-party" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">7. Third-Party Services</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>Scan Circle facilitates routing to third-party platforms including, but not limited to, Google Reviews, Instagram, YouTube, and Facebook. </p>
              <p><strong>Clarification of Affiliation:</strong> Scan Circle is an independent routing utility and is <strong>not affiliated with, endorsed by, or sponsored by</strong> Google LLC, Meta Platforms Inc., or any other third-party platform. Your use of these third-party platforms is governed by their respective Terms of Service.</p>
            </div>
          </section>

          <section id="reviews-disclaimer" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">8. Reviews & Content Disclaimer</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>Scan Circle provides the mechanism to request reviews; however:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Users are solely responsible for the content and customer feedback they collect.</li>
                <li>We do not guarantee positive review outcomes or specific customer conversion rates.</li>
                <li>Users must strictly comply with Google's anti-manipulation policies (e.g., no review gating, no incentivizing reviews). Violation of Google policies may result in account termination on our platform.</li>
              </ul>
            </div>
          </section>

          <section id="payments" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">9. Payments & Billing</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>Subscription payments are handled securely via verified third-party payment gateways (e.g., UPI, Stripe, Razorpay). By submitting your Universal Transaction Reference (UTR), you confirm authorization of the payment.</p>
              <p><strong>Refund Policy:</strong> Due to the digital nature of our SaaS infrastructure, all subscription payments are non-refundable. Physical hardware orders (e.g., Acrylic Stands) are custom-printed and cannot be refunded once processing has begun.</p>
            </div>
          </section>

          <section id="termination" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">10. Termination</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>You may cancel your subscription and terminate your account at any time via the billing dashboard. Upon cancellation, QR routing will cease at the end of your current billing cycle.</p>
              <p>We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Acceptable Use terms.</p>
            </div>
          </section>

          <section id="liability" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">11. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Scan Circle makes no warranties, expressed or implied, regarding the continuous availability of the platform.</p>
              <p>In no event shall Scan Circle, its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages—including loss of profits, data, or business growth—resulting from your use or inability to use the Service.</p>
            </div>
          </section>

          <section id="changes" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6">12. Changes to Terms</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of significant changes via email or dashboard notification. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.</p>
            </div>
          </section>

          <section id="contact" className="scroll-mt-32 border-b border-white/5 pb-16">
            <h2 className="text-2xl font-bold text-white mb-6">13. Contact Information</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed font-light">
              <p>If you have any questions about these Terms, ownership disputes, or acceptable use policies, please contact our legal and support team:</p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:support@scancircle.com" className="text-cyan-400 hover:underline">support@scancircle.com</a><br/>
                <strong>HQ:</strong> Kolkata, West Bengal, India
              </p>
            </div>
          </section>

          {/* Legal Review Disclaimer Box */}
          <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4">
            <div className="flex-shrink-0 text-amber-400 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h4 className="text-amber-400 font-bold mb-1">Production Notice</h4>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                As this platform handles financial subscriptions, physical business identities, and third-party interactions (Google Reviews), it is highly recommended to have these terms reviewed by a legal professional in your jurisdiction before final commercial deployment.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full relative z-10 bg-[#020205] border-t border-cyan-500/10 pt-10 pb-10 text-center font-mono text-xs text-gray-500 mt-20">
        © {new Date().getFullYear()} Scan Circle. All rights reserved.
      </footer>
    </main>
  )
}