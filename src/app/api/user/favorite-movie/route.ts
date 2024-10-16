import { connectDatabase } from '@/config/database'
import FavoriteMovieModel from '@/models/FavoriteMovieModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Favorite Movie
import '@/models/FavoriteMovieModel'

export const dynamic = 'force-dynamic'

// [GET]: /user/favorite-movie
export async function GET(req: NextRequest) {
  console.log('- Get User Favorite Movie -')

  try {
    // connect to database
    await connectDatabase()

    // get user id from token
    const token = await getToken({ req })
    const userId = token?._id

    // check if user not found
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // get user's favorite movies & tv shows
    const movies = await FavoriteMovieModel.find({ userId }).sort({ createdAt: -1 })

    // return response
    return NextResponse.json({ movies }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
