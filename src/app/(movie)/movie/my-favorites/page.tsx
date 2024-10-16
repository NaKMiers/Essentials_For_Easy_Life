'use client'

import Divider from '@/components/Divider'
import MovieCard from '@/components/movie/MovieCard'
import { useState, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { useSession } from 'next-auth/react'

function MyFavoriteMovies() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // store
  const favoriteMovies = useAppSelector(state => state.movie.favoriteMovies)

  // states
  const [movies, setMovies] = useState<any[]>(
    favoriteMovies.filter((item: any) => item.type === 'movie')
  )
  const [tvShows, setTVShows] = useState<any[]>(favoriteMovies.filter((item: any) => item.type === 'tv'))
  const [isCollapseMovies, setIsCollapseMovies] = useState<boolean>(true)
  const [isCollapseTVShows, setIsCollapseTVShows] = useState<boolean>(true)

  useEffect(() => {
    const movies = favoriteMovies.filter((item: any) => item.type === 'movie')
    const tvShows = favoriteMovies.filter((item: any) => item.type === 'tv')

    setMovies(movies)
    setTVShows(tvShows)
  }, [favoriteMovies])

  return (
    <div className="min-h-screen p-21">
      <Divider size={16} />

      {movies.length > 0 && (
        <>
          <div
            className="flex cursor-pointer select-none items-center justify-between gap-2"
            onClick={() => setIsCollapseMovies(prev => !prev)}
          >
            <h1 className="inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-xl font-semibold text-transparent drop-shadow-md md:text-2xl lg:text-3xl">
              My Favorite Movies
            </h1>
            <FaChevronDown
              size={20}
              className={`${isCollapseMovies ? '' : 'rotate-180'} trans-200`}
            />
          </div>
          <div
            className={`grid grid-cols-2 gap-21 overflow-hidden md:grid-cols-3 lg:grid-cols-5 ${isCollapseMovies ? 'mt-4 max-h-[3000px]' : 'mt-0 max-h-0'} trans-300`}
          >
            {movies.map((item: any) => (
              <MovieCard
                type="movie"
                data={item.data}
                key={item._id}
              />
            ))}
          </div>
        </>
      )}

      {tvShows.length > 0 && (
        <>
          <div
            className={`${isCollapseMovies ? 'mt-20' : 'mt-4'} trans-200 flex cursor-pointer select-none items-center justify-between gap-2`}
            onClick={() => setIsCollapseTVShows(prev => !prev)}
          >
            <h1 className="inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-xl font-semibold text-transparent drop-shadow-md md:text-2xl lg:text-3xl">
              My Favorite TV Shows
            </h1>
            <FaChevronDown
              size={20}
              className={`${isCollapseTVShows ? '' : 'rotate-180'} trans-200`}
            />
          </div>
          <div
            className={`grid grid-cols-2 gap-21 overflow-hidden md:grid-cols-3 lg:grid-cols-5 ${isCollapseTVShows ? 'mt-4 max-h-[3000px]' : 'mt-0 max-h-0'} trans-300`}
          >
            {tvShows.map((item: any) => (
              <MovieCard
                type="tv"
                data={item.data}
                key={item.id}
              />
            ))}
          </div>
        </>
      )}

      <Divider size={50} />
    </div>
  )
}

export default MyFavoriteMovies
