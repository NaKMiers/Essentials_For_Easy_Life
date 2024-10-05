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
      className={`group flex flex-col gap-3 overflow-hidden ${className}`}
    >
      <div className="overflow-hidden rounded-lg shadow-lg">
        <Image
          className="h-full w-full object-cover"
          src={image}
          alt={title}
          width={500}
          height={750}
          layout="responsive"
        />
      </div>
      <p className="trans-200 text-center font-body font-semibold tracking-widest group-hover:text-primary">
        {title}
      </p>
    </Link>
  )
}

export default memo(MovieCard)
