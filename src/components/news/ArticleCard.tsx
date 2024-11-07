'use client'

import { News } from '@/libs/news/NewsApi'
import Image from 'next/image'
import { FacebookShareButton, FacebookIcon } from 'next-share'
import { TwitterShareButton, TwitterIcon } from 'next-share'
import { FacebookMessengerShareButton, FacebookMessengerIcon } from 'next-share'
import moment from 'moment'

interface ArticleCardProps {
  news: News
}

const ArticleCard: React.FC<ArticleCardProps> = ({ news }) => {
  // Kiểm tra ngày hợp lệ và format ngày
  const formattedDate = news.publishedAt
    ? moment(news.publishedAt).utc().format('YYYY-MM-DD')
    : 'No date available'

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center overflow-hidden rounded-lg bg-gray-900 shadow-lg">
      <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-t-lg">
        <Image
          className="object-cover"
          src={news.urlToImage || 'https://ichef.bbci.co.uk/images/ic/512x512/p0hq72jn.png.webp'}
          alt={news.title}
          width={600}
          height={240}
        />
      </div>
      <div className="p-4">
        <h1 className="mb-2 text-lg font-bold text-white">{news.title}</h1>
        <p className="mb-1 text-sm text-gray-400">Published on: {formattedDate}</p> {/* Hiển thị ngày */}
        <p className="mb-4 text-gray-300">{news?.description?.slice(0, 100)}...</p>
        <div className="mt-4 flex items-center space-x-2">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded bg-blue-600 px-4 py-2 text-center text-white transition-colors duration-300 hover:bg-blue-700"
          >
            Read more
          </a>

          {/* Nút chia sẻ */}
          <div className="flex space-x-2">
            {/* Facebook */}
            <FacebookShareButton
              url={news.url}
              quote={'Essentials For Easy Life is a blog about technology, programming, and more.'}
              hashtag={'#EssentialsForEasyLife'}
            >
              <FacebookIcon
                size={32}
                round
              />
            </FacebookShareButton>
            {/* Twitter */}
            <TwitterShareButton
              url={news.url}
              title={news.title}
            >
              <TwitterIcon
                size={32}
                round
              />
            </TwitterShareButton>
            {/* Facebook Messenger */}
            <FacebookMessengerShareButton
              url={news.url}
              appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ''}
            >
              <FacebookMessengerIcon
                size={32}
                round
              />
            </FacebookMessengerShareButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
