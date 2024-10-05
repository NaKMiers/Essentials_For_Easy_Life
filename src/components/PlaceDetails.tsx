import Image from 'next/image'
import { memo } from 'react'
import { FaPhone, FaStar } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'

interface PlaceDetailsProps {
  place: any
  selected: boolean
  refProp: any
  className?: string
}

function PlaceDetails({ place, selected, refProp, className = '' }: PlaceDetailsProps) {
  console.log('refProp:', refProp)
  if (selected) refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="overflow-hidden rounded-lg bg-white text-dark shadow-lg">
      <div className="w-full shadow-lg">
        <Image
          className="h-full w-full object-cover"
          height={350}
          width={350}
          src={
            place.photo
              ? place.photo.images.large.url
              : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'
          }
          alt={place.name}
        />
      </div>
      <div className="p-2">
        <h5 className="text-lg font-semibold italic">{place.name}</h5>
        <div className="my-2 flex justify-between">
          <p className="flex items-center gap-2">
            <span className="font-semibold">{place.rating}</span>{' '}
            <FaStar
              size={16}
              className="text-yellow-500"
            />
          </p>
          <p>
            <span className="font-semibold">{place.num_reviews}</span> review
            {place.num_reviews > 1 && 's'}
          </p>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Price</span>
          <p>{place.price}</p>
        </div>
        <p>
          <span className="font-semibold">Ranking</span> {place.ranking}
        </p>
        {place?.awards?.map((award: any) => (
          <div
            className="my-1 flex items-center justify-between"
            key={award.display_name}
          >
            <Image
              src={award.images.small}
              width={50}
              height={50}
              alt="award"
            />
            <p>{award.display_name}</p>
          </div>
        ))}
        {place.address && (
          <p className="flex items-center gap-2">
            <FaLocationDot size={16} />
            {place.address}
          </p>
        )}
        {place.phone && (
          <p className="flex items-center gap-2">
            <FaPhone size={16} />
            {place.phone}
          </p>
        )}
      </div>
      <div className="flex justify-evenly gap-2 px-2 pb-2">
        <button
          className="flex-1 rounded-md bg-dark-100 px-3 py-1 text-light"
          onClick={() => window.open(place.web_url, '_blank')}
        >
          Trip Advisor
        </button>
        <button
          className="flex-1 rounded-md bg-dark-100 px-3 py-1 text-light"
          onClick={() => window.open(place.website, '_blank')}
        >
          Website
        </button>
      </div>
    </div>
  )
}

export default memo(PlaceDetails)
