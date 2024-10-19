'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import MovieLikeButton from './MovieLikeButton'

interface MovieCardProps {
  data: any
  type: 'movie' | 'tv'
  className?: string
}

function MovieCard({ type, data, className = '' }: MovieCardProps) {
  return (
    <div className={`group relative flex h-full flex-col gap-3 overflow-hidden ${className}`}>
      <div className="absolute left-1 top-1 flex items-center justify-center gap-1 rounded-md border-2 border-[#e7ba1a] text-[#e7ba1a]">
        <div className="flex max-h-[18px] max-w-[40px] items-center justify-center overflow-hidden">
          <Image
            src="/icons/imdb.png"
            width={200}
            height={200}
            alt="IMDB"
          />
        </div>
        <span className="pr-1 font-body text-sm font-semibold tracking-wider drop-shadow-md">
          {Math.round(data.vote_average * 10) / 10}
        </span>
      </div>

      <Link
        href={`/movie/${type}/${data.id}`}
        className="flex h-full w-full overflow-hidden rounded-lg"
      >
        <Image
          className="h-full w-full object-cover"
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data.title || data.name}
          width={500}
          height={750}
          layout="responsive"
        />
      </Link>

      <MovieLikeButton
        type={type}
        data={data}
        className="absolute right-2 top-2"
      />

      <Link
        href={`/movie/${type}/${data.id}`}
        className="trans-200 line-clamp-1 text-ellipsis text-center font-body font-semibold tracking-widest group-hover:text-primary"
        title={data.title || data.name}
      >
        {data.title || data.name}
      </Link>
    </div>
  )
}

export default memo(MovieCard)
