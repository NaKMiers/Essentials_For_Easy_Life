import { useAppDispatch } from '@/libs/hooks'
import useSpotify from '@/libs/hooks/useSpotify'
import { useParams, useSearchParams } from 'next/navigation'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { TiDelete } from 'react-icons/ti'

interface SearchBarProps {
  setResult: Dispatch<SetStateAction<any>>
  className?: string
}

function SearchBar({ setResult, className = '' }: SearchBarProps) {
  // hook
  const spotifyApi = useSpotify()
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()

  // search state
  const [searchValue, setSearchValue] = useState<string>(searchParams.get('q') || '')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [initResults, setInitResults] = useState<any[] | null>([])
  const searchTimeout = useRef<any>(null)

  // handle search
  const handleSearch = useCallback(async () => {
    // search value not empty
    if (!searchValue) {
      return
    }

    const { body } = await spotifyApi.search(
      searchValue,
      ['album', 'playlist', 'artist', 'episode', 'show', 'track'] as any,
      { limit: 10 }
    )

    setResult(body)

    // start loading
    setSearchLoading(true)

    try {
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setSearchLoading(false)
    }
  }, [searchValue])

  // auto search after 0.5s when search value changes
  useEffect(() => {
    if (searchValue) {
      clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(() => {
        handleSearch()
      }, 500)
    }
  }, [initResults, searchValue, handleSearch])

  return (
    <div
      className={`relative flex h-[38px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-dark text-dark ${className}`}
    >
      <button
        className={`${
          searchValue.trim() ? 'max-w-[60px]' : 'max-w-0'
        } trans-500 group flex h-full w-[60px] items-center justify-center overflow-hidden bg-white ${
          searchLoading ? 'pointer-events-none' : ''
        }`}
        onClick={() => setSearchValue('')}
      >
        <TiDelete
          size={20}
          className="wiggle text-orange-600"
        />
      </button>

      <input
        type="text"
        placeholder="What do you want to play?"
        className={`${
          searchValue.trim() ? '' : 'pl-[20px]'
        } trans-500 rounded-0 h-full w-full appearance-none bg-white pb-0.5 font-body tracking-wider outline-none`}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
    </div>
  )
}

export default memo(SearchBar)
