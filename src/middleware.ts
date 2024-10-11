import { JWT, getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Require UnAuth
const requireUnAuthMusic = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require UnAuth Music -')

  // check auth
  if (token) {
    return NextResponse.redirect(new URL('/music', req.url))
  }

  return NextResponse.next()
}

// Require Auth
const requireAuth = async (req: NextRequest, token: JWT | null) => {
  console.log('- Require Auth -')

  // check auth
  if (!token) {
    return NextResponse.redirect(new URL('/auth/connect-to-spotify', req.url))
  }

  return NextResponse.next()
}

// Middleware
export default async function middleware(req: NextRequest) {
  console.log('- Middleware -')

  const token = await getToken({ req })
  const pathname = req.nextUrl.pathname

  // require auth
  const authPaths = ['/music']
  const isRequireAuth = authPaths.some(path => pathname.startsWith(path))
  if (isRequireAuth) {
    return requireAuth(req, token)
  }

  // require un-auth
  const unAuthMusicPaths = ['/auth/connect-to-spotify']
  const isRequireUnAuthMusic = unAuthMusicPaths.some(path => pathname.startsWith(path))
  if (isRequireUnAuthMusic) {
    return requireUnAuthMusic(req, token)
  }
}

export const config = {
  matcher: ['/music/:path*', '/auth/connect-to-spotify'],
}
