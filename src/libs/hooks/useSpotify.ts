import spotifyApi from '@/libs/spotify'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

function useSpotify() {
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  useEffect(() => {
    if (!curUser?.spotifyId) return
    if (curUser.error === 'RefreshAccessTokenError') {
      signIn('spotify')
    }

    spotifyApi.setAccessToken(curUser.spotifyAccessToken)

    // spotify access token expired -> refresh token
    if (new Date(curUser.spotifyAccessTokenExpiresAt).getTime() < Date.now()) {
      update({ trigger: 'refresh-spotify-token' })
    }
  }, [update, curUser])

  return spotifyApi
}

export default useSpotify
