'use client'

import Divider from '@/components/Divider'
import Menu from '@/components/music/Menu'
import Track from '@/components/music/Track'
import { shuffleBGs } from '@/constants/music'
import useSpotify from '@/libs/hooks/useSpotify'
import { duration } from '@/utils/time'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

function PlaylistPage({ params: { id } }: { params: { id: string } }) {
  // hooks
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [playlist, setPlaylist] = useState<any>(null)

  // states
  const [tracks, setTracks] = useState<any[]>([])

  useEffect(() => {
    const getPlaylist = async () => {
      try {
        const { body } = await spotifyApi.getPlaylist(id)
        console.log('playlist', body)

        // set playlist
        setPlaylist(body)

        // set tracks
        setTracks(body.tracks.items.map((item: any) => item.track))
      } catch (err: any) {
        console.log(err)
      }
    }

    getPlaylist()
  }, [spotifyApi])

  return (
    <div className="w-full overflow-y-auto">
      {/* Banner */}
      <div
        className={`relative flex h-80 items-end px-2 ${shuffleBGs[Math.floor(Math.random() * (shuffleBGs.length - 1))]}`}
      >
        {/* Menu */}
        <Menu />

        {/* Playlist */}
        {playlist && (
          <div className="flex gap-21">
            <div className="aspect-square max-h-[200px] max-w-[200px] overflow-hidden rounded-lg shadow-lg">
              <Image
                className="h-full w-full object-cover"
                src={playlist.images[0].url}
                width={200}
                height={200}
                alt={playlist.name}
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <h1 className="text-5xl font-semibold tracking-wider">{playlist.name}</h1>
              <div className="inline-block rounded-3xl bg-white px-4 py-1.5 font-body text-sm font-semibold tracking-wider text-dark">
                {playlist.public ? 'Public' : 'Private'} Playlist
              </div>
              <p className="border-b font-semibold">{playlist.owner.display_name}</p>
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
        <div
          className={`gap-2px-2 mb-3 grid grid-cols-12 border-b border-slate-800 py-0.5 pb-3 text-sm font-semibold`}
        >
          <div className="col-span-5 flex items-center gap-2">
            <span className="mr-3 font-body text-sm tracking-wider text-slate-400">#</span>
            <span>Title</span>
          </div>

          <div className="col-span-2 text-center">Preview</div>

          <div className="col-span-4">Album</div>

          <div className="col-span-1 text-center">Duration</div>
        </div>
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

export default PlaylistPage
