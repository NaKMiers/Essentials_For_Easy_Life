import Divider from '@/components/Divider'
import MovieCard from '@/components/movie/MovieCard'
import { getMoviesList, getTvList } from '@/requests'
import { Fragment } from 'react'

async function MovieCategoryPage({ params: { category } }: { params: { category: string } }) {
  // data
  let lists: any[] = []

  try {
    const [{ results: popularItems }, { results: topRatedItems }, { results: upcomingItems }] =
      category === 'movie'
        ? await Promise.all([
            getMoviesList('popular', { page: 1 }),
            getMoviesList('top_rated', { page: 1 }),
            getMoviesList('upcoming', { page: 1 }),
          ])
        : await Promise.all([
            getTvList('popular', { page: 1 }),
            getTvList('top_rated', { page: 1 }),
            getTvList('on_the_air', { page: 1 }),
          ])

    lists = [
      {
        title: `Trending ${category === 'movie' ? 'Movies' : 'TV Shows'}`,
        data: popularItems,
        type: category,
      },
      {
        title: `Top Rated ${category === 'movie' ? 'Movies' : 'TV Shows'}`,
        data: topRatedItems,
        type: category,
      },
      {
        title: `Upcoming ${category === 'movie' ? 'Movies' : 'TV Shows'}`,
        data: upcomingItems,
        type: category,
      },
    ]
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className="min-h-screen px-21">
      {lists.map((list: any, index: number) => (
        <Fragment key={index}>
          <h1 className="pt-10 text-center text-4xl font-semibold uppercase">{list.title}</h1>

          <Divider size={10} />

          <div className="grid grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-5">
            {list.data.map((item: any) => (
              <MovieCard
                type={list.type}
                data={item}
                key={item.id}
              />
            ))}
          </div>

          <Divider size={15} />
        </Fragment>
      ))}

      <Divider size={50} />
    </div>
  )
}

export default MovieCategoryPage
