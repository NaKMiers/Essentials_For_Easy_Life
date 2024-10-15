import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /ai/generate-image
export async function POST(req: NextRequest) {
  console.log('- Generate Image -')

  try {
    // connect to database
    await connectDatabase()

    // get content from request
    const { prompt, size, styles } = await req.json()

    if (!prompt || !size || !styles) {
      return NextResponse.json({ message: 'Prompt, size, and styles are required' }, { status: 400 })
    }

    const res = await fetch(
      `https://drawing1.p.rapidapi.com/createImage?prompt=${prompt}&Styles=${styles}&RspImgType=url&size=${size}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'drawing1.p.rapidapi.com',
        },
      }
    )

    const data = await res.json()
    console.log('data: ', data)

    const image = data.data[0].url

    // return response
    return NextResponse.json({ image, message: 'Detect Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
