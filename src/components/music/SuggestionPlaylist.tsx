import useSpotify from '@/libs/hooks/useSpotify'
import Image from 'next/image'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setPlaylists } from '@/libs/reducers/musicReducer'
import { useSession } from 'next-auth/react'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { RiDonutChartFill } from 'react-icons/ri'
import { PreviewItem } from './PlaylistWithTracks'

interface PlaylistWithTracksProps {
  tracks: any[]
  className?: string
}

function SuggestionPlaylist({ tracks, className = '' }: PlaylistWithTracksProps) {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()

  // stores
  const playlists: any[] = useAppSelector(state => state.music.playlists)

  // states
  const [isCollapse, setIsCollapse] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('AI Suggestion Playlist')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // save suggestion playlist
  const savePlaylist = useCallback(async () => {
    if (!curUser?.spotifyId) {
      toast.error('Please connect to spotify to do this action')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter playlist title')
      return
    }

    // start saving
    setIsSaving(true)

    try {
      // create new playlist
      const { body: newPlaylist } = await spotifyApi.createPlaylist(curUser.spotifyId, {
        name: title,
        public: true,
      } as any)

      // // add suggested tracks to new playlist
      await spotifyApi.addTracksToPlaylist(
        newPlaylist.id,
        tracks.map(t => t.uri)
      )

      // add new playlist to state
      dispatch(setPlaylists([newPlaylist, ...playlists]))

      // show success message
      toast.success('Saved Playlist')
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop saving
      setIsSaving(false)
    }
  }, [tracks, dispatch, playlists, curUser?.spotifyId, spotifyApi, title])

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-lg ${className}`}>
      <div
        className="flex flex-col items-center bg-slate-100 max-md:cursor-pointer"
        onClick={() => setIsCollapse(prev => !prev)}
      >
        <div className="flex w-full">
          <input
            className="w-full px-2 py-2 text-center outline-none"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onClick={e => e.stopPropagation()}
            required
          />

          <button
            className={`trans-200 flex items-center justify-center bg-green-500 px-2 py-0.5 text-light ${isSaving ? 'pointer-events-none' : ''}`}
            disabled={isSaving}
            onClick={e => {
              e.stopPropagation()
              savePlaylist()
            }}
          >
            {isSaving ? (
              <RiDonutChartFill
                size={20}
                className="animate-spin"
              />
            ) : (
              'Save'
            )}
          </button>
        </div>

        <p className="py-2 text-center text-xs text-slate-500">{tracks.length} songs</p>
      </div>

      <div
        className={`trans-300 flex flex-col overflow-y-auto md:mt-3 md:max-h-[400px] ${isCollapse ? 'mt-3 max-h-[400px]' : 'mt-0 max-h-0'}`}
      >
        {tracks.map((track: any) => (
          <div
            className="trans-200 flex cursor-pointer items-start gap-1.5 px-2 py-1 hover:bg-green-200"
            key={track.id}
          >
            <div className="aspect-square max-w-[40px] flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={track?.album?.images?.[0]?.url}
                width={40}
                height={40}
                alt={track.name}
              />
            </div>

            <div className="flex flex-1 flex-col">
              <p
                className="-mt-1 text-sm font-semibold"
                title={track.name}
              >
                {track.name.length > 20 ? track.name.slice(0, 20 - 3) + '...' : track.name}
              </p>
              <p className="font-body text-sm tracking-wider text-slate-500">
                {track.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>

            <div>
              <PreviewItem track={track} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(SuggestionPlaylist)
