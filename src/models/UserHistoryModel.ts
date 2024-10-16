import mongoose from 'mongoose'
import { IUser } from './UserModel'

const Schema = mongoose.Schema

const UserHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    type: {
      type: String,
      enum: ['swap-face'],
      required: true,
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

const UserHistoryModel = mongoose.models.userHistory || mongoose.model('userHistory', UserHistorySchema)
export default UserHistoryModel

export interface IUserHistory {
  _id: string

  userId: string | IUser
  type: 'swap-face'
  data: any

  createdAt: string
  updatedAt: string
}
