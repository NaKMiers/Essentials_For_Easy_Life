import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface EpisodeProps {
  episode: any
  className?: string
}

function Episode({ episode, className = '' }: EpisodeProps) {
  return (
    <Link
      href={episode.href}
      target="_blank"
      rel="noreferrer"
      className={`flex w-full flex-shrink-0 flex-col gap-2 ${className}`}
    >
      <div className="aspect-square h-full w-full flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
        <Image
          className="h-full w-full object-cover"
          src={episode?.images?.[0]?.url || '/images/default-playlist.png'}
          width={200}
          height={2000}
          alt={episode.name}
        />
      </div>

      <p
        className="text line-clamp-1 text-ellipsis font-semibold"
        title={episode.name}
      >
        {episode.name}
      </p>
    </Link>
  )
}

export default memo(Episode)
