'use client'

import Divider from '@/components/Divider'
import Track from '@/components/music/Track'
import { shuffleBGs } from '@/constants/music'
import { useAppSelector } from '@/libs/hooks'
import { getUserName } from '@/utils/string'
import { duration } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function LikedPage() {
  // hooks
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  if (!curUser) {
    router.back()
  }

  // states
  const tracks: any[] = useAppSelector(state => state.music.likedTracks)

  return (
    <div className="w-full overflow-y-auto">
      {/* Banner */}
      <div
        className={`relative flex h-80 items-end bg-gradient-to-t from-neutral-200 to-purple-500 px-2 pb-2 text-light`}
      >
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
        <div
          className={`gap-2px-2 mb-3 hidden grid-cols-12 border-b border-slate-800 py-0.5 pb-3 text-sm font-semibold md:grid`}
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

export default LikedPage
