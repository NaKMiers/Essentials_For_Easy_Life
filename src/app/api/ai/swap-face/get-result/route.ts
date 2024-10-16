import { connectDatabase } from '@/config/database'
import UserHistoryModel from '@/models/UserHistoryModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /ai/swap-face/get-result
export async function POST(req: NextRequest) {
  console.log('- Get Swap Face Result -')

  try {
    // connect to database
    await connectDatabase()

    // get user id from token
    const token = await getToken({ req })
    const userId = token?._id

    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // get request id to get swap face result
    const { requestId } = await req.json()

    if (!requestId) {
      return NextResponse.json({ message: 'Result not found' }, { status: 500 })
    }

    // get swap face result
    const resultFormData = new FormData()
    resultFormData.append('request_id', requestId)

    let result = null

    const resultResponse = await fetch('https://faceswap3.p.rapidapi.com/result/', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        'x-rapidapi-host': 'faceswap3.p.rapidapi.com',
      },
      body: resultFormData,
    })

    result = await resultResponse.json()
    const data = result.image_process_response

    if (data.status !== 'OK') {
      return NextResponse.json({ message: 'Failed to get result' }, { status: 500 })
    }

    // save to user history
    await UserHistoryModel.create({
      userId: userId,
      type: 'swap-face',
      data: { requestId, image: data.result_url },
    })

    return NextResponse.json({ resultImage: data.result_url, message: 'Success' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
