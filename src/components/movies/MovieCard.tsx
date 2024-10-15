import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface MovieCardProps {
  id: string
  image: string
  title: string
  className?: string
}

function MovieCard({ id, image, title, className = '' }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${id}`}
      className={`group flex h-full flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="flex h-full w-full overflow-hidden rounded-lg">
        <Image
          className="h-full w-full object-cover"
          src={image}
          alt={title}
          width={500}
          height={750}
          layout="responsive"
        />
      </div>
      <p
        className="trans-200 line-clamp-1 text-ellipsis text-center font-body font-semibold tracking-widest group-hover:text-primary"
        title={title}
      >
        {title}
      </p>
    </Link>
  )
}

export default memo(MovieCard)
