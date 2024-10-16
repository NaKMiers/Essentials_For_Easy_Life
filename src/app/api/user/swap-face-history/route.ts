import { connectDatabase } from '@/config/database'
import UserHistoryModel from '@/models/UserHistoryModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: UserHistory
import '@/models/UserHistoryModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/user/swap-face-history
export async function GET(req: NextRequest) {
  console.log('- Get Swap Face History -')

  try {
    // connect to database
    await connectDatabase()

    // get user id from token
    const token = await getToken({ req })
    const userId = token?._id

    // check if user not found
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // get swap face history
    const history = await UserHistoryModel.find({ userId, type: 'swap-face' }).sort({ createdAt: -1 })

    // return response
    return NextResponse.json({ history, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
