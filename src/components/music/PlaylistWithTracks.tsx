import useSpotify from '@/libs/hooks/useSpotify'
import Image from 'next/image'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCurPreviewTrack, setIsPlaying, setSelectedTracks } from '@/libs/reducers/musicReducer'
import { memo, useEffect, useRef, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface PlaylistWithTracksProps {
  playlist: any
  className?: string
}

function PlaylistWithTracks({ playlist, className = '' }: PlaylistWithTracksProps) {
  // hook
  const dispatch = useAppDispatch()

  // store
  const selectedTracks: any[] = useAppSelector(state => state.music.selectedTracks)

  // states
  const [isCollapse, setIsCollapse] = useState<boolean>(false)

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-lg ${className}`}>
      <div
        className="flex gap-2 bg-slate-100 shadow-lg max-md:cursor-pointer"
        onClick={() => setIsCollapse(prev => !prev)}
      >
        <div className="aspect-square max-w-[80px] flex-shrink-0">
          <Image
            src={playlist?.images?.[0]?.url || '/images/default-playlist.png'}
            width={80}
            height={80}
            alt={playlist.name}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{playlist.name}</p>
          <p className="text-xs text-slate-500">{playlist.tracks.length} songs</p>
        </div>
      </div>

      <div
        className={`trans-300 flex flex-col overflow-y-auto md:mt-3 md:max-h-[300px] ${isCollapse ? 'mt-3 max-h-[300px]' : 'mt-0 max-h-0'}`}
      >
        {playlist.tracks.map((track: any) => (
          <div
            className={`trans-200 flex cursor-pointer items-start gap-1.5 px-2 py-1 hover:bg-green-200 ${selectedTracks.some(t => t.id === track.id) ? 'bg-green-300' : ''}`}
            onClick={() => {
              const isExist = selectedTracks.some((t: any) => t.id === track.id)
              if (!isExist && selectedTracks.length >= 3) {
                toast.error('Limit 3 tracks')
                return
              }
              dispatch(setSelectedTracks(track))
            }}
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

export function PreviewItem({ track, className = '' }: { track: any; className?: string }) {
  // hooks
  const spotifyApi = useSpotify()
  const dispatch = useAppDispatch()

  // stores
  const curPreviewTrack: any = useAppSelector(state => state.music.curPreviewTrack)
  const isPlaying: boolean = useAppSelector(state => state.music.isPlaying)

  // ref
  const audioReviewRef = useRef<HTMLAudioElement>(null)

  // play preview track
  useEffect(() => {
    const audioPreview = audioReviewRef.current
    if (!audioPreview) return

    if (curPreviewTrack?.id === track.id) {
      audioPreview.play()
      spotifyApi.pause()
    } else {
      audioPreview.pause()
      audioPreview.currentTime = 0
    }
  }, [curPreviewTrack, track, spotifyApi])

  return (
    <div
      className={`flex items-center ${className}`}
      onClick={e => e.stopPropagation()}
    >
      <button
        className={`trans-200 rounded-3xl border-2 border-dark px-1 py-0.5 text-[10px] font-semibold hover:bg-white hover:text-dark group-hover:border-white ${
          curPreviewTrack?.id === track.id ? 'bg-black text-light' : ''
        }`}
        onClick={() => {
          if (curPreviewTrack?.id === track.id) {
            if (isPlaying) {
              dispatch(setIsPlaying(false))
            }

            dispatch(setCurPreviewTrack(null))
          } else {
            dispatch(setCurPreviewTrack(track))
          }
        }}
      >
        {curPreviewTrack?.id === track.id ? 'Playing...' : 'Preview'}
      </button>
      <audio
        hidden
        src={track.preview_url}
        ref={audioReviewRef}
      />
    </div>
  )
}

export default memo(PlaylistWithTracks)
