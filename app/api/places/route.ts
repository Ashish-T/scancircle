import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!query) {
    return NextResponse.json({ results: [] }, { status: 400 })
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places API key is missing in environment variables.' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 })
  }
}