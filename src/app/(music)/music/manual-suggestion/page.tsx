'use client'

import PlaylistWithTracks from '@/components/music/PlaylistWithTracks'
import SearchBar from '@/components/music/SearchBar'
import SuggestedPlaylistModal from '@/components/music/SuggestedPlaylistModal'
import TrackItem from '@/components/music/TrackItem'
import { genres } from '@/constants/music'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { clearSelectedTracks, setSelectedTracks, setSelectedGenres } from '@/libs/reducers/musicReducer'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { FaEye } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

function SuggestPlaylistPage() {
  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()

  // stores
  const selectedTracks: any[] = useAppSelector(state => state.music.selectedTracks)
  const selectedGenres: string[] = useAppSelector(state => state.music.selectedGenres)
  const playlists: any[] = useAppSelector(state => state.music.playlists)

  // states
  const [result, setResult] = useState<any>(null)
  const [playlistsWithTracks, setPlaylistsWithTracks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [trackResults, setTrackResults] = useState<any[]>([])
  const [openResults, setOpenResults] = useState<boolean>(false)

  // get my playlists with tracks
  useEffect(() => {
    const getMyPlaylists = async () => {
      try {
        const playlistsWithTracks = await Promise.all(
          playlists.map(async (playlist: any) => {
            const { body: tracksData } = await spotifyApi.getPlaylistTracks(playlist.id)
            const tracks = tracksData.items.map(({ track }) => track)

            return {
              ...playlist,
              tracks,
            }
          })
        )

        setPlaylistsWithTracks(playlistsWithTracks)
        console.log('playlistsWithTracks:', playlistsWithTracks)
      } catch (err) {
        console.error('Error fetching playlist:', err)
      }
    }

    getMyPlaylists()
  }, [spotifyApi, playlists])

  // create recommendation playlist
  const handleCreateRecommendationPlaylist = useCallback(async () => {
    const seedGenres = selectedGenres
    const seedTracks = selectedTracks.map(track => track.id)

    if (seedTracks.length <= 0) {
      toast.error('Please select tracks')
      return
    }

    if (seedGenres.length <= 0) {
      toast.error('Please select genres')
      return
    }

    // start loading
    setIsLoading(true)

    try {
      const { body } = await spotifyApi.getRecommendations({
        seed_tracks: seedTracks,
        seed_genres: seedGenres,
        limit: 20, // Number of recommended tracks
      })

      console.log('seedTracks: ', seedTracks)
      console.log('seedGenres:', seedGenres)

      console.log(body)
      setTrackResults(body.tracks)
      setOpenResults(true)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [spotifyApi, selectedGenres, selectedTracks])

  console.log(result)

  return (
    <>
      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              scope={['track']}
              limit={20}
              setResult={setResult}
            />
          </div>

          <div className="h-[66px] w-[182px] rounded-full border-l-2 border-white bg-neutral-800" />
        </div>

        {result?.tracks?.items?.length > 0 && (
          <div className="mb-8 w-full">
            <h1 className="inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
              Tracks
            </h1>
            <div className="grid max-h-[250px] grid-cols-4 overflow-y-auto md:max-h-[320px] md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {result?.tracks?.items.map((track: any) => (
                <div
                  className={`relative cursor-pointer overflow-hidden rounded-lg p-1 ${selectedTracks.some(t => t.id === track.id) ? 'bg-green-300' : ''}`}
                  key={track.id}
                  onClick={() => {
                    const isExist = selectedTracks.some((t: any) => t.id === track.id)
                    if (!isExist && selectedTracks.length >= 3) {
                      toast.error('Limit 3 tracks')
                      return
                    }
                    dispatch(setSelectedTracks(track))
                  }}
                >
                  <TrackItem
                    track={track}
                    className="w-full"
                  />
                  <div className="absolute left-0 top-0 h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTracks.length > 0 && (
          <div className="mt-4 flex gap-2">
            <h1 className="inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
              Selected Tracks
            </h1>
            <button
              className="rounded-lg border border-dark px-2"
              onClick={() => dispatch(clearSelectedTracks([]))}
            >
              Clear
            </button>
          </div>
        )}
        {selectedTracks.length > 0 && (
          <div className="mt-3 flex max-h-[108px] flex-wrap gap-2 overflow-y-auto">
            {selectedTracks.map((track: any) => (
              <div
                className={`trans-200 flex cursor-pointer items-start gap-1.5 rounded-md border border-dark px-2 py-1 hover:bg-green-200`}
                onClick={() => dispatch(setSelectedTracks(track))}
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
              </div>
            ))}
          </div>
        )}

        {selectedTracks.length > 0 && (
          <div className="mt-3 flex max-h-[77px] flex-wrap gap-1.5 overflow-y-auto">
            {genres.map(genre => (
              <button
                className={`trans-200 rounded-3xl border border-dark px-2 py-0.5 text-xs hover:bg-green-200 ${selectedGenres.some(g => g === genre) ? 'bg-green-300' : ''}`}
                onClick={() => {
                  const isExist = selectedGenres.some((g: any) => g === genre)
                  if (!isExist && selectedGenres.length >= 3) {
                    toast.error('Limit 3 genres')
                    return
                  }
                  dispatch(setSelectedGenres(genre))
                }}
                key={genre}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {selectedTracks.length > 0 && (
          <div className="mb-8 mt-2 flex justify-center gap-2">
            <button
              className={`trans-200 rounded-lg border-2 border-dark px-3 py-1 font-semibold shadow-lg hover:bg-white hover:text-dark ${isLoading ? 'pointer-events-none' : ''}`}
              disabled={isLoading}
              onClick={handleCreateRecommendationPlaylist}
            >
              {isLoading ? (
                <RiDonutChartFill
                  size={20}
                  className="animate-spin"
                />
              ) : (
                'Suggest Playlist'
              )}
            </button>

            {trackResults.length > 0 && (
              <button
                className={`trans-200 rounded-lg border-2 border-green-500 px-3 py-1 font-semibold text-green-500 shadow-lg hover:bg-white hover:text-dark ${isLoading ? 'pointer-events-none' : ''}`}
                onClick={() => setOpenResults(true)}
                disabled={isLoading}
              >
                <FaEye
                  size={16}
                  className="text-green-500"
                />
              </button>
            )}
          </div>
        )}

        <h1 className="inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
          My Playlists
        </h1>
        <div className="mt-3 grid grid-cols-1 gap-21 md:grid-cols-3">
          {playlistsWithTracks.map(playlist => (
            <PlaylistWithTracks
              playlist={playlist}
              key={playlist.id}
            />
          ))}
        </div>
      </div>

      <SuggestedPlaylistModal
        open={openResults}
        setOpen={setOpenResults}
        tracks={trackResults}
      />
    </>
  )
}

export default SuggestPlaylistPage
