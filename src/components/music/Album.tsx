import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface AlbumProps {
  album: any
  className?: string
}

function Album({ album, className = '' }: AlbumProps) {
  return (
    <Link
      href={album.external_urls.spotify}
      target="_blank"
      rel="noreferrer"
      className={`flex w-full flex-shrink-0 flex-col gap-2 ${className}`}
    >
      <div className="aspect-square h-full w-full flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
        <Image
          className="h-full w-full object-cover"
          src={album?.images?.[0]?.url || '/images/default-playlist.png'}
          width={200}
          height={2000}
          alt={album.name}
        />
      </div>

      <p className="text font-semibold">{album.name}</p>
    </Link>
  )
}

export default memo(Album)
