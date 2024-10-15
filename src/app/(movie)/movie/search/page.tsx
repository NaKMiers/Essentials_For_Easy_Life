'use client'

import Divider from '@/components/Divider'
import MovieCard from '@/components/movies/MovieCard'
import MovieSearchBar from '@/components/movies/MovieSearchBar'
import { getMoviesList, getTvList } from '@/requests'
import { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

function MovieSearchPage() {
  // states
  const [initResult, setInitResult] = useState<any>({
    movies: [],
    tvShows: [],
  })
  const [result, setResult] = useState<any>({
    movies: [],
    tvShows: [],
  })
  const [isCollapseMovies, setIsCollapseMovies] = useState<boolean>(true)
  const [isCollapseTVShows, setIsCollapseTVShows] = useState<boolean>(true)

  // default results
  useEffect(() => {
    const getPopularMovies = async () => {
      const res = await getMoviesList('popular', {})

      // set result
      setInitResult((prev: any) => ({ ...prev, movies: res.results }))
      setResult((prev: any) => ({ ...prev, movies: res.results }))
    }

    const getPopularTvShows = async () => {
      const res = await getTvList('popular', {})

      // set result
      setInitResult((prev: any) => ({ ...prev, tvShows: res.results }))
      setResult((prev: any) => ({ ...prev, tvShows: res.results }))
    }

    getPopularMovies()
    getPopularTvShows()
  }, [])

  return (
    <div className="min-h-screen p-21">
      <div className="mx-auto flex max-w-[500px]">
        <MovieSearchBar
          initResult={initResult}
          setResult={setResult}
        />
      </div>

      <Divider size={8} />

      {result.movies.length > 0 && (
        <>
          <div
            className="flex cursor-pointer select-none items-center justify-between gap-2"
            onClick={() => setIsCollapseMovies(prev => !prev)}
          >
            <h1 className="inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-xl font-semibold text-transparent drop-shadow-md md:text-2xl lg:text-3xl">
              Movies
            </h1>
            <FaChevronDown
              size={20}
              className={`${isCollapseMovies ? '' : 'rotate-180'} trans-200`}
            />
          </div>
          <div
            className={`grid grid-cols-2 gap-21 overflow-hidden md:grid-cols-3 lg:grid-cols-5 ${isCollapseMovies ? 'mt-4 max-h-[3000px]' : 'mt-0 max-h-0'} trans-300`}
          >
            {result.movies.map((item: any) => (
              <MovieCard
                id={`movie/${item.id}`}
                title={item.title || item.name}
                image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                key={item.id}
              />
            ))}
          </div>
        </>
      )}

      {result.tvShows.length > 0 && (
        <>
          <div
            className={`${isCollapseMovies ? 'mt-20' : 'mt-4'} trans-200 flex cursor-pointer select-none items-center justify-between gap-2`}
            onClick={() => setIsCollapseTVShows(prev => !prev)}
          >
            <h1 className="inline-block bg-gradient-to-r from-rose-500 to-sky-500 bg-clip-text text-xl font-semibold text-transparent drop-shadow-md md:text-2xl lg:text-3xl">
              TV Shows
            </h1>
            <FaChevronDown
              size={20}
              className={`${isCollapseTVShows ? '' : 'rotate-180'} trans-200`}
            />
          </div>
          <div
            className={`grid grid-cols-2 gap-21 overflow-hidden md:grid-cols-3 lg:grid-cols-5 ${isCollapseTVShows ? 'mt-4 max-h-[3000px]' : 'mt-0 max-h-0'} trans-300`}
          >
            {result.tvShows.map((item: any) => (
              <MovieCard
                id={`tv/${item.id}`}
                title={item.title || item.name}
                image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
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

export default MovieSearchPage
