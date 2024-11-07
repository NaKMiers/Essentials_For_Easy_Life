const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}

const BASE_URL = 'https://api.themoviedb.org/3'

type MovieType = 'upcoming' | 'popular' | 'top_rated'
type TvType = 'popular' | 'top_rated' | 'on_the_air'
type Cate = 'movie' | 'tv'

export const getMoviesList = async (type: MovieType, params: any) => {
  const url = `${BASE_URL}/movie/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const getTvList = async (type: TvType, params: any) => {
  const url = `${BASE_URL}/tv/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const getVideos = async (cate: Cate, id: any) => {
  const url = `${BASE_URL}/${cate}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const search = async (cate: Cate, params: any) => {
  const url = `${BASE_URL}/search/${cate}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const detail = async (cate: Cate, id: string, params: any) => {
  const url = `${BASE_URL}/${cate}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const credits = async (cate: Cate, id: string) => {
  const url = `${BASE_URL}/${cate}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const similar = async (cate: Cate, id: string) => {
  const url = `${BASE_URL}/${cate}/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const searchAndQuery = async (cate: Cate, params: any) => {
  const url = `${BASE_URL}/search/${cate}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&${new URLSearchParams(params)}`
  const response = await fetch(url)
  return handleResponse(response)
}

export const likeMovieApi = async (id: string, type: Cate, data: any) => {
  const url = `/api/movie/like/${id}/${type}`
  const response = await fetch(url, { method: 'PATCH', body: JSON.stringify({ data }) })
  return handleResponse(response)
}
