import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import {
  setCurPreviewTrack,
  setCurTrack,
  setIsPlaying,
  setLikedTracks,
} from '@/libs/reducers/musicReducer'
import { duration } from '@/utils/time'
import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaPlusCircle } from 'react-icons/fa'

interface TrackProps {
  track: any
  order: number
  className?: string
}

function Track({ track, order, className }: TrackProps) {
  // hooks
  const spotifyApi = useSpotify()
  const dispatch = useAppDispatch()
  const curPreviewTrack: any = useAppSelector(state => state.music.curPreviewTrack)
  const likedTracks: any[] = useAppSelector(state => state.music.likedTracks)

  // ref
  const audioReviewRef = useRef<HTMLAudioElement>(null)

  // value
  const liked = likedTracks.some(likedTrack => likedTrack.id === track.id)

  // play preview track
  useEffect(() => {
    const audioPreview = audioReviewRef.current
    if (!audioPreview) return

    if (curPreviewTrack?.id === track.id) {
      audioPreview.play()
    } else {
      audioPreview.pause()
      audioPreview.currentTime = 0
    }
  }, [curPreviewTrack, track])

  // play track
  const handlePlayTrack = useCallback(async () => {
    try {
      const res = await spotifyApi.getMyDevices()
      console.log(res.body)

      dispatch(setCurTrack(track))
      dispatch(setIsPlaying(true))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, track])

  // add to liked songs
  const handleLikeTrack = useCallback(async () => {
    try {
      await spotifyApi.addToMySavedTracks([track.id])
      dispatch(setLikedTracks([...likedTracks, track]))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, likedTracks, spotifyApi, track])

  // remove from liked songs
  const handleUnlikeTrack = useCallback(async () => {
    try {
      await spotifyApi.removeFromMySavedTracks([track.id])
      dispatch(setLikedTracks(likedTracks.filter(likedTrack => likedTrack.id !== track.id)))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, likedTracks, spotifyApi, track])

  return (
    <div
      className={`trans-200 grid cursor-pointer grid-cols-12 gap-2 rounded-lg bg-opacity-40 px-2 py-0.5 hover:bg-slate-800 ${className}`}
      onClick={handlePlayTrack}
    >
      <div className="col-span-5 flex items-center gap-2">
        <span className="mr-2 font-body text-sm tracking-wider text-slate-400">{order}</span>
        <div className="flex items-center gap-2">
          <div className="aspect-square max-h-10 max-w-10 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            <Image
              src={track.album?.images[0]?.url}
              width={40}
              height={40}
              alt={track.name}
            />
          </div>
          <div className="flex flex-col">
            <p className="line-clamp-1 text-ellipsis">{track.name}</p>
            <p className="font-body text-sm tracking-wider text-slate-300">
              {track.artists.map((artist: any) => artist.name).join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div
        className="col-span-2 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="trans-200 rounded-3xl border-2 border-light px-2 py-1 text-xs font-semibold hover:bg-white hover:text-dark"
          onClick={() => dispatch(setCurPreviewTrack(curPreviewTrack?.id === track.id ? null : track))}
        >
          {curPreviewTrack?.id === track.id ? 'Playing...' : 'Preview'}
        </button>
        <audio
          hidden
          src={track.preview_url}
          ref={audioReviewRef}
        />
      </div>

      <div className="col-span-4 flex items-center">
        <p className="text-sm">{track.album.name}</p>
      </div>

      <div
        className="col-span-1 flex items-center justify-between gap-2 text-center font-body text-sm tracking-wider"
        onClick={e => e.stopPropagation()}
      >
        {duration(track.duration_ms)}
        {liked ? (
          <button
            title="Remove from liked songs"
            className="group"
            onClick={handleUnlikeTrack}
          >
            <FaCheck
              className="wiggle text-green-500"
              size={16}
            />
          </button>
        ) : (
          <button
            title="Add to liked songs"
            className="group"
            onClick={handleLikeTrack}
          >
            <FaPlusCircle
              className="wiggle -mb-0.5"
              size={16}
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default Track
