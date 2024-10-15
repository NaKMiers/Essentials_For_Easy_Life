// Location ------------------

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}

export type LocationType = 'hotels' | 'restaurants' | 'attractions'

// [GET]:
export const getLocationDataApi = async (type: LocationType, sw: any, ne: any) => {
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

  return handleResponse(res)
}
