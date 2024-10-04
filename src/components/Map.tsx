'use client'

import GoogleMapReact from 'google-map-react'

interface MapProps {
  coordinates: any
  setCoordinates: any
  setBounds: any
  className?: string
}

function Map({ coordinates, setCoordinates, setBounds, className }: MapProps) {
  return (
    <div className="h-full w-full bg-red-200">
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAbgueXbGYMo5JNol61IG_WnThxoRlNm7I' }}
        defaultCenter={coordinates}
        defaultZoom={5}
        margin={[50, 50, 50, 50]}
        options={undefined}
        onChange={e => {
          console.log(e)

          setCoordinates({ lat: e.center.lat, lng: e.center.lng })
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw })
        }}
        onChildClick={() => {}}
      />
    </div>
  )
}

export default Map
