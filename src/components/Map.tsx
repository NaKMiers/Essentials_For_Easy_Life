import GoogleMapReact from 'google-map-react'
import Image from 'next/image'

interface MapProps {
  coords: any
  places: any[]
  setCoords: any
  setBounds: any
  setChildClicked: any
}

interface PlaceMarkerProps {
  lat: number
  lng: number
  name: string
  rating: number
  photo: { images: { large: { url: string } } } | null
}

const PlaceMarker: React.FC<PlaceMarkerProps> = ({ name, rating, photo }) => (
  <div className="w-[100px] rounded-lg bg-white p-2 text-dark shadow-lg">
    <p className="text-xs">{name}</p>
    <p className="text-xs">Rating: {rating}</p>
    <div className="aspect-square overflow-hidden rounded-md">
      <Image
        className="h-full w-full object-cover"
        src={
          photo
            ? photo.images.large.url
            : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'
        }
        width={150}
        height={150}
        alt={name}
      />
    </div>
  </div>
)

function Map({ coords, places, setCoords, setBounds, setChildClicked }: MapProps) {
  return (
    <div className="h-full w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY! }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{ disableDefaultUI: true, zoomControl: true }}
        onChange={e => {
          setCoords({ lat: e.center.lat, lng: e.center.lng })
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw })
        }}
        onChildClick={child => {
          setChildClicked(child)
        }}
      >
        {places.length > 0 &&
          places.map((place, i) => (
            <PlaceMarker
              key={i}
              lat={place.latitude || place.lat}
              lng={place.longitude || place.lng}
              name={place.name}
              rating={place.rating}
              photo={place.photo}
            />
          ))}
      </GoogleMapReact>
    </div>
  )
}

export default Map
