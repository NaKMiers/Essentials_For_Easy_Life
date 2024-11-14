import { News } from '@/libs/news/NewsApi'
import Image from 'next/image'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FaFacebook, FaTwitter, FaFacebookMessenger } from 'react-icons/fa'

interface ArticleCardProps {
  news: News
}

const ArticleCard: React.FC<ArticleCardProps> = ({ news }) => {
  const [isClient, setIsClient] = useState(false)

  // Xác định render phía client
  useEffect(() => {
    setIsClient(true)
  }, [])

  const formattedDate = moment(news.publishedAt).utc().format('YYYY/MM/DD')

  return (
    <div className="group relative flex max-w-sm cursor-pointer flex-col items-center justify-between overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-500 hover:scale-105">
      {/* Image section */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          className="object-cover"
          src={
            news.urlToImage ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZgwCldZep_5MJNd2LDsRdKyf7S62muv9kWw&s'
          }
          alt={news.title}
          width={600}
          height={240}
        />
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-4">
        <h1 className="mb-2 text-lg font-bold text-white">{news.title}</h1>
        <p className="mb-1 text-sm text-white">Published on: {formattedDate}</p>
        <p className="mt-2 text-sm text-white">Author: {news.author || 'Unknown'}</p>
        <p className="mb-4 text-gray-300">{news.description?.slice(0, 100)}...</p>

        {/* Read More button */}
        <a
          href={`/news/newsdetail?author=${news.author}&description=${news.description}&title=${news.title}&urlToImage=${news.urlToImage}&publishedAt=${news.publishedAt}&url=${news.url}`}
          className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-sky-800 p-2 font-extrabold text-sky-50 duration-500 hover:border-sky-600"
        >
          {/* Background circles with hover effect */}
          <div className="absolute z-10 h-48 w-48 rounded-full bg-sky-900 transition-all delay-150 duration-500 ease-in-out group-hover:scale-150 group-hover:delay-75"></div>
          <div className="absolute z-10 h-40 w-40 rounded-full bg-sky-800 transition-all delay-150 duration-500 ease-in-out group-hover:scale-150 group-hover:delay-100"></div>
          <div className="absolute z-10 h-32 w-32 rounded-full bg-sky-700 transition-all delay-150 duration-500 ease-in-out group-hover:scale-150 group-hover:delay-150"></div>
          <div className="absolute z-10 h-24 w-24 rounded-full bg-sky-600 transition-all delay-150 duration-500 ease-in-out group-hover:scale-150 group-hover:delay-200"></div>
          <div className="absolute z-10 h-16 w-16 rounded-full bg-sky-500 transition-all delay-150 duration-500 ease-in-out group-hover:scale-150 group-hover:delay-300"></div>

          {/* Button text */}
          <p className="z-10">Read More</p>
        </a>

        {/* Social Media Share */}
        <div className="mt-4 flex justify-center space-x-4">
          {/* Facebook Share */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${news.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1877f2] p-3 text-white transition-all duration-300 hover:bg-[#1266ac]"
          >
            <FaFacebook size={32} />
          </a>

          {/* Twitter Share */}
          <a
            href={`https://twitter.com/intent/tweet?url=${news.url}&text=${news.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1da1f2] p-3 text-white transition-all duration-300 hover:bg-[#0d95c8]"
          >
            <FaTwitter size={32} />
          </a>

          {/* Facebook Messenger Share */}
          <a
            href={`https://www.messenger.com/share?app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&link=${news.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#0084ff] p-3 text-white transition-all duration-300 hover:bg-[#006bb3]"
          >
            <FaFacebookMessenger size={32} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
