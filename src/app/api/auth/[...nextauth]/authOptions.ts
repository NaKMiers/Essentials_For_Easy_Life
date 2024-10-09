import { connectDatabase } from '@/config/database'
import spotifyApi, { LOGIN_URL } from '@/libs/spotify'
import UserModel from '@/models/UserModel'

// Providers
import { SessionStrategy } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import SpotifyProvider from 'next-auth/providers/spotify'

// Models: User
import '@/models/UserModel'

async function refreshAccessToken(token: any) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log('REFRESHED TOKEN:', refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: refreshedToken.expires_in * 1000 + Date.now(),
      refreshToken: refreshedToken.refresh_token || token.refreshToken,
    }
  } catch (err: any) {
    console.error(err)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

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
    async jwt({ token, user, trigger, session, account }: any) {
      console.log('- JWT -', account)

      // New Login
      if (user) {
        const userDB = await UserModel.findOne({
          email: user.email,
        }).lean()

        if (userDB) {
          token = {
            ...token,
            ...userDB,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            accessTokenExpires: account.expires_at * 1000,
          }
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
            accessToken: account.access_token,
            refreshToken: account.refreshToken,
            accessTokenExpires: account.expires_at * 1000,
          }
        }
      }

      // return previous token if the account has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log('EXISTING ACCESS TOKEN IS VALID')
        return token
      }

      // access token has expired, refresh it
      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...')
      return await refreshAccessToken(token)
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
          } else if (account.provider === 'spotify') {
            firstName = profile.display_name
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
        }

        return true
      } catch (err: any) {
        console.log(err)
        return false
      }
    },
  },
}

export default authOptions
