'use client'

import Group from '@/components/Group'
import Artist from '@/components/music/Artist'
import Playlist from '@/components/music/Playlist'
import TrackItem from '@/components/music/TrackItem'
import useSpotify from '@/libs/hooks/useSpotify'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function MusicPage() {
  // hooks
  const spotifyApi = useSpotify()

  // states
  const [popularArtists, setPopularArtists] = useState<any[]>([])
  const [popularPlaylists, setPopularPlaylists] = useState<any[]>([])
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<any[]>([])

  // get popular artists
  useEffect(() => {
    const getPopularArtistsFromPlaylist = async () => {
      try {
        const res: any = await spotifyApi.search('top 50 artists', ['artist'] as any, {
          limit: 10,
        })

        setPopularArtists(res.body.artists.items)
      } catch (err) {
        console.error('Error fetching playlist:', err)
      }
    }

    getPopularArtistsFromPlaylist()
  }, [spotifyApi])

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
      <h1 className="mx-4 inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
        Features
      </h1>
      <div className="mx-4 grid grid-cols-2 gap-21 py-21 md:grid-cols-3 lg:grid-cols-4">
        <Link
          href="/music/create-playlist-from-text"
          className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-lg"
        >
          <Image
            className="h-full w-full object-cover p-2"
            src="/icons/create-playlist-from-text.png"
            width={200}
            height={200}
            alt="create-playlist-from-text"
          />

          <div className="absolute bottom-0 w-full rounded-t-lg border-t-2 border-green-200 bg-black/40 px-3 py-1">
            <p className="bg-gradient-to-b from-green-200 to-yellow-200 bg-clip-text text-center font-body font-bold tracking-widest text-transparent drop-shadow-md md:text-xl lg:text-2xl">
              Create Playlist From Text
            </p>
          </div>
        </Link>

        <Link
          href="/music/suggest-playlist"
          className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-lg"
        >
          <Image
            className="h-full w-full object-cover p-2"
            src="/icons/suggest-playlist.png"
            width={200}
            height={200}
            alt="suggest-playlist"
          />

          <div className="absolute bottom-0 w-full rounded-t-lg border-t-2 border-green-200 bg-black/40 px-3 py-1">
            <p className="bg-gradient-to-b from-green-200 to-yellow-200 bg-clip-text text-center font-body font-bold tracking-widest text-transparent drop-shadow-md md:text-xl lg:text-2xl">
              Suggest Playlist
            </p>
          </div>
        </Link>
      </div>

      {popularArtists.length > 0 && (
        <div className="w-full">
          <h1 className="mx-4 inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent drop-shadow-md">
            Popular Artists
          </h1>

          <Group className="mx-2">
            {popularArtists.map(artist => (
              <Artist
                artist={artist}
                key={artist.id}
                className="!w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}

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
                className="!w-[150px]"
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
                className="!w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}
    </div>
  )
}

export default MusicPage
