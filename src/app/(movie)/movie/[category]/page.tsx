import Divider from '@/components/Divider'
import MovieCard from '@/components/MovieCard'
import { getMoviesList, getTvList } from '@/requests'

async function MovieCategoryPage({ params: { category } }: { params: { category: string } }) {
  let popularItems: any[] = []
  let topRatedItems: any[] = []
  let upcomingItems: any[] = []

  try {
    if (category === 'movie') {
      const res = await getMoviesList('popular', { page: 1 })
      popularItems = res.results
    }
    if (category === 'tv') {
      const res = await getTvList('popular', { page: 1 })
      popularItems = res.results
    }
  } catch (err: any) {
    console.log(err)
  }

  try {
    if (category === 'movie') {
      const res = await getMoviesList('top_rated', { page: 1 })
      topRatedItems = res.results
    }
    if (category === 'tv') {
      const res = await getTvList('top_rated', { page: 1 })
      topRatedItems = res.results
    }
  } catch (err: any) {
    console.log(err)
  }

  try {
    if (category === 'movie') {
      const res = await getMoviesList('upcoming', { page: 1 })
      upcomingItems = res.results
    }
    if (category === 'tv') {
      const res = await getTvList('on_the_air', { page: 1 })
      upcomingItems = res.results
    }
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className="min-h-screen px-21">
      {/* Trending */}
      <h1 className="pt-10 text-center text-4xl font-semibold uppercase">
        {category === 'movie' ? 'Movies' : 'TV Shows'}
      </h1>

      <Divider size={10} />

      <div className="grid grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-5">
        {popularItems.map(item => (
          <MovieCard
            id={`${category}/${item.id}`}
            title={item.title || item.name}
            image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            key={item.id}
          />
        ))}
      </div>

      <Divider size={15} />

      {/* Top Rated */}
      <h1 className="pt-10 text-center text-4xl font-semibold uppercase">Top Rated</h1>

      <Divider
        border
        size={10}
      />

      <div className="grid grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-5">
        {topRatedItems.map(item => (
          <MovieCard
            id={`${category}/${item.id}`}
            title={item.title || item.name}
            image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            key={item.id}
          />
        ))}
      </div>

      <Divider size={15} />

      {/* Upcoming */}
      <h1 className="pt-10 text-center text-4xl font-semibold uppercase">Coming</h1>

      <Divider
        border
        size={10}
      />

      <div className="grid grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-5">
        {upcomingItems.map(item => (
          <MovieCard
            id={`${category}/${item.id}`}
            title={item.title || item.name}
            image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            key={item.id}
          />
        ))}
      </div>
    </div>
  )
}

export default MovieCategoryPage
