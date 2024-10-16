import { connectDatabase } from '@/config/database'
import FavoriteMovieModel, { IFavoriteMovie } from '@/models/FavoriteMovieModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Favorite Movie
import '@/models/FavoriteMovieModel'

// [PATCH]: /movie/like/:id/:type
export async function PATCH(
  req: NextRequest,
  { params: { id, type } }: { params: { id: string; type: 'movie' | 'tv' } }
) {
  console.log('- Like/Unlike Movie/TV Shows -')

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

    // get movie to check if it's already liked
    const movie: IFavoriteMovie | null = (await FavoriteMovieModel.findOne({
      userId,
      movieId: id,
    }).lean()) as any

    // if user already liked the movie -> delete it
    if (movie) {
      await FavoriteMovieModel.findByIdAndDelete(movie._id)

      return NextResponse.json({}, { status: 200 })
    }

    // get movie data from request
    const { data } = await req.json()

    // like the movie
    const likedMovie = await FavoriteMovieModel.create({ userId, movieId: id, type, data })

    // return response
    return NextResponse.json({ movie: likedMovie }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
