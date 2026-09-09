'use client'

import { useState, useEffect } from 'react'

export default function LinksManager({ businessId }: { businessId: string }) {
  const [links, setLinks] = useState<any[]>([])
  const [type, setType] = useState('instagram')
  const [label, setLabel] = useState('Follow us on Instagram')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/business/${businessId}/links`)
      .then((res) => res.json())
      .then((data) => {
        if (data.links) setLinks(data.links)
      })
  }, [businessId])

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/business/${businessId}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, label, url }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setLinks([...links, data.link])
      setUrl('')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Manage QR Landing Destinations</h3>

      <form onSubmit={handleAddLink} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Platform Type</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                setLabel(`Follow us on ${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}`)
              }}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl bg-white"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="google_review">Google Review</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Button Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Destination URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/yourbusiness"
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition"
        >
          {loading ? 'Adding...' : 'Add Link'}
        </button>
      </form>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <p className="font-medium text-gray-900 text-sm">{link.label}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 truncate max-w-xs block">
                {link.url}
              </a>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${link.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {link.enabled ? 'Active' : 'Disabled'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}