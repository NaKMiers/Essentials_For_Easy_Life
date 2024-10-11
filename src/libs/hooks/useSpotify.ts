import spotifyApi from '@/libs/spotify'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

function useSpotify() {
  const { data: session } = useSession()

  useEffect(() => {
    const ss: any = session

    if (ss) {
      if (ss.error === 'RefreshAccessTokenError') {
        signIn('spotify')
      }

      spotifyApi.setAccessToken(ss.user.spotifyAccessToken)
    }
  }, [session])

  return spotifyApi
}

export default useSpotify
