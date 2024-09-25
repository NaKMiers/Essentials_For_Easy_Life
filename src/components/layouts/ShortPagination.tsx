'use client'

import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { memo, useCallback, useEffect } from 'react'

interface ShortPaginationProps {
  searchParams: { [key: string]: string[] | string } | undefined
  amount: number
  itemsPerPage: number
  className?: string
}

function ShortPagination({
  searchParams = {},
  amount = 0,
  itemsPerPage = 9, // default item/page
  className = '',
}: ShortPaginationProps) {
  // hooks
  const pathname = usePathname()
  const router = useRouter()
  const queryParams = useSearchParams()
  const page = queryParams.get('page')

  // values
  const pageAmount = Math.ceil(amount / itemsPerPage) // calculate page amount
  const currentPage = page ? +page : 1

  // set page link
  const getPageLink = useCallback(
    (value: number) => {
      // get page from searchParams
      const params = { ...searchParams }
      if (params.page) {
        delete params.page
      }
      params.page = [value.toString()]

      return pathname + handleQuery(params)
    },
    [searchParams, pathname]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // left arrow
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        router.push(getPageLink(currentPage - 1), { scroll: false })
      }

      // right arrow
      if (e.key === 'ArrowRight' && currentPage < pageAmount) {
        router.push(getPageLink(currentPage + 1), { scroll: false })
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [currentPage, pageAmount, router, getPageLink])

  return (
    pageAmount > 1 && (
      <div className={`flex font-semibold gap-4 items-center w-full min-h-[42px] ${className}`}>
        {/* MARK: Prev */}
        {currentPage != 1 && (
          <Link
            href={getPageLink(currentPage <= 1 ? 1 : currentPage - 1)}
            className='min-w-[70px] flex items-center justify-center rounded-full border-2 h-full border-primary px-2 hover:bg-secondary hover:border-secondary shadow-lg drop-shadow-lg text-dark hover:text-light trans-200'
            title={`👈 Trang ${currentPage <= 1 ? 1 : currentPage - 1}`}
            scroll={false}
          >
            Trước
          </Link>
        )}

        {/* MARK: 1 ... n */}
        <div className='flex items-center'>
          <span className='text-base'>
            {currentPage}/{pageAmount}
          </span>
        </div>

        {/* MARK: Next */}
        {currentPage != pageAmount && (
          <Link
            href={getPageLink(currentPage >= pageAmount ? pageAmount : currentPage + 1)}
            className='min-w-[70px] flex items-center justify-center rounded-full border-2 h-full border-primary px-2 hover:bg-secondary hover:border-secondary shadow-lg drop-shadow-lg text-dark hover:text-light trans-200'
            title={`👉 Trang ${currentPage >= pageAmount ? pageAmount : currentPage + 1}`}
            scroll={false}
          >
            Sau
          </Link>
        )}
      </div>
    )
  )
}

export default memo(ShortPagination)
