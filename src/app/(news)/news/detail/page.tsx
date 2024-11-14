'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import moment from 'moment'

const NewsDetail = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const author = searchParams.get('author')
  const description = searchParams.get('description')
  const title = searchParams.get('title')
  const urlToImage = searchParams.get('urlToImage')
  const url = searchParams.get('url')
  const publishedAt = searchParams.get('publishedAt')

  if (!title) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-center text-2xl font-semibold text-red-600">
          Bài viết không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    )
  }

  const formattedDate = publishedAt ? moment(publishedAt).utc().format('YYYY/MM/DD') : 'Unknown'

  return (
    <div className="mx-auto my-20 max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <Image
        src={String(urlToImage) || 'https://ichef.bbci.co.uk/images/ic/512x512/p0hq72jn.png.webp'}
        alt="image"
        width={800}
        height={400}
        className="mb-4 rounded-lg"
      />
      <h1 className="mt-4 text-3xl font-extrabold text-gray-800">{title}</h1>
      <p className="mt-2 text-lg text-gray-500">
        <span className="font-medium">Published on:</span> {formattedDate}
      </p>
      <p className="mt-1 text-lg text-gray-500">
        <span className="font-medium">Author:</span> {author || 'Unknown'}
      </p>
      <p className="mt-4 text-lg leading-relaxed text-gray-700">{description}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => url && window.open(url, '_blank')}
          className="before:content[''] after:content[''] group relative h-16 w-64 origin-left overflow-hidden rounded-lg border bg-neutral-800 p-3 text-left text-base font-bold text-gray-50 underline underline-offset-2 duration-500 before:absolute before:right-1 before:top-1 before:z-10 before:h-12 before:w-12 before:rounded-full before:bg-violet-500 before:blur-lg before:duration-500 after:absolute after:right-8 after:top-3 after:z-10 after:h-20 after:w-20 after:rounded-full after:bg-rose-300 after:blur-lg after:duration-500 hover:border-rose-300 hover:text-rose-300 hover:underline hover:decoration-2 hover:underline-offset-4 hover:duration-500 hover:before:-bottom-8 hover:before:right-12 hover:before:blur hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] hover:after:-right-8 group-hover:before:duration-500 group-hover:after:duration-500"
        >
          See more
        </button>

        <button
          onClick={() => router.back()}
          className="group relative h-14 w-48 rounded-2xl bg-white text-center text-xl font-semibold text-black"
          type="button"
        >
          <div className="absolute left-1 top-[4px] z-10 flex h-12 w-1/4 items-center justify-center rounded-xl bg-green-400 duration-500 group-hover:w-[184px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <p className="translate-x-2">Go Back</p>
        </button>
      </div>
    </div>
  )
}

export default NewsDetail
