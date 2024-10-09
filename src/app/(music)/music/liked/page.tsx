'use client'

import Divider from '@/components/Divider'
import Menu from '@/components/music/Menu'
import Track from '@/components/music/Track'
import { shuffleBGs } from '@/constants/music'
import { useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { getUserName } from '@/utils/string'
import { duration } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function LikedPage() {
  // hooks
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const tracks: any[] = useAppSelector(state => state.music.likedTracks)
  // const [tracks, setTracks] = useState<any[]>([])

  // useEffect(() => {
  //   const getSavedTracks = async () => {
  //     try {
  //       const { body } = await spotifyApi.getMySavedTracks()

  //       // set tracks
  //       setTracks(body.items.map((item: any) => item.track))
  //     } catch (err: any) {
  //       console.log(err)
  //     }
  //   }

  //   getSavedTracks()
  // }, [spotifyApi])

  return (
    <div className="w-full overflow-y-auto">
      {/* Banner */}
      <div
        className={`relative flex h-80 items-end px-2 ${shuffleBGs[Math.floor(Math.random() * shuffleBGs.length)]}`}
      >
        {/* Menu */}
        <Menu />

        {/* Playlist */}
        <div className="flex gap-21">
          <div className="aspect-square max-h-[200px] max-w-[200px] overflow-hidden rounded-lg shadow-lg">
            <Image
              className="h-full w-full object-cover"
              src="/backgrounds/liked-songs.png"
              width={200}
              height={200}
              alt="liked-songs"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <h1 className="text-5xl font-semibold tracking-wider">Liked Songs</h1>
            <p className="border-b font-semibold">{getUserName(curUser)}</p>
            <p className="text-sm font-semibold">
              {tracks.length} songs -{' '}
              {duration(tracks.reduce((total, track) => total + track.duration_ms, 0))}
            </p>
          </div>
        </div>
      </div>

      <Divider size={8} />

      {/* Songs */}
      <div className="p-2">
        {tracks.length > 0 && (
          <div className="flex flex-col gap-2">
            {tracks.map((track, index) => (
              <Track
                order={index + 1}
                track={track}
                key={track.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LikedPage
