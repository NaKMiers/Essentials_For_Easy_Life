'use client'

import ArticleCard from '@/components/news/ArticleCard'
import NewsAPI, { News } from '@/libs/news/NewsApi'
import { Roboto } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Cập nhật với next/navigation

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] })

export default function Home() {
  const [filterTime, setFilterTime] = useState<string>('') // Lưu trữ lựa chọn lọc
  const [headlines, setHeadlines] = useState<News[]>([])
  const router = useRouter() // Khởi tạo router từ next/navigation

  // Lấy dữ liệu bài viết từ API
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const data = await NewsAPI.getHeadLines()
        setHeadlines(data)
      } catch (error) {
        console.error('Error fetching headlines:', error)
      }
    }
    fetchHeadlines()
  }, [])

  // Hàm lọc bài viết theo thời gian
  const filterArticlesByTime = (articles: News[]) => {
    const now = new Date()
    let filterDate: Date | null = null

    switch (filterTime) {
      case '1day':
        filterDate = new Date(now)
        filterDate.setDate(now.getDate() - 1) // Lọc 1 ngày qua
        break
      case '1week':
        filterDate = new Date(now)
        filterDate.setDate(now.getDate() - 7) // Lọc 1 tuần qua
        break
      case '1month':
        filterDate = new Date(now)
        filterDate.setMonth(now.getMonth() - 1) // Lọc 1 tháng qua
        break
      default:
        return articles // Trả lại tất cả bài viết nếu không chọn bộ lọc
    }

    // Lọc bài viết theo ngày xuất bản
    return articles.filter(article => {
      const articleDate = new Date(article.publishedAt) // Chuyển đổi chuỗi ngày thành đối tượng Date
      return articleDate >= filterDate! // Lọc bài viết có ngày xuất bản lớn hơn hoặc bằng ngày lọc
    })
  }

  const displayedArticles = filterArticlesByTime(headlines) // Áp dụng bộ lọc

  // Hàm điều hướng đến trang tìm kiếm
  const goToSearchPage = () => {
    router.push('news/searchingpage') // Điều hướng đến trang tìm kiếm
  }

  return (
    <main className={`${roboto.className} bg-gray-900 py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-center text-3xl font-bold text-transparent">
            EssentialsForEasyLife
          </h1>

          {/* Menu lọc */}
          <select
            onChange={e => setFilterTime(e.target.value)}
            value={filterTime}
            className="rounded bg-gray-700 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600"
          >
            <option value="">All articles</option>
            <option value="1day">Last 1 day</option>
            <option value="1week">Last 1 week</option>
            <option value="1month">Last 1 month</option>
          </select>

          {/* Nút tìm kiếm */}
          <button
            onClick={goToSearchPage} // Điều hướng khi nhấn nút tìm kiếm
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Hiển thị các bài viết đã lọc */}
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {displayedArticles.map(news => (
            <ArticleCard
              key={news.title}
              news={news}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
