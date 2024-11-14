'use client'

import ArticleCard from '@/components/news/ArticleCard'
import SearchBar from '@/components/news/SearchBar'

import Link from 'next/link'
import { useState } from 'react'

function SearchPage() {
  // States
  const [articles, setArticles] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Constants
  const articlesPerPage = 8
  const totalPages = Math.ceil(articles.length / articlesPerPage)

  // Calculate the articles to display based on the current page
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle)

  // Handler to change pages
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Pagination component with selectable page numbers
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
          className={`mx-1 rounded px-3 py-1 ${currentPage === page ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
        >
          {page}
        </button>
      ) : (
        <span
          key={index}
          className="mx-1 px-3 py-1 text-gray-700"
        >
          ...
        </span>
      )
    )
  }

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mb-4 flex items-center justify-between">
        {/* Back to News Button */}
        <Link
          href="/news"
          className="group relative flex h-14 w-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-[#ecd448] text-center text-xl font-semibold text-black shadow-[0_2px_0_2px_#000] transition-all duration-300 hover:bg-[#4cc9f0] hover:text-white hover:shadow-[0_2px_0_2px_#0d3b66] active:scale-90"
          type="button"
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
          <p className="translate-x-2">Back</p>
        </Link>

        {/* SearchBar */}
        <SearchBar
          setArticles={setArticles}
          setIsLoading={setIsLoading}
        />
      </div>

      {isLoading ? (
        <div className="mt-10 flex items-center justify-center">
          <div className="loader h-10 w-10 animate-spin rounded-full border-t-4 border-blue-500"></div>
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {currentArticles.map((news: any) => (
              <ArticleCard
                news={news}
                key={news.title}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-2 rounded bg-gray-700 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600 disabled:opacity-50"
            >
              Go Back
            </button>

            {renderPagination()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-2 rounded bg-gray-700 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="animate-textMove bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-center text-3xl font-bold text-transparent">
            You haven&apos;t searched for anything yet
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
