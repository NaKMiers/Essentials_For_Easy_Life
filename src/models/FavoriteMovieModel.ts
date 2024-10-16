import mongoose from 'mongoose'
import { IUser } from './UserModel'

const Schema = mongoose.Schema

const FavoriteMovieSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['movie', 'tv'],
      required: 'movie',
    },
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const FavoriteMovieModel =
  mongoose.models.favoriteMovie || mongoose.model('favoriteMovie', FavoriteMovieSchema)
export default FavoriteMovieModel

export interface IFavoriteMovie {
  _id: string

  userId: string | IUser
  movieId: string
  type: 'movie' | 'tv'
  data: any

  createdAt: string
  updatedAt: string
}
