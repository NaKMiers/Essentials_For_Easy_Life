'use client'

import Divider from '@/components/Divider'
import ArticleCard from '@/components/news/ArticleCard'
import NewsAPI, { News } from '@/libs/news/NewsApi'

import moment from 'moment'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

function Home() {
  const [timeFilter, setTimeFilter] = useState<'1day' | '1week' | '1month' | ''>('')
  const [articles, setArticles] = useState<News[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const articlesPerPage = 8

  const calculateDateRange = useCallback(() => {
    const endDate = moment().format('YYYY-MM-DD')
    let startDate = ''

    switch (timeFilter) {
      case '1day':
        startDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
        break
      case '1week':
        startDate = moment().subtract(1, 'weeks').format('YYYY-MM-DD')
        break
      case '1month':
        startDate = moment().subtract(1, 'months').format('YYYY-MM-DD')
        break
      default:
        startDate = ''
    }

    return { startDate, endDate }
  }, [timeFilter])

  const fetchNewsByTimeFilter = useCallback(async () => {
    setIsLoading(true)
    const { startDate, endDate } = calculateDateRange()
    if (startDate) {
      try {
        const data = await NewsAPI.getNewsByDate(startDate, endDate)
        setArticles(data)
      } catch (error) {
        console.error('Error fetching news by date:', error)
      }
    } else {
      try {
        const data = await NewsAPI.getHeadLines()
        setArticles(data)
      } catch (error) {
        console.error('Error fetching headlines:', error)
      }
    }

    setIsLoading(false)
  }, [calculateDateRange])

  useEffect(() => {
    fetchNewsByTimeFilter()
  }, [timeFilter, fetchNewsByTimeFilter])

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage

  const currentArticles = (articles ? articles : []).slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil((articles ? articles : []).length / articlesPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pageRange = 2
    const pages = []

    if (totalPages > 1) {
      pages.push(1)
    }

    if (currentPage > pageRange + 2) {
      pages.push('...')
    }

    for (
      let i = Math.max(2, currentPage - pageRange);
      i <= Math.min(totalPages - 1, currentPage + pageRange);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage < totalPages - pageRange - 1) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages.map((page, index) =>
      typeof page === 'number' ? (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={`rounded px-3 py-1 ${currentPage === page ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
        >
          {page}
        </button>
      ) : (
        <span
          key={index}
          className="px-3 py-1 text-gray-700"
        >
          ...
        </span>
      )
    )
  }

  return (
    <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
      <Divider size={20} />

      <div className="mb-8 flex items-center justify-between">
        <select
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value as '1day' | '1week' | '1month' | '')}
          className="rounded border-gray-300 p-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/20"
        >
          <option value="">All Articles</option>
          <option value="1day">1 day ago</option>
          <option value="1week">1 week ago</option>
          <option value="1month">1 month ago</option>
        </select>

        <Link
          href="/news/search"
          className="group relative flex items-center justify-center overflow-hidden rounded-lg bg-[#4070f4] px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#3652b0]"
        >
          <span className="relative z-10">Search</span>

          <div className="absolute inset-0 translate-x-[-100%] translate-y-[100%] transform rounded-lg bg-[#280a0a] transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></div>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-10 flex items-center justify-center">
          <button
            disabled
            className="flex transform items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition duration-300 hover:scale-105 active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-5 w-5 animate-spin text-white"
            >
              <circle
                strokeWidth="4"
                stroke="currentColor"
                r="10"
                cy="12"
                cx="12"
                className="opacity-25"
              ></circle>
              <path
                d="M4 12a8 8 0 018-8v8H4z"
                fill="currentColor"
                className="opacity-75"
              />
            </svg>
            Loading...
          </button>
        </div>
      ) : (
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentArticles.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              Không tìm thấy bài viết nào cho thời gian đã chọn.
            </p>
          ) : (
            currentArticles.map((news: News) => (
              <ArticleCard
                key={news.title}
                news={news}
              />
            ))
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Go Back button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group relative mx-2 overflow-hidden rounded-2xl border-2 border-white bg-[#ecd448] px-6 py-3 text-xl font-semibold text-black transition-all duration-300 hover:bg-[#4cc9f0] hover:text-white hover:shadow-[0_2px_0_2px_#0d3b66] active:scale-90 disabled:opacity-50"
        >
          <div className="group-hover:transition-delay-[100ms] absolute left-1 top-1/2 z-10 flex h-12 w-0 items-center justify-center rounded-xl bg-[#ff6700] transition-all duration-500 group-hover:w-[100px] group-hover:translate-x-[150%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              />
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              />
            </svg>
          </div>
          Go Back
        </button>

        {/* Pagination */}
        {renderPagination()}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group relative mx-2 overflow-hidden rounded-2xl border-2 border-white bg-[#ecd448] px-6 py-3 text-xl font-semibold text-black transition-all duration-300 hover:bg-[#4cc9f0] hover:text-white hover:shadow-[0_2px_0_2px_#0d3b66] active:scale-90 disabled:opacity-50"
        >
          <div className="group-hover:transition-delay-[100ms] absolute right-1 top-1/2 z-10 flex h-12 w-0 items-center justify-center rounded-xl bg-[#ff6700] transition-all duration-500 group-hover:w-[100px] group-hover:translate-x-[-150%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              />
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              />
            </svg>
          </div>
          Next
        </button>
      </div>

      <Divider size={40} />
    </div>
  )
}

export default Home
