import mongoose from 'mongoose'
import { IUser } from './UserModel'

const Schema = mongoose.Schema

const FileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['image', 'video', 'raw', 'auto'],
    },
  },
  {
    timestamps: true,
  }
)

const FileModel = mongoose.models.file || mongoose.model('file', FileSchema)
export default FileModel

export interface IFile {
  _id: string

  userId: string | IUser
  url: string
  size: number
  type: 'image' | 'video' | 'raw' | 'auto'

  createdAt: string
  updatedAt: string
}
