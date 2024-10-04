import { connectDatabase } from '@/config/database'
import FileModel from '@/models/FileModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Model: File
import '@/models/FileModel'

export const dynamic = 'force-dynamic'

// [GET]: /file/get-user-files
export async function GET(req: NextRequest) {
  console.log('- Get User Files -')

  try {
    // connect to database
    await connectDatabase()

    // get user id
    const token = await getToken({ req })
    const userId = token?._id

    // check if user id is not found
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // get files from database
    const userFiles = await FileModel.find({ userId }).lean()

    // return response
    return NextResponse.json({ files: userFiles }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
