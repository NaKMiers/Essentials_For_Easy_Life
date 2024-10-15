import { connectDatabase } from '@/config/database'
import spotifyApi, { LOGIN_URL } from '@/libs/spotify'
import UserModel, { IUser } from '@/models/UserModel'

// Providers
import { SessionStrategy } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import SpotifyProvider from 'next-auth/providers/spotify'

// Models: User
import '@/models/UserModel'

// async function refreshAccessToken(token: any) {
//   try {
//     spotifyApi.setAccessToken(token.spotifyAccessToken)
//     spotifyApi.setRefreshToken(token.spotifyRefreshToken)

//     const { body: refreshedToken } = await spotifyApi.refreshAccessToken()

//     const updatedUser: IUser | null = (await UserModel.findByIdAndUpdate(
//       token._id,
//       {
//         $set: {
//           spotifyAccessToken: refreshedToken.access_token,
//           spotifyAccessTokenExpires: refreshedToken.expires_in * 1000 + Date.now(),
//         },
//       },
//       { new: true }
//     ).lean()) as IUser | null

//     if (updatedUser) {
//       return {
//         ...token,
//         spotifyAccessToken: refreshedToken.access_token,
//         spotifyAccessTokenExpires: refreshedToken.expires_in * 1000 + Date.now(),
//       }
//     }

//     return token
//   } catch (err: any) {
//     console.error(err)

//     return {
//       ...token,
//       error: 'RefreshAccessTokenError',
//     }
//   }
// }

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

    // SPOTIFY
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, account, session }: any) {
      console.log('- JWT -')

      // new login | connection to spotify
      if (user) {
        let userDB: IUser | null = (await UserModel.findOne({
          email: user.email,
        }).lean()) as IUser | null

        // user not found
        if (!userDB) {
          return token
        }

        // user found, connecting to spotify for the first time
        if (account.provider === 'spotify' && !userDB.spotifyId) {
          // update user with spotify id
          await UserModel.updateOne(
            { email: user.email },
            {
              $set: {
                spotifyId: account.providerAccountId,
                spotifyAccessToken: account.access_token,
                spotifyRefreshToken: account.refresh_token,
              },
            }
          )
        }

        token = {
          ...token,
          ...userDB,
          spotifyId: userDB.spotifyId,
          spotifyAccessToken: userDB.spotifyAccessToken,
          spotifyRefreshToken: userDB.spotifyRefreshToken,
        }
      }

      if (trigger === 'update' && token._id) {
        console.log('- Update Token -')
        const userDB = await UserModel.findById(token._id).lean()
        if (userDB) {
          // exclude password
          return {
            ...token,
            ...userDB,
          }
        }
      }

      // if (token.spotifyId) {
      //   return await refreshAccessToken(token)
      // }

      return token
    },

    async session({ session, token }: any) {
      console.log('- Session -')

      session.user = token
      return session
    },

    async signIn({ user, account, profile }: any) {
      console.log('- Sign In -')

      try {
        // connect to database
        await connectDatabase()

        // check if account and user and profile exist
        if (!account || !user || !profile) {
          return false
        }

        if (account.provider === 'spotify') {
          return true
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
        const existingUser: any = await UserModel.findOne({ email }).lean()

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
          verifiedEmail: true,
        })

        return true
      } catch (err: any) {
        console.log(err)
        return false
      }
    },
  },
}

export default authOptions
