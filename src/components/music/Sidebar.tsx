'use client'

import { useSession } from 'next-auth/react'
import { BiLibrary } from 'react-icons/bi'
import { FaHeart, FaHome, FaPlusCircle, FaSearch } from 'react-icons/fa'
import { SiPodcastindex } from 'react-icons/si'
import Divider from '../Divider'
import { useEffect, useState } from 'react'
import useSpotify from '@/libs/hooks/useSpotify'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCurPlaylist, setCurTrack, setLikedTracks } from '@/libs/reducers/musicReducer'
import Link from 'next/link'

interface SidebarProps {
  className?: string
}

function Sidebar({ className }: SidebarProps) {
  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [playlists, setPlaylists] = useState<any[]>([])

  // get user playlist
  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        const { body } = await spotifyApi.getUserPlaylists()

        // set playlists
        setPlaylists(body.items)

        // set current playlist
        dispatch(setCurPlaylist(body.items[1]))
      } catch (err: any) {
        console.log(err)
      }
    }

    if (spotifyApi.getAccessToken()) {
      getUserPlaylist()
    }
  }, [session, spotifyApi])

  // get current track
  useEffect(() => {
    const getCurTrack = async () => {
      try {
        const { body } = await spotifyApi.getMyCurrentPlayingTrack()
        console.log(body)

        // playing track is available
        if (body) {
          dispatch(setCurTrack(body.item))
        }
        // playing track is not available
        else {
          // get recently played track
          const { body } = await spotifyApi.getMyRecentlyPlayedTracks()
          dispatch(setCurTrack(body.items[0].track))
        }
      } catch (err: any) {
        console.log(err)
      }
    }

    getCurTrack()
  }, [dispatch])

  // get my liked tracks
  // get current track
  useEffect(() => {
    const getLikedTracks = async () => {
      try {
        const { body } = await spotifyApi.getMySavedTracks()

        // set liked tracks
        dispatch(setLikedTracks(body.items.map((item: any) => item.track)))

        console.log(body.items.map((item: any) => item.track))
      } catch (err: any) {
        console.log(err)
      }
    }

    getLikedTracks()
  }, [dispatch])

  return (
    <div className={`no-scrollbar flex h-full w-full flex-col gap-1.5 overflow-y-auto p-4 ${className}`}>
      <Link
        href="/music"
        className="flex items-center gap-3"
      >
        <FaHome size={16} />
        <span>Home</span>
      </Link>
      <button className="flex items-center gap-3">
        <FaSearch size={16} />
        <span>Search</span>
      </button>

      <Divider
        size={2}
        border
        className="rounded-lg border-slate-800"
      />

      <Link
        href="/music/liked"
        className="flex items-center gap-3"
      >
        <FaHeart size={16} />
        <span>Liked Songs</span>
      </Link>

      <Divider
        size={2}
        border
        className="rounded-lg border-slate-800"
      />

      <ul className="flex flex-col gap-1.5">
        {playlists.map(playlist => (
          <Link
            href={`/music/playlist/${playlist.id}`}
            className="group flex cursor-pointer items-center gap-2"
            onClick={() => dispatch(setCurPlaylist(playlist))}
            key={playlist.id}
          >
            <div className="aspect-square max-h-[50px] max-w-[50px] flex-shrink-0 overflow-hidden rounded-md shadow-lg">
              <Image
                className="h-full w-full object-cover"
                src={playlist.images[0].url}
                width={50}
                height={50}
                alt={playlist.name}
              />
            </div>
            <p className="trans-200 font-body text-sm tracking-wider opacity-80 group-hover:opacity-100">
              {playlist.name}
            </p>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
