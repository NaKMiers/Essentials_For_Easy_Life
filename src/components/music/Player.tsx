'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { setCurTrack, setIsPlaying } from '@/libs/reducers/musicReducer'
import { duration } from '@/utils/time'
import { Slider } from '@mui/material'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiSolidSkipNextCircle, BiSolidSkipPreviousCircle } from 'react-icons/bi'
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { RiLoopLeftFill } from 'react-icons/ri'
import { TiArrowShuffle } from 'react-icons/ti'

function Player() {
  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()
  const { data: session } = useSession()

  // stores
  const curTrack: any = useAppSelector(state => state.music.curTrack)
  const prevTracks: any[] = useAppSelector(state => state.music.prevTracks)
  const nextTracks: any[] = useAppSelector(state => state.music.nextTracks)
  const isPlaying: boolean = useAppSelector(state => state.music.isPlaying)

  // states
  const [volume, setVolume] = useState<number>(100)
  const [isMuted, setIsMuted] = useState(false)
  const [deviceId, setDeviceId] = useState<string>('')
  const [player, setPlayer] = useState<any>(null)
  const [trackPosition, setTrackPosition] = useState<number>(0) // ms
  const [trackDuration, setTrackDuration] = useState<number>(0) // ms
  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [repeatMode, setRepeatMode] = useState<number>(0)

  // Initialize Spotify Player
  useEffect(() => {
    const wd: any = window

    // Function to initialize the Spotify player once the SDK is ready
    const initializeSpotifyPlayer = () => {
      if (wd.Spotify && session && spotifyApi.getAccessToken()) {
        const token = spotifyApi.getAccessToken()

        const spotifyPlayer = new wd.Spotify.Player({
          name: 'EFEL Spotify Player',
          getOAuthToken: (cb: any) => cb(token),
          volume: 1,
        })

        spotifyPlayer.addListener('ready', ({ device_id }: any) => {
          setDeviceId(device_id)

          spotifyApi
            .transferMyPlayback([device_id], { play: true })
            .then(() => {
              console.log('Transferred playback to localhost')
            })
            .catch(err => console.error('Error transferring playback', err))
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

            // update current track
            const currentTrack = state.track_window.current_track
            if (lastTrack?.id !== currentTrack?.id || lastPausedState !== isPaused) {
              dispatch(setCurTrack({ ...currentTrack, noRePlay: true }))

              lastTrack = currentTrack
              lastPausedState = isPaused
            }

            // update shuffle state
            setIsShuffle(state.shuffle)

            // update loop state
            setRepeatMode(state.repeat_mode)

            // update track position
            setTrackDuration(state.duration)
            setTrackPosition(state.position)
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
  }, [dispatch, player, isPlaying, spotifyApi])

  // play track on device
  const playTrack = useCallback(async () => {
    if (!deviceId || !curTrack) return

    const uris = [
      ...prevTracks?.map(track => track.uri),
      curTrack.uri,
      ...nextTracks?.map(track => track.uri),
    ]

    await spotifyApi
      .play({
        device_id: deviceId,
        uris,
        offset: { uri: curTrack.uri },
      })
      .catch(err => {
        console.error(err)
        toast.error('Error playing track')
      })
  }, [curTrack, deviceId, spotifyApi, prevTracks, nextTracks])

  // previous track
  const previousTrack = useCallback(async () => {
    if (!player) return

    spotifyApi.skipToPrevious().catch(error => console.error('Previous track error:', error))
  }, [spotifyApi, player])

  // next track
  const nextTrack = useCallback(async () => {
    if (!player) return

    spotifyApi.skipToNext().catch(error => console.error('Next track error:', error))
  }, [spotifyApi, player])

  // set shuffle
  const changeShuffle = useCallback(async () => {
    if (!player) return

    spotifyApi.setShuffle(!isShuffle).catch(error => console.error('Shuffle error:', error))
  }, [spotifyApi, player, isShuffle])

  // set repeat mode
  const changeRepeatMode = useCallback(async () => {
    if (!player) return

    const repeatModes = ['off', 'context', 'track']
    spotifyApi
      .setRepeat(repeatModes[repeatMode === 2 ? 0 : repeatMode + 1] as any)
      .catch(error => console.error('Repeat mode error:', error))
  }, [spotifyApi, player, repeatMode])

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
    (_: any, newValue: number | number[]) => {
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
  }, [player, isMuted])

  useEffect(() => {
    if (curTrack && deviceId && !curTrack.noRePlay) {
      playTrack()
    }
  }, [curTrack, deviceId, playTrack])

  return (
    <div className="h-[158px] w-full p-3 md:h-[100px]">
      <div className="grid h-full w-full grid-cols-3 gap-2 rounded-xl bg-neutral-200 px-4 py-2 text-dark md:py-0 md:pt-0">
        {/* Track Info */}
        <div className="col-span-2 flex items-center gap-2 max-md:order-1 md:col-span-1">
          {curTrack && (
            <>
              <div className="aspect-square max-h-[50px] max-w-[50px] flex-shrink-0 overflow-hidden rounded-md shadow-lg">
                <Image
                  src={curTrack.album?.images[0].url}
                  width={45}
                  height={45}
                  alt={curTrack.name}
                />
              </div>
              <div className="flex flex-col">
                <p
                  className="line-clamp-1 text-ellipsis"
                  title={curTrack.name}
                >
                  {curTrack.name}
                </p>
                <p
                  className="line-clamp-1 text-ellipsis font-body text-sm tracking-wider text-slate-500"
                  title={curTrack.artists.map((artist: any) => artist.name).join(', ')}
                >
                  {curTrack.artists.map((artist: any) => artist.name).join(', ')}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="col-span-3 flex flex-col items-center justify-center gap-1 max-md:order-3 md:col-span-1">
          {/* Play/Pause Control */}
          <div className="flex items-center gap-4 sm:gap-7">
            <button
              className="group"
              onClick={changeShuffle}
            >
              <TiArrowShuffle
                size={22}
                className={`wiggle ${isShuffle ? 'text-sky-500' : ''}`}
              />
            </button>
            <button
              className="group"
              onClick={previousTrack}
            >
              <BiSolidSkipPreviousCircle
                size={26}
                className="wiggle"
              />
            </button>
            <button
              className="group"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <FaCirclePause
                  size={30}
                  className="wiggle"
                />
              ) : (
                <FaCirclePlay
                  size={30}
                  className="wiggle"
                />
              )}
            </button>
            <button
              className="group"
              onClick={nextTrack}
            >
              <BiSolidSkipNextCircle
                size={26}
                className="wiggle"
              />
            </button>
            <button
              className="group relative"
              onClick={changeRepeatMode}
            >
              {repeatMode > 0 && (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold text-green-500">
                  {repeatMode}
                </span>
              )}
              <RiLoopLeftFill
                size={20}
                className={`wiggle ${repeatMode ? 'text-sky-500' : ''}`}
              />
            </button>
          </div>

          {/* Seek Control */}
          <div className="flex w-full items-center gap-3">
            <span className="text-sm">{trackPosition ? duration(trackPosition) : '00:00'}</span>
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
            <span className="text-sm">{trackDuration ? duration(trackDuration) : '00:00'}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="col-span-1 flex items-center justify-end gap-3 max-md:order-2">
          <button
            className="group peer flex items-center justify-center"
            onClick={toggleMute}
          >
            {volume > 0 ? (
              <HiSpeakerWave
                size={23}
                className="flex-shrink-0"
              />
            ) : (
              <HiSpeakerXMark
                size={23}
                className="flex-shrink-0"
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
    </div>
  )
}

export default Player
