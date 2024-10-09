'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { setCurTrack, setIsPlaying } from '@/libs/reducers/musicReducer'
import { Slider } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { debounce } from 'lodash'
import { duration } from '@/utils/time'

function Player() {
  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curTrack: any = useAppSelector(state => state.music.curTrack)
  const isPlaying: boolean = useAppSelector(state => state.music.isPlaying)

  // states
  const [volume, setVolume] = useState<number>(100)
  const [isMuted, setIsMuted] = useState(false)
  const [deviceId, setDeviceId] = useState<string>('')
  const [player, setPlayer] = useState<any>(null)
  const [trackPosition, setTrackPosition] = useState<number>(0)
  const [isChangingTrack, setIsChangingTrack] = useState<boolean>(false)

  // Initialize Spotify Player
  useEffect(() => {
    const wd: any = window

    // Function to initialize the Spotify player once the SDK is ready
    const initializeSpotifyPlayer = () => {
      console.log('wd.Spotify', wd.Spotify)

      if (wd.Spotify && session && spotifyApi.getAccessToken()) {
        const token = spotifyApi.getAccessToken()

        const spotifyPlayer = new wd.Spotify.Player({
          name: 'EFEL Spotify Player',
          getOAuthToken: (cb: any) => cb(token),
          volume: 1,
        })

        spotifyPlayer.addListener('ready', ({ device_id }: any) => {
          console.log('Ready with Device ID', device_id)
          setDeviceId(device_id)
        })

        spotifyPlayer.addListener('not_ready', ({ device_id }: any) => {
          console.log('Device ID has gone offline', device_id)
        })

        let lastTrack: any = null
        let lastPausedState: any = null

        spotifyPlayer.addListener(
          'player_state_changed',
          debounce((state: any) => {
            console.log('Player State Changed', state)
            console.log('state.device_id', state.device_id)
            if (!state) return

            // update playing state
            const isPaused = state.paused
            dispatch(setIsPlaying(!isPaused))

            const currentTrack = state.track_window.current_track

            if (lastTrack?.id !== currentTrack.id || lastPausedState !== isPaused) {
              console.log('re-dispatching track')
              dispatch(setCurTrack({ ...currentTrack, noRePlay: true }))

              lastTrack = currentTrack
              lastPausedState = isPaused
            }

            // update track position
            const currentPosition = state.position
            const duration = state.duration
            setTrackPosition(currentPosition)
          }, 1000)
        )

        spotifyPlayer.connect()
        setPlayer(spotifyPlayer)
      }
    }

    // Check if Spotify SDK is available, retry if not
    const checkSpotify = () => {
      if (wd.Spotify) {
        initializeSpotifyPlayer()
      } else {
        console.log('Spotify SDK not available yet, retrying...')
        setTimeout(checkSpotify, 1000) // Retry after 1 second
      }
    }

    checkSpotify()
  }, [session, spotifyApi, dispatch])

  // Play/Pause track
  const handlePlayPause = useCallback(async () => {
    if (!player) return

    if (!isPlaying) {
      // await player.resume()
      await spotifyApi.play()
    } else {
      // await player.pause()
      await spotifyApi.pause()
    }

    dispatch(setIsPlaying(!isPlaying))
  }, [dispatch, player, isPlaying])

  // Play track on device
  const playTrack = useCallback(async () => {
    if (!deviceId || !curTrack) return

    await spotifyApi
      .play({
        device_id: deviceId,
        uris: [curTrack.uri],
      })
      .catch(err => {
        console.error(err)
        toast.error('Error playing track')
      })
  }, [curTrack, deviceId, spotifyApi])

  // auto seek track position
  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        player.getCurrentState().then((state: any) => {
          if (state) {
            setTrackPosition(state.position)
          }
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [player])

  // Handle volume change
  const handleVolumeChange = useCallback(
    (event: any, newValue: number | number[]) => {
      if (Array.isArray(newValue)) return
      setVolume(newValue)
      player?.setVolume(newValue / 100).catch((err: any) => console.error(err))
    },
    [player]
  )

  // Mute/Unmute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
    setVolume(isMuted ? 50 : 0)
    player?.setVolume(isMuted ? 0.5 : 0).catch((err: any) => console.error(err))
  }, [player])

  useEffect(() => {
    if (curTrack && deviceId && !curTrack.noRePlay) {
      playTrack()
    }
  }, [curTrack, deviceId, playTrack])

  return (
    <div className="grid min-h-[74px] grid-cols-3 px-4 py-3">
      {/* Track Info */}
      <div className="flex items-center gap-2">
        {curTrack && (
          <>
            <div className="aspect-square max-h-[50px] max-w-[50px] overflow-hidden rounded-md shadow-lg">
              <Image
                src={curTrack.album?.images[0].url}
                width={50}
                height={50}
                alt={curTrack.name}
              />
            </div>
            <div className="flex flex-col">
              <p>{curTrack.name}</p>
              <p className="font-body text-sm tracking-wider text-slate-300">
                {curTrack.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        {/* Play/Pause Control */}
        <button onClick={handlePlayPause}>
          {isPlaying ? (
            <FaCirclePause
              size={30}
              className="text-light"
            />
          ) : (
            <FaCirclePlay
              size={30}
              className="text-light"
            />
          )}
        </button>

        {/* Seek Control */}
        <div className="w-full">
          <Slider
            value={trackPosition}
            onChange={(event, newValue) => {
              setTrackPosition(newValue as number)
              player?.seek(newValue).catch((err: any) => console.error(err))
            }}
            color="warning"
            min={0}
            max={curTrack?.duration_ms || 0}
            valueLabelFormat={value => duration(value as number)}
            valueLabelDisplay="auto"
          />
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end gap-3">
        <button
          className="group peer flex items-center justify-center"
          onClick={toggleMute}
        >
          {volume > 0 ? (
            <HiSpeakerWave
              size={23}
              className="flex-shrink-0 text-light"
            />
          ) : (
            <HiSpeakerXMark
              size={23}
              className="flex-shrink-0 text-light"
            />
          )}
        </button>
        <div className="-mb-2 mr-2 w-[135px]">
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            color="info"
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
    </div>
  )
}

export default Player
