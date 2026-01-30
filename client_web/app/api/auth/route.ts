import { User } from '@/lib/models/User'
import { MongoConnect } from '@/lib/mongo/MongoConnect'
import { AuthPayload } from '@/utils/jwt/Payload'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await MongoConnect()
    const decodedToken = AuthPayload(req)

    const user = await User.findOne({ email: decodedToken.email })

    if(!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error(err)
  } finally {
    // cleanup
  }
}