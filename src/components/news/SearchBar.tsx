'use client'

import { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai' // Spinner icon
import { FaSearch } from 'react-icons/fa'

function SearchBar({ setArticles }: any) {
  const [keyword, setKeyword] = useState<string>('') // Từ khóa tìm kiếm
  const [loading, setLoading] = useState<boolean>(false) // Trạng thái tải dữ liệu

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return // Không gửi yêu cầu nếu từ khóa trống

    setLoading(true) // Bắt đầu tải dữ liệu
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
      )
      const data = await res.json()
      setArticles(data.articles) // Cập nhật bài viết tìm được
      console.log(data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false) // Dừng trạng thái loading khi hoàn tất
    }
  }, [keyword, setArticles])

  // Kích hoạt tìm kiếm khi nhấn Enter
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
      {/* Nút tìm kiếm với hiệu ứng mở rộng */}
      <div className="group flex h-[60px] w-[60px] items-center overflow-hidden rounded-full bg-[#4070f4] p-5 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] duration-300 hover:w-[270px] hover:duration-300">
        {/* Icon tìm kiếm */}
        <div className="flex items-center justify-center fill-white">
          {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSearch />}
        </div>

        {/* Input tìm kiếm */}
        <input
          type="text"
          className="w-full bg-transparent px-4 text-[20px] font-normal text-black outline-none focus:outline-none"
          placeholder="Search articles..."
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown} // Thêm sự kiện nhấn Enter
          required
        />
      </div>
    </div>
  )
}

export default SearchBar
