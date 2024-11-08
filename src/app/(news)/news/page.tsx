'use client'

import Divider from '@/components/Divider'
import ArticleCard from '@/components/news/ArticleCard'
import NewsAPI, { News } from '@/libs/news/NewsApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

function Home() {
  // hooks
  const router = useRouter()

  // states
  const [filterTime, setFilterTime] = useState<'1day' | '1week' | '1month' | ''>('')
  const [headlines, setHeadlines] = useState<News[]>([])
  const [filteredHeadlines, setFilteredHeadlines] = useState<News[]>([])

  // get headlines
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

  // filter by time
  const filterArticlesByTime = useCallback(
    (articles: News[]) => {
      const start = new Date()
      const end = new Date()

      switch (filterTime) {
        case '1day':
          start.setDate(start.getDate() - 1)
          break
        case '1week':
          start.setDate(start.getDate() - 7)
          break
        case '1month':
          start.setMonth(start.getMonth() - 1)
          break
        default:
          return articles
      }

      return articles.filter(article => {
        const articleDate = new Date(article.publishedAt)
        return articleDate >= start && articleDate <= end
      })
    },
    [filterTime]
  )

  useEffect(() => {
    const displayedArticles = filterArticlesByTime(headlines)
    setFilteredHeadlines(displayedArticles)
  }, [filterArticlesByTime, filterTime, headlines])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Divider size={20} />

      <div className="flex items-center justify-between">
        <select
          onChange={e => setFilterTime(e.target.value as '1day' | '1week' | '1month')}
          value={filterTime}
          className="rounded bg-gray-700 px-1 py-2 text-white outline-none transition-colors duration-300 hover:bg-gray-600"
        >
          <option value="">All articles</option>
          <option value="1day">Last 1 day</option>
          <option value="1week">Last 1 week</option>
          <option value="1month">Last 1 month</option>
        </select>

        <Link
          href="news/search"
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700"
        >
          Search
        </Link>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-21 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {filteredHeadlines?.map((news: any) => (
          <ArticleCard
            key={news.title}
            news={news}
          />
        ))}
      </div>

      <Divider size={40} />
    </div>
  )
}

export default Home
