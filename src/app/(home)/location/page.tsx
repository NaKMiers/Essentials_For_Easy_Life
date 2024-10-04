'use client'

import List from '@/components/List'
import Map from '@/components/Map'
import { useState, useEffect } from 'react'

function LocationPage() {
  const [places, setPlaces] = useState<any[]>([])
  const [coordinates, setCoordinates] = useState<any>({ lat: 10.8068864, lng: 106.6860544 })
  const [bounds, setBounds] = useState<any>({})

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      console.log('latitude: ', latitude)
      console.log('longitude: ', longitude)
      setCoordinates({ lat: latitude, lng: longitude })
    })
  }, [])

  useEffect(() => {
    const getPlaces = async () => {
      console.log('getPlaces')

      try {
        const response = await fetch(
          `https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=${bounds.sw.lat}&tr_latitude=${bounds.ne.lat}&bl_longitude=${bounds.sw.lng}&tr_longitude=${bounds.ne.lng}&restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&limit=30&currency=USD&open_now=false&lunit=km&lang=en_US`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '6e63c42db5msh604da1c19d807b8p1dbb33jsndd4612937df2',
              'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
            },
          }
        )
        const result = await response.json()
        console.log(result.data)

        setPlaces(result.data)
      } catch (error) {
        console.error(error)
      }
    }

    if (coordinates.lat && coordinates.lng && bounds) {
      getPlaces()
    }
  }, [coordinates, bounds])

  return (
    <div className="grid min-h-screen grid-cols-12">
      <div className="col-span-3">
        <List places={places} />
      </div>
      <div className="col-span-9">
        <Map
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          setBounds={setBounds}
        />
      </div>
    </div>
  )
}

export default LocationPage
