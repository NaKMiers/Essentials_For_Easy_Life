'use client'

import { createRef, memo, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Divider from './Divider'
import PlaceDetails from './PlaceDetails'
import { BsLayoutSidebarInset } from 'react-icons/bs'

interface ListProps {
  places: any[]
  type: string
  setType: any
  rating: string
  setRating: any
  childClicked: any
  isLoading: boolean
  open: boolean
  setOpen: any
  className?: string
}

function List({
  places,
  type,
  setType,
  rating,
  setRating,
  childClicked,
  isLoading,
  open,
  setOpen,
}: ListProps) {
  // states
  const [search, setSearch] = useState<string>('')
  const [elRefs, setElRefs] = useState([])

  useEffect(() => {
    setElRefs(refs => {
      const newRefs = Array(places.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef<HTMLDivElement>())
      return newRefs
    })
  }, [places])

  return (
    <div className="relative h-full">
      <button
        className={`md:hidden ${!open ? 'trans-300 absolute -left-2 z-50 -translate-x-full' : ''} mb-2 rounded-l-lg bg-neutral-800 p-2 text-light`}
        onClick={() => setOpen((prev: any) => !prev)}
      >
        <BsLayoutSidebarInset size={24} />
      </button>

      {!isLoading ? (
        <div className="no-scrollbar h-full overflow-y-auto">
          <input
            type="text"
            placeholder="Search places..."
            className="mb-2 mt-2 h-10 w-full rounded-lg border-2 border-dark px-3 py-1 text-dark shadow-lg outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex justify-between">
            <select
              className="h-10 rounded-lg border-2 border-dark px-2 py-1 text-dark shadow-lg outline-none"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="restaurants">Restaurants</option>
              <option value="hotels">Hotels</option>
              <option value="attractions">Attractions</option>
            </select>

            <select
              className="h-10 rounded-lg border-2 border-dark px-2 py-1 text-dark shadow-lg outline-none"
              value={rating}
              onChange={e => setRating(+e.target.value)}
            >
              <option value={0}>All</option>
              <option value={3}>Above 3</option>
              <option value={4}>Above 4</option>
              <option value={4.5}>Above 4.5</option>
            </select>
          </div>

          <Divider
            size={4}
            border
          />

          <div className="grid gap-3">
            {places?.map((place, index) => (
              <div
                key={index}
                className="flex items-center border-b border-gray-100 p-2 pb-4"
              >
                <PlaceDetails
                  selected={Number(childClicked) === index}
                  refProp={elRefs[index]}
                  place={place}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <AiOutlineLoading3Quarters
            size={100}
            className="animate-spin"
          />
        </div>
      )}
    </div>
  )
}

export default memo(List)
