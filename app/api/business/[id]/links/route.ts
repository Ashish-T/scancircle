import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const links = await prisma.businessLink.findMany({
      where: { business_id: params.id },
      orderBy: { display_order: 'asc' },
    })
    return NextResponse.json({ links })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { type, label, url } = await request.json()

    if (!type || !label || !url) {
      return NextResponse.json({ error: 'Type, label, and URL are required' }, { status: 400 })
    }

    const newLink = await prisma.businessLink.create({
      data: {
        business_id: params.id,
        type,
        label,
        url,
        enabled: true,
      },
    })

    return NextResponse.json({ success: true, link: newLink })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}