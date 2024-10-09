import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface TrackItemProps {
  track: any
  className?: string
}

function TrackItem({ track, className = '' }: TrackItemProps) {
  return (
    <Link
      href={track.external_urls.spotify}
      target="_blank"
      rel="noreferrer"
      className={`flex w-full flex-shrink-0 flex-col gap-2 ${className}`}
    >
      <div className="aspect-square h-full w-full flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
        <Image
          className="h-full w-full object-cover"
          src={track?.album?.images?.[0]?.url || '/images/default-playlist.png'}
          width={200}
          height={2000}
          alt={track.name}
        />
      </div>

      <p
        className="text line-clamp-1 text-ellipsis font-semibold"
        title={track.name}
      >
        {track.name}
      </p>
    </Link>
  )
}

export default memo(TrackItem)
