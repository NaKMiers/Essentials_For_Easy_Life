const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}

const baseUrl = 'https://api.themoviedb.org/3/'

export const getMoviesList = async (type: 'upcoming' | 'popular' | 'top_rated', params: any) => {
  const url = `${baseUrl}movie/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const getTvList = async (type: 'popular' | 'top_rated' | 'on_the_air', params: any) => {
  const url = `${baseUrl}tv/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const getVideos = async (cate: 'movie' | 'tv', id: any) => {
  const url = `${baseUrl}${cate}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const search = async (cate: 'movie' | 'tv', params: any) => {
  const url = `${baseUrl}search/cate}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const detail = async (cate: 'movie' | 'tv', id: string, params: any) => {
  const url = `${baseUrl}cate}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const credits = async (cate: 'movie' | 'tv', id: string) => {
  const url = `${baseUrl}cate}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const similar = async (cate: 'movie' | 'tv', id: string) => {
  const url = `${baseUrl}cate}/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  const response = await fetch(url)
  return handleResponse(response)
}
