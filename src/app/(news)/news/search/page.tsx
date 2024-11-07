'use client'

import ArticleCard from '@/components/news/ArticleCard'
import SearchBar from '@/components/news/SearchBar'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function SearchPage() {
  // hook
  const router = useRouter()

  // states
  const [articles, setArticles] = useState<any[]>([])

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="flex justify-center">
        <SearchBar setArticles={setArticles} />
      </div>

      {articles.length > 0 ? (
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {articles.map((News: any) => (
            <ArticleCard
              news={News}
              key={News.title}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-center text-3xl font-bold text-transparent">
            You haven&apos;t searched for anything yet
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
