'use client'

import List from '@/components/List'
import Map from '@/components/Map'
import { useCallback, useEffect, useState } from 'react'

function LocationPage() {
  // states
  const [type, setType] = useState<string>('restaurants')
  const [rating, setRating] = useState<string>('')

  const [coords, setCoords] = useState<any>({})
  const [bounds, setBounds] = useState<any>({})

  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([])
  const [places, setPlaces] = useState<any[]>([])

  const [autocomplete, setAutocomplete] = useState<any>(null)
  const [childClicked, setChildClicked] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [openList, setOpenList] = useState<boolean>(true)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      console.log(latitude, longitude)
      setCoords({ lat: latitude, lng: longitude })
    })
  }, [])

  useEffect(() => {
    const filtered = places.filter(place => Number(place.rating) > Number(rating))

    setFilteredPlaces(filtered)
  }, [places, rating])

  useEffect(() => {
    if (!bounds.sw || !bounds.ne) return

    // start loading
    setIsLoading(true)

    const getPlacesData = async (type: string, sw: any, ne: any) => {
      try {
        const res = await fetch(
          `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary?bl_latitude=${sw.lat}&tr_latitude=${ne.lat}&bl_longitude=${sw.lng}&tr_longitude=${ne.lng}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
              'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
            },
          }
        )
        let data: any = await res.json()
        data = data.data || []

        // set places data
        setPlaces(data.filter((place: any) => place.name && place.num_reviews > 0))
        setFilteredPlaces([])
        setRating('')
      } catch (error) {
        console.log(error)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    }

    // get places data
    getPlacesData(type, bounds.sw, bounds.ne)
  }, [bounds, coords.lat, coords.lng, type])

  const onLoad = useCallback((autoComplete: any) => {
    console.log('autoComplete:', autoComplete)
    setAutocomplete(autoComplete)
  }, [])

  const onPlaceChanged = useCallback(() => {
    const lat = autocomplete.getPlace().geometry.location.lat()
    const lng = autocomplete.getPlace().geometry.location.lng()
    setCoords({ lat, lng })
  }, [autocomplete])

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-1 items-center justify-center">
        <Map
          setChildClicked={setChildClicked}
          setBounds={setBounds}
          setCoords={setCoords}
          coords={coords}
          places={filteredPlaces.length ? filteredPlaces : places}
        />
      </div>

      <div className={`${openList ? '' : '-mr-[300px]'} trans-300 h-full w-[300px] p-2 md:mr-0`}>
        <List
          open={openList}
          setOpen={setOpenList}
          isLoading={isLoading}
          childClicked={childClicked}
          places={filteredPlaces.length ? filteredPlaces : places}
          type={type}
          setType={setType}
          rating={rating}
          setRating={setRating}
        />
      </div>
    </div>
  )
}

export default LocationPage
