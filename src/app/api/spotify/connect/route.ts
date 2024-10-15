import { NextRequest, NextResponse } from 'next/server'

// [GET]: /spotify/connect
export async function GET(req: NextRequest) {
  console.log('- Connect To Spotify - ')

  try {
    const url = 'https://accounts.spotify.com/api/token'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }).toString(),
    })

    const data = await response.json()
    console.log('Spotify Token:', data)

    return NextResponse.json({ data }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
