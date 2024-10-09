'use client'
import Divider from '@/components/Divider'
import Group from '@/components/Group'
import Playlist from '@/components/music/Playlist'
import TrackItem from '@/components/music/TrackItem'
import { useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { useEffect, useState } from 'react'

function MusicPage() {
  // hooks
  const spotifyApi = useSpotify()

  // stores
  const playlists: any[] = useAppSelector(state => state.music.playlists)

  // states
  const [popularPlaylists, setPopularPlaylists] = useState<any[]>([])
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<any[]>([])

  // get popular playlists
  useEffect(() => {
    const getFeaturedPlaylists = async () => {
      try {
        const res = await spotifyApi.getFeaturedPlaylists({
          timestamp: new Date().toISOString(),
          limit: 10,
        })

        setPopularPlaylists(res.body.playlists.items)
      } catch (error) {
        console.error('Error retrieving featured playlists:', error)
        return []
      }
    }
    getFeaturedPlaylists()
  }, [spotifyApi])

  // get recently played track
  useEffect(() => {
    const getRecentlyPlayedTracks = async () => {
      try {
        const { body } = await spotifyApi.getMyRecentlyPlayedTracks()
        const tracks = body.items.map((item: any) => item.track)

        // filer duplicate tracks
        const uniqueTracks = tracks.filter((track: any, index: number, self: any[]) => {
          return index === self.findIndex((t: any) => t.id === track.id)
        })

        // set recently played tracks
        setRecentlyPlayedTracks(uniqueTracks)
      } catch (err: any) {
        console.log(err)
      }
    }

    getRecentlyPlayedTracks()
  }, [spotifyApi])

  return (
    <div className="w-full px-3 py-21 md:px-21">
      {popularPlaylists.length > 0 && (
        <div className="w-full">
          <h1 className="mx-4 inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
            Popular
          </h1>

          <Group className="mx-2">
            {popularPlaylists.map(playlist => (
              <Playlist
                playlist={playlist}
                key={playlist.id}
                className="w-[180px]"
              />
            ))}
          </Group>
        </div>
      )}

      {recentlyPlayedTracks.length > 0 && (
        <div className="w-full">
          <h1 className="mx-4 inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
            Recently Played
          </h1>

          <Group className="mx-2">
            {recentlyPlayedTracks.map(track => (
              <TrackItem
                track={track}
                key={track.id}
                className="w-[180px]"
              />
            ))}
          </Group>
        </div>
      )}
    </div>
  )
}

export default MusicPage
