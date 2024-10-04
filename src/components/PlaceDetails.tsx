import Image from 'next/image'

interface PlaceDetailsProps {
  place: any
  className?: string
}

function PlaceDetails({ place, className }: PlaceDetailsProps) {
  return (
    <div className="rounded-lg border-2 border-dark shadow-lg">
      <div className="aspect-square w-full">
        <Image
          src={place.photo ? place.photo.images.large.url : ''}
          className="h-full w-full object-cover"
          width={200}
          height={200}
          alt=""
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 px-3 py-2">
        <h5>{place.name}</h5>
      </div>
    </div>
  )
}

export default PlaceDetails
