import { NextRequest, NextResponse } from 'next/server'

// [POST]: /ai/detect-ai-content
export async function POST(req: NextRequest) {
  console.log('- Detect AI Content -')

  try {
    // get content from request
    const { content } = await req.json()

    const res = await fetch('https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        'x-rapidapi-host': 'ai-content-detector-ai-gpt.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: content }),
    })

    const data = await res.json()

    // return response
    return NextResponse.json({ data, message: 'Detect Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
