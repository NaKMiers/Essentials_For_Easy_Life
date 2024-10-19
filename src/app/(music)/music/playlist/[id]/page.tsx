'use client'

import Divider from '@/components/Divider'
import Track from '@/components/music/Track'
import useSpotify from '@/libs/hooks/useSpotify'
import { duration } from '@/utils/time'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function PlaylistPage({ params: { id } }: { params: { id: string } }) {
  // hooks
  const spotifyApi = useSpotify()

  // states
  const [playlist, setPlaylist] = useState<any>(null)

  // states
  const [tracks, setTracks] = useState<any[]>([])

  useEffect(() => {
    const getPlaylist = async () => {
      try {
        const { body } = await spotifyApi.getPlaylist(id)

        // set playlist
        setPlaylist(body)

        // set tracks
        setTracks(body.tracks.items.map((item: any) => item.track))
      } catch (err: any) {
        console.log(err)
      }
    }

    getPlaylist()
  }, [spotifyApi, id])

  return (
    <div className="w-full overflow-y-auto">
      {/* Banner */}
      <div
        className={`relative flex h-80 items-end bg-gradient-to-t from-neutral-200 to-purple-500 px-2 pb-2 text-light`}
      >
        {/* Playlist */}
        {playlist && (
          <div className="flex gap-21">
            <div className="aspect-square max-h-[200px] max-w-[200px] overflow-hidden rounded-lg shadow-lg">
              <Image
                className="h-full w-full object-cover"
                src={playlist?.images?.[0]?.url || '/images/default-playlist.png'}
                width={200}
                height={200}
                alt={playlist.name}
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <h1 className="text-5xl font-semibold tracking-wider">{playlist.name}</h1>
              <div className="line-clamp-1 inline-block text-ellipsis text-nowrap rounded-3xl bg-white px-4 py-1.5 font-body text-sm font-semibold tracking-wider text-dark">
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
          className={`gap-2px-2 mb-3 hidden grid-cols-12 border-b border-slate-800 py-0.5 pb-3 text-sm font-semibold md:grid`}
        >
          <div className="col-span-5 flex items-center gap-2">
            <span className="mr-3 font-body text-sm tracking-wider text-slate-400">#</span>
            <span>Title</span>
          </div>

          <div className="col-span-2 text-center">Preview</div>

          <div className="col-span-3">Album</div>

          <div className="col-span-2 text-center">Duration</div>
        </div>
        {tracks.length > 0 && (
          <div className="flex flex-col gap-2">
            {tracks.map((track, index) => (
              <Track
                order={index + 1}
                prevTracks={tracks.slice(index - 2, index)}
                track={track}
                nextTracks={tracks.slice(index + 1, index + 3)}
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
