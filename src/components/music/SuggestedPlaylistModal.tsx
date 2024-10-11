import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { clearSelectedGenres, clearSelectedTracks, setPlaylists } from '@/libs/reducers/musicReducer'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from '../Divider'
import Track from '@/components/music/Track'
import Input from '../Input'
import { RiDonutChartFill } from 'react-icons/ri'
import { genres } from '@/constants/music'

interface SuggestedPlaylistModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  tracks: any[]
  className?: string
}

function SuggestedPlaylistModal({ open, setOpen, tracks, className = '' }: SuggestedPlaylistModalProps) {
  console.log(tracks)

  // hooks
  const dispatch = useAppDispatch()
  const spotifyApi = useSpotify()

  // stores
  const spotifyUser: any = useAppSelector(state => state.music.spotifyUser)
  const playlists: any[] = useAppSelector(state => state.music.playlists)

  // states
  const [title, setTitle] = useState<string>('My Suggestion Playlist')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // save suggestion playlist
  const savePlaylist = useCallback(async () => {
    if (!spotifyUser) {
      toast.error('Please connect to spotify to do this action')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter playlist title')
      return
    }

    // start saving
    setIsSaving(true)

    try {
      // create new playlist
      const { body: newPlaylist } = await spotifyApi.createPlaylist(spotifyUser.id, {
        name: title,
        public: true,
      } as any)

      // // add suggested tracks to new playlist
      await spotifyApi.addTracksToPlaylist(
        newPlaylist.id,
        tracks.map(t => t.uri)
      )

      // add new playlist to state
      dispatch(setPlaylists([newPlaylist, ...playlists]))

      // show success message
      toast.success('Saved Playlist')

      // reset selected tracks & genres
      dispatch(clearSelectedTracks([]))
      dispatch(clearSelectedGenres(genres.slice(0, 2)))

      // close modal
      setOpen(false)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop saving
      setIsSaving(false)
    }
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 md:p-21 ${className}`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="h-full w-full max-w-[800px] overflow-y-auto rounded-medium bg-white p-21 shadow-medium"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <input
                type="text"
                className="flex h-8 items-center justify-center rounded-lg px-2 py-0.5 text-center shadow-lg outline-none"
                value={title}
                required
                onChange={e => setTitle(e.target.value)}
              />

              <button
                className={`trans-200 flex h-8 items-center justify-center rounded-lg border-2 border-green-500 px-2 py-0.5 text-green-500 hover:bg-green-500 hover:text-dark ${isSaving ? 'pointer-events-none' : ''}`}
                disabled={isSaving}
                onClick={savePlaylist}
              >
                {isSaving ? (
                  <RiDonutChartFill
                    size={20}
                    className="animate-spin"
                  />
                ) : (
                  'Save'
                )}
              </button>
            </div>

            <Divider size={2} />

            {/* Songs */}
            <div className="p-2">
              <div
                className={`gap-2px-2 mb-3 hidden grid-cols-12 border-b border-slate-800 py-0.5 pb-3 text-sm font-semibold md:grid`}
              >
                <div className="col-span-5 flex items-center gap-2">
                  <span className="mr-3 font-body text-sm tracking-wider text-slate-400">#</span>
                  <span>Title</span>
                </div>

                <div className="col-span-2 text-center">Preview</div>

                <div className="col-span-4">Album</div>

                <div className="col-span-1 text-center">Duration</div>
              </div>
              {tracks.length > 0 && (
                <div className="flex flex-col gap-2">
                  {tracks.map((track, index) => (
                    <Track
                      order={index + 1}
                      prevTracks={tracks.slice(index - 2, index)}
                      track={track}
                      nextTracks={tracks.slice(index + 1, index + 3)}
                      key={track.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(SuggestedPlaylistModal)
