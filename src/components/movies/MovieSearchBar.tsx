import { searchAndQuery } from '@/requests'
import { useSearchParams } from 'next/navigation'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { TiDelete } from 'react-icons/ti'

interface MovieSearchBarProps {
  initResult: any
  setResult: Dispatch<SetStateAction<any>>
  className?: string
}

function MovieSearchBar({ initResult, setResult, className = '' }: MovieSearchBarProps) {
  // hook
  const searchParams = useSearchParams()

  // search state
  const [searchValue, setSearchValue] = useState<string>(searchParams.get('q') || '')
  const [category, setCategory] = useState<'all' | 'movie' | 'tv'>('all')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const searchTimeout = useRef<any>(null)

  // handle search
  const handleSearch = useCallback(async () => {
    // search value not empty
    if (!searchValue) {
      setResult(initResult)
      return
    }

    let movies = []
    let tvShows = []

    // search
    if (category === 'movie' || category === 'all') {
      const res = await searchAndQuery('movie', { query: searchValue })
      movies = res.results
    }

    if (category === 'tv' || category === 'all') {
      const res = await searchAndQuery('tv', { query: searchValue })
      tvShows = res.results
    }

    setResult({ movies, tvShows })

    try {
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setSearchLoading(false)
    }
  }, [setResult, initResult, searchValue, category, ,])

  // auto search after 0.5s when search value changes
  useEffect(() => {
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      handleSearch()
    }, 500)
  }, [searchValue, handleSearch])

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
        placeholder="What do you want to watch?"
        className={`${
          searchValue.trim() ? '' : 'pl-[20px]'
        } trans-500 rounded-0 h-full w-full appearance-none bg-white pb-0.5 pr-[100px] font-body tracking-wider outline-none`}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />

      <select
        className="absolute right-0 top-1/2 h-full -translate-y-1/2 border-l border-slate-300 pl-2 text-sm outline-none"
        value={category}
        onChange={e => setCategory(e.target.value as 'all' | 'movie' | 'tv')}
      >
        <option
          value="all"
          className="border-0 bg-white px-2 py-1 text-sm text-dark outline-none"
        >
          All
        </option>
        <option
          value="movie"
          className="border-0 bg-white px-2 py-1 text-sm text-dark outline-none"
        >
          Movie
        </option>
        <option
          value="tv"
          className="border-0 bg-white px-2 py-1 text-sm text-dark outline-none"
        >
          TV Shows
        </option>
      </select>
    </div>
  )
}

export default memo(MovieSearchBar)
