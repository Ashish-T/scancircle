'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BusinessSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/business/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      if (res.ok) {
        setSuggestions(data.suggestions || [])
      }
    } catch (err) {
      setError('Failed to search businesses')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBusiness = async (placePrediction: any) => {
    const placeId = placePrediction.placePrediction.placeId
    const text = placePrediction.placePrediction.text.text

    // Register or check duplicate business API call
    const res = await fetch('/api/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ google_place_id: placeId, name: text }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'This business is already registered.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Find Your Business</h2>
      <p className="text-sm text-gray-600 mb-4">Search Google Places to link your physical establishment to Scan Circle[cite: 1].</p>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="e.g. ABC Cafe Jaipur"
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />

        {loading && <div className="absolute right-3 top-3.5 text-sm text-gray-400">Searching...</div>}

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelectBusiness(item)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none text-sm text-gray-800"
              >
                {item.placePrediction?.text?.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}