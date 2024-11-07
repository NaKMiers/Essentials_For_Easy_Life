'use client'

import ArticleCard from '@/components/news/ArticleCard'
import SearchBar from '@/components/news/SearchBar'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // Cập nhật với next/navigation

function SearchPage() {
  const [articles, setArticles] = useState<any[]>([]) // Lưu trữ bài viết tìm được
  const router = useRouter() // Khởi tạo router từ next/navigation

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      {/* Thanh tìm kiếm */}
      <div className="flex justify-center">
        <SearchBar setArticles={setArticles} />
      </div>

      {/* Hiển thị bài viết tìm thấy */}
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((News: any) => (
            <ArticleCard
              news={News}
              key={News.title}
            />
          ))
        ) : (
          <div className="mt-10 flex items-center justify-center">
            <p className="inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-center text-3xl font-bold text-transparent">
              You haven't searched for anything yet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
