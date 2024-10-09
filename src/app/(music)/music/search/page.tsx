'use client'

import Group from '@/components/Group'
import Album from '@/components/music/Album'
import Artist from '@/components/music/Artist'
import Episode from '@/components/music/Episode'
import Playlist from '@/components/music/Playlist'
import SearchBar from '@/components/music/SearchBar'
import Show from '@/components/music/Show'
import TrackItem from '@/components/music/TrackItem'
import { useEffect, useState } from 'react'

function SearchPage() {
  // states
  const [result, setResult] = useState<any>(null)

  const [albums, setAlbums] = useState<any[]>([])
  const [artists, setArtists] = useState<any[]>([])
  const [episodes, setEpisodes] = useState<any[]>([])
  const [playlists, setPlaylists] = useState<any[]>([])
  const [shows, setShows] = useState<any[]>([])
  const [tracks, setTracks] = useState<any[]>([])

  useEffect(() => {
    if (result) {
      if (result.albums) setAlbums(result.albums.items)
      if (result.artists) setArtists(result.artists.items)
      if (result.episodes) setEpisodes(result.episodes.items)
      if (result.playlists) setPlaylists(result.playlists.items)
      if (result.shows) setShows(result.shows.items)
      if (result.tracks) setTracks(result.tracks.items)
    }
  }, [result])

  return (
    <div className="p-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar setResult={setResult} />
        </div>

        <div className="h-[66px] w-[182px] rounded-full border-l-2 border-white bg-neutral-800" />
      </div>

      {tracks.length > 0 && (
        <div className="w-full px-3">
          <h2 className="mx-2 text-lg font-semibold text-dark">Tracks</h2>
          <Group className="-mt-2">
            {tracks.map(track => (
              <TrackItem
                track={track}
                key={track.id}
                className="w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}

      {playlists.length > 0 && (
        <div className="w-full px-3">
          <h2 className="mx-2 text-lg font-semibold text-dark">Playlists</h2>
          <Group className="-mt-2">
            {playlists.map(playlist => (
              <Playlist
                playlist={playlist}
                key={playlist.id}
                className="w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}

      {albums.length > 0 && (
        <div className="w-full px-3">
          <h2 className="mx-2 text-lg font-semibold text-dark">Albums</h2>
          <Group className="-mt-2">
            {albums.map(album => (
              <Album
                album={album}
                key={album.id}
                className="w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}

      {artists.length > 0 && (
        <div className="w-full px-3">
          <h2 className="mx-2 text-lg font-semibold text-dark">Artists</h2>
          <Group className="-mt-2">
            {artists.map(artist => (
              <Artist
                artist={artist}
                key={artist.id}
                className="w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}

      {shows.length > 0 && (
        <div className="w-full px-3">
          <h2 className="mx-2 text-lg font-semibold text-dark">Shows</h2>
          <Group className="-mt-2">
            {shows.map(show => (
              <Show
                show={show}
                key={show.id}
                className="w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}

      {episodes.length > 0 && (
        <div className="w-full px-3">
          <h2 className="mx-2 text-lg font-semibold text-dark">Episodes</h2>
          <Group className="-mt-2">
            {episodes.map(episode => (
              <Episode
                episode={episode}
                key={episode.id}
                className="w-[150px]"
              />
            ))}
          </Group>
        </div>
      )}
    </div>
  )
}

export default SearchPage
