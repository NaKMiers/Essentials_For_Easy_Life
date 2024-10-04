'use client'

import { memo, useState } from 'react'
import PlaceDetails from './PlaceDetails'

interface ListProps {
  places: any[]
  className?: string
}

function List({ places, className = '' }: ListProps) {
  // states
  const [type, setType] = useState<string>('restaurants')
  const [rating, setRating] = useState<number>(0)

  return (
    <div>
      <h1>List</h1>

      <select
        className="rounded-lg border-2 border-dark px-2 py-1 text-dark shadow-lg outline-none"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="restaurants">Restaurants</option>
        <option value="hotels">Hotels</option>
        <option value="attractions">Attractions</option>
      </select>

      <select
        className="rounded-lg border-2 border-dark px-2 py-1 text-dark shadow-lg outline-none"
        value={rating}
        onChange={e => setRating(+e.target.value)}
      >
        <option value={0}>All</option>
        <option value={3}>Above 3</option>
        <option value={4}>Above 4</option>
        <option value={4.5}>Above 4.5</option>
      </select>

      <div className="grid">
        {places?.map((place, index) => (
          <div
            key={index}
            className="flex items-center border-b border-gray-100 p-2"
          >
            <PlaceDetails place={place} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(List)
