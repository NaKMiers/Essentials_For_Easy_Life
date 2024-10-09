'use client'

import Image from 'next/image'
import { FaChevronDown } from 'react-icons/fa'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useAppSelector } from '@/libs/hooks'
import { useEffect, useState } from 'react'
import useSpotify from '@/libs/hooks/useSpotify'
import Track from './Track'
import Divider from '../Divider'
import { duration } from '@/utils/time'

function Center() {
  // hooks
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const curPlaylist: any = useAppSelector(state => state.music.curPlaylist)

  // states
  const [tracks, setTracks] = useState<any[]>([])

  useEffect(() => {
    const getPlaylist = async () => {
      if (!curPlaylist) return

      try {
        const res = await spotifyApi.getPlaylist(curPlaylist.id)
        console.log(res.body.tracks.items)
        setTracks(res.body.tracks.items.map((item: any) => item.track))
      } catch (err: any) {
        console.log(err)
      }
    }

    getPlaylist()
  }, [curPlaylist, spotifyApi])

  return (
    <div className="w-full overflow-y-auto">
      {/* Banner */}
      <div className="relative flex h-80 items-end bg-gradient-to-b from-cyan-400 to-neutral-950 px-2">
        {/* User */}
        <button
          className="group absolute right-10 top-21 flex min-h-[40px] min-w-[100px] items-center justify-between gap-2 rounded-3xl bg-pink-300 p-1 shadow-lg"
          onClick={() => (curUser ? signOut() : signIn('spotify'))}
        >
          {curUser ? (
            <>
              <div className="aspect-square h-full max-h-[40px] w-full max-w-[40px] overflow-hidden rounded-full">
                <Image
                  className="h-full w-full object-cover"
                  src={curUser?.avatar}
                  height={40}
                  width={40}
                  alt="avatar"
                />
              </div>

              <span className="font-semibold text-dark">{curUser.name}</span>

              <FaChevronDown
                size={16}
                className="wiggle mr-2 text-dark"
              />
            </>
          ) : (
            <p className="w-full text-center font-semibold text-dark">Sign In</p>
          )}
        </button>

        {/* Playlist */}
        {curPlaylist && (
          <div className="flex gap-21">
            <div className="aspect-square max-h-[200px] max-w-[200px] overflow-hidden rounded-lg shadow-lg">
              <Image
                className="h-full w-full object-cover"
                src={curPlaylist.images[0].url}
                width={200}
                height={200}
                alt={curPlaylist.name}
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <h1 className="text-5xl font-semibold tracking-wider">{curPlaylist.name}</h1>
              <div className="inline-block rounded-3xl bg-white px-4 py-1.5 font-body text-sm font-semibold tracking-wider text-dark">
                {curPlaylist.public ? 'Public' : 'Private'} Playlist
              </div>
              <p className="border-b font-semibold">{curPlaylist.owner.display_name}</p>
              <p className="text-sm font-semibold">
                {tracks.length} songs -{' '}
                {duration(tracks.reduce((total, track) => total + track.duration_ms, 0))}
              </p>
            </div>
          </div>
        )}
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

export default Center
