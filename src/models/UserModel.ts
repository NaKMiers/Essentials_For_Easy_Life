import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    // Authentication
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$$/.test(value)
        },
        message: 'Email không hợp lệ',
      },
    },
    authType: {
      type: String,
      enum: ['google', 'facebook', 'github'],
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'editor', 'collaborator'],
      default: 'user',
    },

    // Information
    avatar: {
      type: String,
      default: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)
export default UserModel

export interface IUser {
  _id: string
  username: string
  email: string
  authType: string
  role: string
  avatar: string
  firstName: string
  lastName: string
  bio: string
}
