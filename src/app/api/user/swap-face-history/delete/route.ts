import { connectDatabase } from '@/config/database'
import UserHistoryModel from '@/models/UserHistory'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: UserHistory
import '@/models/UserHistory'

export const dynamic = 'force-dynamic'

// [DELETE]: /api/user/swap-face-history/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Swap Face History -')

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

    // get delete swap face history ids
    const { ids } = await req.json()
    console.log('ids:', ids)

    // get swap face history
    await UserHistoryModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json({ message: 'Delete Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
