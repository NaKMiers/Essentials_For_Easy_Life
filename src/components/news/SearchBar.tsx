'use client'

import { KeyboardEvent, memo, useCallback, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaSearch } from 'react-icons/fa'

function SearchBar({ setArticles }: any) {
  const [keyword, setKeyword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return

    setLoading(true)
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
      )
      const data = await res.json()
      setArticles(data.articles)
      console.log(data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [keyword, setArticles])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  useEffect(() => {
    if (keyword.trim() === '') {
      setArticles([])
    }
  }, [keyword, setArticles])

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <div className="group flex h-[60px] w-[60px] items-center overflow-hidden rounded-full bg-[#4070f4] p-5 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] duration-300 hover:w-[270px] hover:duration-300">
        <div className="flex items-center justify-center fill-white">
          {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSearch />}
        </div>

        <input
          type="text"
          className="w-full bg-transparent px-4 text-[20px] font-normal text-light outline-none placeholder:text-lime-300 focus:outline-none"
          placeholder="Search articles..."
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />
      </div>
    </div>
  )
}

export default memo(SearchBar)
