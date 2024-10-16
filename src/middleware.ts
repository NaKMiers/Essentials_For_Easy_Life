import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Require Auth
const requireAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Auth -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Require connect to Spotify
const requireConnectToSpotify = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Connect to Spotify  -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!token.spotifyId) {
    return NextResponse.redirect(new URL('/auth/connect-to-spotify', req.url))
  }

  return NextResponse.next()
}

// Require Un-Auth Music
const requireUnAuthMusic = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Un-Auth Music -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // check connect to Spotify
  if (token.spotifyId) {
    return NextResponse.redirect(new URL('/music', req.url))
  }

  return NextResponse.next()
}

// Middleware
export default async function middleware(req: NextRequest) {
  console.log('- Middleware -')

  const token = await getToken({ req })
  const pathname = req.nextUrl.pathname

  // require auth
  const authPaths = ['/ai/swap-face']
  const isRequireAuth = authPaths.some(path => pathname.startsWith(path))
  if (isRequireAuth) {
    return requireAuth(req, token)
  }

  // require connect to Spotify
  const requireConnectToSpotifyPaths = ['/music']
  const isRequireConnectToSpotify = requireConnectToSpotifyPaths.some(path => pathname.startsWith(path))
  if (isRequireConnectToSpotify) {
    return requireConnectToSpotify(req, token)
  }

  // require un-auth
  const unAuthMusicPaths = ['/auth/connect-to-spotify']
  const isRequireUnAuthMusic = unAuthMusicPaths.some(path => pathname.startsWith(path))
  if (isRequireUnAuthMusic) {
    return requireUnAuthMusic(req, token)
  }
}

export const config = {
  matcher: ['/ai/swap-face', '/music/:path*', '/auth/connect-to-spotify'],
}
