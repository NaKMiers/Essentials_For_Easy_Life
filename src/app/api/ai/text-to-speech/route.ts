import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [POST]: /ai/text-to-speech
export async function POST(req: NextRequest) {
  console.log('- Text To Speech -')

  try {
    // get data from request
    const { prompt, voice } = await req.json()

    if (!prompt || !voice) {
      return NextResponse.json({ message: 'Prompt and voice are required' }, { status: 400 })
    }

    const response = await fetch('https://ai-powered-text-to-speech1.p.rapidapi.com/synthesize-speech', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        'x-rapidapi-host': 'ai-powered-text-to-speech1.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence: prompt.trim(),
        language: voice.language,
        voice: voice.voice,
        engine: voice.engine,
        withSpeechMarks: false,
      }),
    })
    const result = await response.json()

    console.log(result)

    return NextResponse.json({ audio: result.fileDownloadUrl, message: 'Success' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
