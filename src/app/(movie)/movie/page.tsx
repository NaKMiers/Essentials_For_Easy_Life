import Divider from '@/components/Divider'
import Group from '@/components/Group'
import MovieCard from '@/components/movies/MovieCard'
import MovieHeroSlide from '@/components/movies/MovieHeroSlide'
import MovieSearchBar from '@/components/movies/MovieSearchBar'
import { getMoviesList, getTvList } from '@/requests'
import Link from 'next/link'
import { Fragment } from 'react'

async function MoviePage() {
  // banner
  let bannerMovies: any[] = []

  // lists
  let lists: any[] = []

  try {
    const [
      bannerMv,
      { results: trendingMovies },
      { results: topRatedMovies },
      { results: upcomingMovies },
      { results: trendingTvShows },
      { results: topRatedTvShows },
      { results: upcomingTvShows },
    ] = await Promise.all([
      getMoviesList('popular', { page: 2 }),
      getMoviesList('popular', {}),
      getMoviesList('top_rated', {}),
      getMoviesList('upcoming', {}),
      getTvList('popular', {}),
      getTvList('top_rated', {}),
      getTvList('on_the_air', {}),
    ])

    bannerMovies = bannerMv.results.slice(0, 6)

    lists = [
      {
        title: 'Trending Movies',
        data: trendingMovies,
        type: 'movie',
      },
      {
        title: 'Upcoming Movies',
        data: upcomingMovies,
        type: 'movie',
      },
      {
        title: 'Top Rated Movies',
        data: topRatedMovies,
        type: 'movie',
      },
      {
        title: 'Trending TV Shows',
        data: trendingTvShows,
        type: 'tv',
      },
      {
        title: 'Top Rated TV Shows',
        data: topRatedTvShows,
        type: 'tv',
      },
      {
        title: 'Upcoming TV Shows',
        data: upcomingTvShows,
        type: 'tv',
      },
    ]
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className="">
      {/* MARK: Hero Slides */}
      <MovieHeroSlide
        movies={bannerMovies}
        className="max-h-[calc(100vh-60px)]"
      />

      <Divider size={20} />

      <div className="mx-auto flex max-w-[500px]">
        <MovieSearchBar isRedirect />
      </div>

      <Divider size={20} />

      {lists.map((list: any, index: number) => (
        <Fragment key={index}>
          <div className="flex items-center justify-between px-8">
            <h1 className="text-2xl font-semibold md:text-3xl">{list.title}</h1>

            <Link
              href={`/movie/${list.type}`}
              className="trans-200 font-semiboldmd:py-2 rounded-3xl border-2 border-dark bg-white px-3 py-1 text-center text-sm md:text-base"
            >
              View More
            </Link>
          </div>

          <Group
            className="mx-8 mt-4"
            classChild="w-1/2 md:w-1/5"
            indicatorClass={['-mt-2', '-mt-2']}
          >
            {list.data.map((movie: any) => (
              <MovieCard
                id={`${list.type}/${movie.id}`}
                title={movie.title || movie.name}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                key={movie.id}
              />
            ))}
          </Group>

          <Divider size={20} />
        </Fragment>
      ))}

      <Divider size={50} />
    </div>
  )
}

export default MoviePage
