import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    dbUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
    nextauthUrl: process.env.NEXTAUTH_URL,
    authSecret: process.env.AUTH_SECRET ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
  })
}
