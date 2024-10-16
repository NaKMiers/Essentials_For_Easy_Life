'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import {
  setCurPlaylist,
  setCurTrack,
  setLikedTracks,
  setOpenSidebar,
  setPlaylists,
} from '@/libs/reducers/musicReducer'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FaHeart, FaHome, FaPlus, FaSearch, FaTrash, FaBrain, FaHandSpock } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import Divider from '../Divider'
import PlaylistModal from './PlaylistModal'
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import toast from 'react-hot-toast'

interface SidebarProps {
  className?: string
}

function Sidebar({ className = '' }: SidebarProps) {
  // hooks
  const router = useRouter()
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // stores
  const openSidebar = useAppSelector(state => state.music.openSidebar)
  const spotifyUser: any = useAppSelector(state => state.music.spotifyUser)
  const playlists: any[] = useAppSelector(state => state.music.playlists)

  // states
  // const [playlists, setPlaylists] = useState<any[]>([])
  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false)
  const [openEditPlaylistModal, setOpenEditPlaylistModal] = useState<boolean>(false)
  const [editPlaylist, setEditPlaylist] = useState<any>(null)

  const [openDeletePlaylistDialog, setOpenDeletePlaylistDialog] = useState<boolean>(false)
  const [deletePlaylist, setDeletePlaylist] = useState<any>(null)

  // get user playlist
  useEffect(() => {
    const getUserPlaylist = async () => {
      try {
        const { body } = await spotifyApi.getUserPlaylists()

        // set playlists
        dispatch(setPlaylists(body.items))

        // set current playlist
        dispatch(setCurPlaylist(body.items[1]))
      } catch (err: any) {
        console.log(err)
      }
    }

    if (spotifyApi.getAccessToken()) {
      getUserPlaylist()
    }
  }, [dispatch, session, spotifyApi])

  // get current track
  useEffect(() => {
    const getCurTrack = async () => {
      try {
        const { body } = await spotifyApi.getMyCurrentPlayingTrack()

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
  }, [spotifyApi, dispatch])

  // get my liked tracks
  useEffect(() => {
    const getLikedTracks = async () => {
      try {
        const { body } = await spotifyApi.getMySavedTracks()

        // set liked tracks
        dispatch(setLikedTracks(body.items.map((item: any) => item.track)))
      } catch (err: any) {
        console.log(err)
      }
    }

    getLikedTracks()
  }, [spotifyApi, dispatch])

  // handle delete playlist
  const handleDeletePlaylist = useCallback(async () => {
    if (!deletePlaylist) return

    try {
      // delete playlist
      await spotifyApi.unfollowPlaylist(deletePlaylist.id)

      // show success message
      toast.success('Delete playlist successfully')

      // remove playlist from state
      dispatch(setPlaylists(playlists.filter(playlist => playlist.id !== deletePlaylist.id)))
    } catch (err: any) {
      console.log(err)
    }
  }, [dispatch, playlists, spotifyApi, deletePlaylist])

  return (
    <>
      <div
        className={`${openSidebar ? 'translate-x-0' : 'max-md:translate-x-full'} trans-300 no-scrollbar fixed right-0 top-0 z-20 h-[calc(100vh-158px)] w-full md:static md:h-[calc(100vh-100px)] ${className}`}
      >
        <button
          className="group absolute left-0 top-9 -translate-x-full rounded-l-md bg-neutral-800 p-1.5 text-light shadow-lg md:hidden"
          onClick={() => dispatch(setOpenSidebar(!openSidebar))}
        >
          {openSidebar ? (
            <BsLayoutSidebarInsetReverse
              size={20}
              className="wiggle"
            />
          ) : (
            <BsLayoutSidebarInset
              size={20}
              className="wiggle"
            />
          )}
        </button>

        <div
          className={`h-full w-full pr-2 pt-2 ${openSidebar ? 'opacity-100' : 'max-md:opacity-0'} trans-300`}
        >
          <div className="no-scrollbar flex h-full w-full flex-col gap-1.5 overflow-y-auto rounded-3xl bg-neutral-200 p-4 text-dark">
            <Link
              href="/music"
              className="flex items-center gap-3"
            >
              <FaHome size={16} />
              <span>Home</span>
            </Link>

            <Link
              href="/music/search"
              className="flex items-center gap-3"
            >
              <FaSearch size={16} />
              <span>Search</span>
            </Link>

            <Divider
              size={2}
              border
              className="rounded-lg border-slate-800"
            />
            <Link
              href="/music/ai-suggestion"
              className="flex items-center gap-3"
            >
              <FaBrain size={16} />
              <span>AI Suggestion</span>
            </Link>

            <Link
              href="/music/manual-suggestion"
              className="flex items-center gap-3"
            >
              <FaHandSpock size={16} />
              <span>Manual Suggestion</span>
            </Link>

            {curUser && (
              <Divider
                size={2}
                border
                className="rounded-lg border-slate-800"
              />
            )}

            {curUser && (
              <Link
                href="/music/liked"
                className="flex items-center gap-3"
              >
                <FaHeart size={16} />
                <span>Liked Songs</span>
              </Link>
            )}

            {curUser && (
              <button
                className="flex items-center gap-3"
                onClick={() => setOpenPlaylistModal(true)}
              >
                <FaPlus size={16} />
                <span>Add Playlist</span>
              </button>
            )}

            <Divider
              size={2}
              border
              className="rounded-lg border-slate-800"
            />

            <ul className="flex flex-col gap-1.5">
              {playlists.map(playlist => (
                <div
                  className="trans-200 group relative flex h-[50px] cursor-pointer items-center gap-2 rounded-lg shadow-lg md:hover:bg-black/15 md:hover:p-1"
                  onClick={() => router.push(`/music/playlist/${playlist.id}`)}
                  key={playlist.id}
                >
                  <div
                    className="trans-200 absolute right-1 top-1 z-10 flex items-center gap-2 rounded-md border border-dark bg-white px-1 py-0.5 opacity-0 group-hover:opacity-100"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="trans-200 hover:text-sky-500"
                      onClick={() => {
                        setEditPlaylist(playlist)
                        setOpenEditPlaylistModal(true)
                      }}
                    >
                      <MdEdit size={16} />
                    </button>

                    <button
                      className="trans-200 hover:text-rose-500"
                      onClick={() => {
                        setDeletePlaylist(playlist)
                        setOpenDeletePlaylistDialog(true)
                      }}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                  <div className="aspect-square h-full max-h-[50px] max-w-[50px] flex-shrink-0 overflow-hidden rounded-md shadow-lg">
                    <Image
                      className="h-full w-full object-cover"
                      src={playlist?.images?.[0]?.url || '/images/default-playlist.png'}
                      width={50}
                      height={50}
                      alt={playlist.name}
                    />
                  </div>
                  <p className="trans-200 font-body text-sm tracking-wider opacity-80 group-hover:opacity-100">
                    {playlist.name}
                  </p>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PlaylistModal
        title="Add New Playlist"
        open={openPlaylistModal}
        setOpen={setOpenPlaylistModal}
      />

      <PlaylistModal
        title={`Edit Playlist: ${editPlaylist?.name}`}
        open={openEditPlaylistModal}
        playlist={editPlaylist}
        setOpen={setOpenEditPlaylistModal}
      />

      {/* Dialog */}
      <ConfirmDialog
        open={openDeletePlaylistDialog}
        setOpen={setOpenDeletePlaylistDialog}
        title="Delete Playlist"
        content="Are you sure you want to delete this playlist?"
        onAccept={handleDeletePlaylist}
        color="rose"
      />
    </>
  )
}

export default Sidebar
