'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

function ConnectSpotifyPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-21 bg-black pb-20">
      <div className="max-w-[300px] overflow-hidden">
        <Image
          className="h-full w-full object-cover"
          src="/images/spotify.png"
          width={2000}
          height={2000}
          alt="spotify"
        />
      </div>

      <button
        className="-mt-8 rounded-3xl bg-[#4ad661] px-3 py-2 font-semibold text-dark"
        onClick={() =>
          signIn('spotify', {
            redirect: true,
            callbackUrl: '/music',
          })
        }
      >
        Connect to Spotify
      </button>
    </div>
  )
}

export default ConnectSpotifyPage
