import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface PlaylistProps {
  playlist: any
  className?: string
}

function Playlist({ playlist, className = '' }: PlaylistProps) {
  return (
    <Link
      href={playlist.external_urls.spotify}
      target="_blank"
      rel="noreferrer"
      className={`flex w-full flex-shrink-0 flex-col gap-2 ${className}`}
    >
      <div className="aspect-square h-full w-full flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
        <Image
          className="h-full w-full object-cover"
          src={playlist?.images?.[0]?.url}
          width={200}
          height={2000}
          alt={playlist.name}
        />
      </div>

      <p
        className="text line-clamp-1 text-ellipsis font-semibold"
        title={playlist.name}
      >
        {playlist.name}
      </p>
    </Link>
  )
}

export default memo(Playlist)
