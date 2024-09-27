import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

const targetUrl = 'http://res.cloudinary.com/djpg3r44p/image/upload/v1727413972/ndd8dd8fefizp9cdxyvh.png'
const swapUrl = 'http://res.cloudinary.com/djpg3r44p/image/upload/v1727413971/fkhlndb6b0jgbjzza4lv.jpg'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  console.log('- Swap Face -')

  try {
    // get target image and swap image from request
    const formData = await req.formData()
    const target = formData.get('target')
    const swap = formData.get('swap')

    console.log(target, swap)

    // check images are provided
    if (!target || !swap) {
      return NextResponse.json({ message: 'Images are required' }, { status: 400 })
    }

    // upload images to cloudinary to get the urls
    const [targetUrl, swapUrl] = await Promise.all([
      uploadFile(target as File, '9:16'),
      uploadFile(swap as File, '9:16'),
    ])

    console.log(targetUrl, swapUrl)

    // check if images are uploaded or not
    if (!targetUrl || !swapUrl) {
      return NextResponse.json({ message: 'Failed to upload images' }, { status: 500 })
    }

    // swap faces
    const swapFormData = new FormData()
    swapFormData.append('target_url', targetUrl)
    swapFormData.append('swap_url', swapUrl)
    swapFormData.append('target_face_index', '0')

    const swapResponse = await fetch('https://faceswap3.p.rapidapi.com/faceswap/v1/image', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '7ea4ece9e6msh36e686b4493624ep11c22djsnb6c8bdd6e606',
        'x-rapidapi-host': 'faceswap3.p.rapidapi.com',
      },
      body: swapFormData,
    })
    const swapData = await swapResponse.json()
    const requestId = swapData.image_process_response.request_id

    console.log(requestId)
    if (!requestId) {
      return NextResponse.json({ message: 'Failed to swap faces' }, { status: 500 })
    }

    // get swap face result
    const resultFormData = new FormData()
    resultFormData.append('request_id', requestId)

    let resultData = null

    do {
      const resultResponse = await fetch('https://faceswap3.p.rapidapi.com/result/', {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '7ea4ece9e6msh36e686b4493624ep11c22djsnb6c8bdd6e606',
          'x-rapidapi-host': 'faceswap3.p.rapidapi.com',
        },
        body: resultFormData,
      })
      resultData = await resultResponse.json()
    } while (resultData.image_process_response.status !== 'OK')

    console.log(resultData)

    // remove images from cloudinary
    await Promise.all([deleteFile(targetUrl), deleteFile(swapUrl)])

    return NextResponse.json({ data: resultData, message: 'Success' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
