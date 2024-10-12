import Divider from '@/components/Divider'
import MovieCard from '@/components/MovieCard'
import Group from '@/components/Group'
import MovieHeroSlide from '@/components/movies/MovieHeroSlide'
import { getMoviesList, getTvList } from '@/requests'
import Link from 'next/link'

async function MoviePage() {
  let bannerMovies: any[] = []
  let trendingMovies: any[] = []
  let topRatedMovies: any[] = []
  let upcomingMovies: any[] = []
  let trendingTvShows: any[] = []
  let topRatedTvShows: any[] = []
  let upcomingTvShows: any[] = []

  // get banner movies
  try {
    const res = await getMoviesList('popular', { page: 2 })
    bannerMovies = res.results.slice(1, 6)
  } catch (err: any) {
    console.log('')
  }

  // get trending movies
  try {
    const res = await getMoviesList('popular', {})
    trendingMovies = res.results
  } catch (err: any) {
    console.log('')
  }

  // get top rated movies
  try {
    const res = await getMoviesList('top_rated', {})
    topRatedMovies = res.results
  } catch (err: any) {
    console.log('')
  }

  // get upcoming movies
  try {
    const res = await getMoviesList('upcoming', {})
    upcomingMovies = res.results
  } catch (err: any) {
    console.log('')
  }

  // get trending tv shows
  try {
    const res = await getTvList('popular', {})
    trendingTvShows = res.results
  } catch (err: any) {
    console.log('')
  }

  // get top rated tv shows
  try {
    const res = await getTvList('top_rated', {})
    topRatedTvShows = res.results
  } catch (err: any) {
    console.log('')
  }

  // get upcoming tv shows
  try {
    const res = await getTvList('on_the_air', {})
    upcomingTvShows = res.results
  } catch (err: any) {
    console.log('')
  }

  return (
    <div className="">
      {/* MARK: Hero Slides */}
      <MovieHeroSlide movies={bannerMovies} />

      <Divider size={20} />

      {/* MARK: Trending Movies */}
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Trending Movies</h1>

        <Link
          href="/movie/movie"
          className="trans-200 rounded-3xl border-2 border-white px-3 py-1 text-center text-sm font-semibold hover:bg-white hover:text-dark md:py-2 md:text-base"
        >
          View More
        </Link>
      </div>

      <Group
        className="mx-8 mt-4"
        classChild="w-1/2 md:w-1/5"
      >
        {trendingMovies.map((movie: any) => (
          <MovieCard
            id={`movie/${movie.id}`}
            title={movie.title}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            key={movie.id}
          />
        ))}
      </Group>

      <Divider size={20} />

      {/* MARK: Upcoming Movies */}
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Upcoming Movies</h1>

        <Link
          href="/movie/movie"
          className="trans-200 rounded-3xl border-2 border-white px-3 py-1 text-center text-sm font-semibold hover:bg-white hover:text-dark md:py-2 md:text-base"
        >
          View More
        </Link>
      </div>

      <Group
        className="mx-8 mt-4"
        classChild="w-1/2 md:w-1/5"
      >
        {upcomingMovies.map((movie: any) => (
          <MovieCard
            id={`movie/${movie.id}`}
            title={movie.title}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            key={movie.id}
          />
        ))}
      </Group>

      <Divider size={20} />

      {/* MARK: Top Rated Movies */}
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Top Rated Movies</h1>

        <Link
          href="/movie/movie"
          className="trans-200 rounded-3xl border-2 border-white px-3 py-1 text-center text-sm font-semibold hover:bg-white hover:text-dark md:py-2 md:text-base"
        >
          View More
        </Link>
      </div>

      <Group
        className="mx-8 mt-4"
        classChild="w-1/2 md:w-1/5"
      >
        {topRatedMovies.map((movie: any) => (
          <MovieCard
            id={`movie/${movie.id}`}
            title={movie.title}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            key={movie.id}
          />
        ))}
      </Group>

      <Divider size={20} />

      {/* MARK: Trending TV Shows */}
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Trending TV Shows</h1>

        <Link
          href="/movie/tv"
          className="trans-200 rounded-3xl border-2 border-white px-3 py-1 text-center text-sm font-semibold hover:bg-white hover:text-dark md:py-2 md:text-base"
        >
          View More
        </Link>
      </div>

      <Group
        className="mx-8 mt-4"
        classChild="w-1/2 md:w-1/5"
      >
        {trendingTvShows.map((movie: any) => (
          <MovieCard
            id={`tv/${movie.id}`}
            title={movie.name}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            key={movie.id}
          />
        ))}
      </Group>

      <Divider size={20} />

      {/* MARK: Upcoming TV Shows */}
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Upcoming TV Shows</h1>

        <Link
          href="/movie/tv"
          className="trans-200 rounded-3xl border-2 border-white px-3 py-1 text-center text-sm font-semibold hover:bg-white hover:text-dark md:py-2 md:text-base"
        >
          View More
        </Link>
      </div>

      <Group
        className="mx-8 mt-4"
        classChild="w-1/2 md:w-1/5"
      >
        {upcomingTvShows.map((movie: any) => (
          <MovieCard
            id={`tv/${movie.id}`}
            title={movie.name}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            key={movie.id}
          />
        ))}
      </Group>

      <Divider size={20} />

      {/* MARK: Top Rated TV Shows */}
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Top Rated TV Shows</h1>

        <Link
          href="/movie/tv"
          className="trans-200 rounded-3xl border-2 border-white px-3 py-1 text-center text-sm font-semibold hover:bg-white hover:text-dark md:py-2 md:text-base"
        >
          View More
        </Link>
      </div>

      <Group
        className="mx-8 mt-4"
        classChild="w-1/2 md:w-1/5"
      >
        {topRatedTvShows.map((movie: any) => (
          <MovieCard
            id={`tv/${movie.id}`}
            title={movie.name}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            key={movie.id}
          />
        ))}
      </Group>

      <Divider size={50} />
    </div>
  )
}

export default MoviePage
