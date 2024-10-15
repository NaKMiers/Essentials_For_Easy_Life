'use client'

import LocationList from '@/components/location/LocationList'
import Map from '@/components/location/Map'
import { getLocationDataApi, LocationType } from '@/requests'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'

function LocationPage() {
  // states
  const [type, setType] = useState<LocationType>('restaurants')
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

    const getPlacesData = debounce(async (type: LocationType, sw: any, ne: any) => {
      try {
        let data = await getLocationDataApi(type, sw, ne)
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
    }, 1000)

    // get places data
    getPlacesData(type, bounds.sw, bounds.ne)
  }, [bounds, coords.lat, coords.lng, type])

  const onLoad = useCallback((autoComplete: any) => {
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
        <LocationList
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
