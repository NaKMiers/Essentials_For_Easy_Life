import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { setPlaylists } from '@/libs/reducers/musicReducer'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from '../Divider'
import Input from '../Input'

interface PlaylistModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  playlist?: any
  className?: string
}

function PlaylistModal({ open, setOpen, title, playlist, className = '' }: PlaylistModalProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const spotifyApi = useSpotify()

  // stores
  const playlists: any[] = useAppSelector(state => state.music.playlists)

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPublic, setIsPublic] = useState<boolean>(playlist?.public || true)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: playlist?.name || '',
      description: playlist?.description || '',
    },
  })

  // add new category
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!curUser?.spotifyId) return

      // start loading
      setIsLoading(true)

      try {
        const { body: newPlaylist } = await spotifyApi.createPlaylist(curUser.spotifyId, {
          name: data.name,
          description: data.description,
          public: isPublic,
        } as any)

        // add new playlist to state
        dispatch(setPlaylists([newPlaylist, ...playlists]))

        // show success message
        toast.success('Create playlist successfully')

        // reset & close modal
        reset()
        setOpen(false)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [dispatch, reset, setOpen, playlists, spotifyApi, isPublic, curUser?.spotifyId]
  )

  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!playlist || !curUser?.spotifyId) return

      // start loading
      setIsLoading(true)

      try {
        await spotifyApi.changePlaylistDetails(playlist.id, {
          name: data.name,
          description: data.description,
          public: isPublic,
        } as any)

        // update playlist in state
        dispatch(
          setPlaylists(
            playlists.map((p: any) =>
              p.id === playlist.id
                ? { ...p, name: data.name, description: data.description, public: isPublic }
                : p
            )
          )
        )

        // show success message
        toast.success('Edit playlist successfully')

        // reset & close modal
        reset()
        setOpen(false)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [dispatch, setOpen, reset, playlist, playlists, spotifyApi, isPublic, curUser?.spotifyId]
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50 ${className}`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="w-full max-w-[500px] rounded-medium bg-white p-21 shadow-medium"
            onClick={e => e.stopPropagation()}
          >
            <h1 className="text-center text-xl font-semibold text-dark">{title}</h1>

            <Divider size={2} />

            <Input
              id="name"
              label="Name"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('name')}
            />

            <Input
              id="description"
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
              type="text"
              labelBg="bg-white"
              className="mt-3 min-w-[40%]"
              onFocus={() => clearErrors('description')}
            />

            <div className="mt-3 flex items-center gap-3">
              <span className="font-semibold text-slate-600">Public</span>
              <input
                className="h-6 w-6 cursor-pointer accent-green-500"
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
            </div>

            <Divider size={5} />

            <div className="flex justify-center gap-3">
              <button
                className={`trans-200 rounded-lg border-2 border-dark bg-slate-300 px-3 py-1.5 font-semibold text-dark shadow-lg drop-shadow-md hover:border-slate-300 hover:text-light`}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className={`trans-200 rounded-lg border-2 border-dark px-3 py-1.5 font-semibold text-dark shadow-lg drop-shadow-md hover:bg-dark-100 hover:text-light ${
                  isLoading ? 'pointer-events-none bg-slate-200' : ''
                }`}
                onClick={handleSubmit(playlist ? onEditSubmit : onAddSubmit)}
              >
                {isLoading ? (
                  <FaCircleNotch
                    size={18}
                    className="trans-200 animate-spin text-slate-400"
                  />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(PlaylistModal)
