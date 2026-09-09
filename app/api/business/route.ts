import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to generate a random short code for the QR destination
function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: Request) {
  try {
    const { google_place_id, name } = await request.json()

    if (!google_place_id || !name) {
      return NextResponse.json({ error: 'Google Place ID and name are required' }, { status: 400 })
    }

    // Check if business already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { google_place_id },
    })

    if (existingBusiness) {
      if (existingBusiness.status === 'ACTIVE' || existingBusiness.status === 'TRIAL') {
        return NextResponse.json(
          { error: 'This business is already registered with Scan Circle. Please contact the business account owner[cite: 1].' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'This business already has a profile, but its subscription is inactive. Renew to reactivate[cite: 1].' },
          { status: 400 }
        )
      }
    }

    // Initialize 14-day trial period
    const trialStartedAt = new Date()
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialStartedAt.getDate() + 14)

    // Create new business and generate initial QR short code
    const newBusiness = await prisma.business.create({
      data: {
        google_place_id,
        name,
        status: 'TRIAL',
        trial_started_at: trialStartedAt,
        trial_ends_at: trialEndsAt,
        qr_codes: {
          create: {
            short_code: generateShortCode(),
            status: 'TRIAL',
          },
        },
      },
      include: {
        qr_codes: true,
      },
    })

    return NextResponse.json({ success: true, business: newBusiness })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}