// components/news/SearchBar.tsx
'use client'

import { useCallback, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

function SearchBar({ setArticles }: any) {
  const [keyword, setKeyword] = useState<string>('') // Từ khóa tìm kiếm
  const [loading, setLoading] = useState<boolean>(false) // Trạng thái tải dữ liệu

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) {
      return // Không gửi yêu cầu nếu từ khóa trống
    }

    setLoading(true) // Bắt đầu tải dữ liệu
    try {
      // Gửi yêu cầu đến API với từ khóa tìm kiếm
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

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {/* Input tìm kiếm */}
      <input
        type="text"
        className="w-full rounded-full border border-gray-300 bg-white p-3 text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-96"
        placeholder="Search articles..."
        onChange={e => setKeyword(e.target.value)}
        required
      />

      {/* Nút tìm kiếm */}
      <button
        onClick={handleSearch}
        className="rounded-full bg-blue-500 p-3 text-white transition duration-300 hover:bg-blue-600"
        disabled={loading} // Vô hiệu hóa nút khi đang tải
      >
        {loading ? 'Searching...' : <FaSearch />} {/* Hiển thị chữ "Searching..." khi đang tải */}
      </button>
    </div>
  )
}

export default SearchBar
