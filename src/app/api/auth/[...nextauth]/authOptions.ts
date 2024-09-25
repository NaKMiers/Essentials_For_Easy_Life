/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import bcrypt from 'bcrypt'

// Models: User
import '@/models/UserModel'

// Providers
import { SessionStrategy } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // debug: process.env.NODE_ENV === 'development',
  providers: [
    // GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GITHUB
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // CREDENTIALS
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Tên người dùng hoặc Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'usernameOrEmail' | 'password', string> | undefined) {
        console.log('- Credentials -')

        // connect to database
        await connectDatabase()

        // check if credentials is empty
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null
        }

        // get data from credentials
        const { usernameOrEmail, password } = credentials

        // find user from database
        const user: any = await UserModel.findOne({
          $or: [{ email: usernameOrEmail.toLowerCase() }, { username: usernameOrEmail }],
        }).lean()

        // check user exists or not in database
        if (!user) {
          throw new Error('Email hoặc mật khẩu không chính xác!')
        }

        // check if user is not local
        if (user.authType !== 'local') {
          throw new Error('Tài khoản này được xác thực bởi ' + user.authType)
        }

        // check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          // push error to call back
          throw new Error('Email hoặc mật khẩu không chính xác!')
        }

        const { avatar: image, ...otherDetails } = user

        // return to session callback
        return {
          ...otherDetails,
          image,
          name: user.firstName + ' ' + user.lastName,
        }
      },
    }),

    // ...add providers here
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: unknown) {
      console.log('- JWT -', session)

      // New Login
      if (user) {
        const userDB: unknown = await UserModel.findOne({
          email: user.email,
        }).lean()

        if (userDB) {
          token = { ...token, ...userDB }
        }
      }

      if (trigger === 'update' && token._id) {
        console.log('- Update Token -')
        const userDB: unknown = await UserModel.findById(token._id).lean()
        if (userDB) {
          return { ...token, ...userDB }
        }
      }

      return token
    },

    async session({ session, token }: unknown) {
      console.log('- Session -')

      session.user = token
      return session
    },

    async signIn({ user, account, profile }: unknown) {
      console.log('- Sign In -')

      try {
        // connect to database
        await connectDatabase()

        if (account && account.provider != 'credentials') {
          if (!user || !profile) {
            return false
          }

          // get data for authentication
          const email = user.email
          const avatar = user.image
          let firstName: string = ''
          let lastName: string = ''

          if (account.provider === 'google') {
            firstName = profile.given_name
            lastName = profile.family_name
          } else if (account.provider === 'github') {
            firstName = profile.name
            lastName = ''
          }

          // get user from database to check exist
          const existingUser: unknown = await UserModel.findOne({ email }).lean()

          // check whether user exists
          if (existingUser) {
            return true
          }

          // create new user with social information (auto verified email)
          await UserModel.create({
            email,
            avatar,
            firstName,
            lastName,
            authType: account.provider,
          })
        }

        return true
      } catch (err: unknown) {
        console.log(err)
        return false
      }
    },
  },
}

export default authOptions
