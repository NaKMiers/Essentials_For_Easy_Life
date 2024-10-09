import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [POST]: /ai/swap-face
export async function POST(req: NextRequest) {
  console.log('- Swap Face -')

  try {
    const { target, swap } = await req.json()

    // check if images are uploaded or not
    if (!target || !swap) {
      return NextResponse.json({ message: 'Failed to upload images' }, { status: 500 })
    }

    // swap faces
    const swapFormData = new FormData()
    swapFormData.append('target_url', target)
    swapFormData.append('swap_url', swap)
    swapFormData.append('target_face_index', '0')

    const swapResponse = await fetch('https://faceswap3.p.rapidapi.com/faceswap/v1/image', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        'x-rapidapi-host': 'faceswap3.p.rapidapi.com',
      },
      body: swapFormData,
    })
    const swapData = await swapResponse.json()

    const requestId = swapData.image_process_response.request_id

    return NextResponse.json({ requestId: requestId, message: 'Success' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
