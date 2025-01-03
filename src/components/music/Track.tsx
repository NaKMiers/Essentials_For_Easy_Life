import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import {
  setCurPreviewTrack,
  setCurTrack,
  setIsPlaying,
  setLikedTracks,
  setNextTracks,
  setPrevTracks,
} from '@/libs/reducers/musicReducer'
import { duration } from '@/utils/time'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaCloudDownloadAlt, FaPlusCircle } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

interface TrackProps {
  prevTracks: any[]
  track: any
  nextTracks: any[]
  order: number
  className?: string
}

function Track({ track, order, prevTracks, nextTracks, className }: TrackProps) {
  // hooks
  const spotifyApi = useSpotify()
  const dispatch = useAppDispatch()

  // stores
  const curPreviewTrack: any = useAppSelector(state => state.music.curPreviewTrack)
  const likedTracks: any[] = useAppSelector(state => state.music.likedTracks)
  const isPlaying: boolean = useAppSelector(state => state.music.isPlaying)

  // states
  const [downloading, setDownloading] = useState<boolean>(false)

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
      spotifyApi.pause()
    } else {
      audioPreview.pause()
      audioPreview.currentTime = 0
    }
  }, [curPreviewTrack, track, spotifyApi])

  // play track
  const handlePlayTrack = useCallback(async () => {
    try {
      dispatch(setPrevTracks(prevTracks))
      dispatch(setCurTrack(track))
      dispatch(setNextTracks(nextTracks))
      dispatch(setIsPlaying(true))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, track, nextTracks, prevTracks])

  // remove track from liked
  const handleRemoveFromLiked = useCallback(async () => {
    try {
      await spotifyApi.removeFromMySavedTracks([track.id])

      // update liked tracks
      dispatch(setLikedTracks(likedTracks.filter(likedTrack => likedTrack.id !== track.id)))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, spotifyApi, track, likedTracks])

  // add track to liked
  const handleAddToLiked = useCallback(async () => {
    try {
      await spotifyApi.addToMySavedTracks([track.id])

      // update liked tracks
      dispatch(setLikedTracks([...likedTracks, track]))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, spotifyApi, track, likedTracks])

  // download track
  const handleDownloadTrack = useCallback(async () => {
    // start downloading
    setDownloading(true)

    try {
      const res = await fetch(
        `https://spotify-downloader9.p.rapidapi.com/downloadSong?songId=${track.external_urls.spotify}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com',
          },
        }
      )
      const { data, success } = await res.json()

      // download failed
      if (!success) {
        toast.error('Download failed, please try again later')
        return
      }

      if (data && data.downloadLink) {
        location.href = data.downloadLink
      }
    } catch (error) {
      console.error(error)
    } finally {
      // stop downloading
      setDownloading(false)
    }
  }, [track])

  return (
    <div
      className={`trans-200 group grid cursor-pointer grid-cols-2 gap-2 rounded-lg bg-opacity-40 px-2 py-1.5 text-dark hover:bg-slate-800 hover:text-light md:grid-cols-12 ${className}`}
      onClick={handlePlayTrack}
    >
      <div className="item-start col-span-2 flex gap-2 max-md:order-1 md:col-span-5 md:items-center">
        <span className="mr-2 font-body text-sm tracking-wider text-slate-400">{order}</span>
        <div className="item-start flex flex-wrap gap-2">
          <div className="aspect-square max-h-10 max-w-10 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            <Image
              src={track?.album?.images?.[0]?.url}
              width={40}
              height={40}
              alt={track.name}
            />
          </div>
          <div className="flex flex-col">
            <p className="line-clamp-1 text-ellipsis">{track.name}</p>
            <p className="font-body text-sm tracking-wider text-slate-500">
              {track.artists.map((artist: any) => artist.name).join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div
        className="col-span-1 flex items-center gap-1 px-8 max-md:order-3 md:col-span-2 md:justify-center md:px-0"
        onClick={e => e.stopPropagation()}
      >
        <button
          className={`trans-200 rounded-3xl border-2 border-dark px-2 py-1 text-xs font-semibold hover:bg-white hover:text-dark group-hover:border-white ${
            curPreviewTrack?.id === track.id ? 'bg-white text-dark' : ''
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

      <div className="col-span-2 hidden items-center px-8 max-md:order-3 md:col-span-3 md:flex md:px-0">
        <p className="rounded-3xl text-sm">{track.album.name}</p>
      </div>

      {/* Duration & Save Track & Download */}
      <div
        className="col-span-2 flex items-center justify-start gap-2 px-8 text-center font-body text-sm tracking-wider max-md:order-2 md:col-span-2 md:justify-center md:px-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Duration */}
        {duration(track.duration_ms)}

        {/* Save Track */}
        {liked ? (
          <button
            className="group"
            title="Remove from liked songs"
            onClick={handleRemoveFromLiked}
          >
            <FaCheck
              className="wiggle text-green-500"
              size={16}
            />
          </button>
        ) : (
          <button
            className="group"
            title="Add to liked songs"
            onClick={handleAddToLiked}
          >
            <FaPlusCircle
              className="wiggle text-slate-400"
              size={16}
            />
          </button>
        )}

        {/* Download */}
        <button
          className={`trans-200 flex items-center justify-center rounded-full border-2 border-dark p-1 hover:border-light hover:bg-white hover:text-dark ${downloading ? 'pointer-events-none' : ''}`}
          onClick={e => {
            e.stopPropagation()
            handleDownloadTrack()
          }}
          disabled={downloading}
        >
          {downloading ? (
            <RiDonutChartFill
              size={16}
              className="animate-spin text-slate-500"
            />
          ) : (
            <FaCloudDownloadAlt size={16} />
          )}
        </button>
      </div>
    </div>
  )
}

export default Track
