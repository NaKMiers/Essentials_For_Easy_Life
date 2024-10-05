import Divider from '@/components/Divider'
import MovieCard from '@/components/MovieCard'
import MovieGroup from '@/components/MovieGroup'
import { credits, detail, getVideos, similar } from '@/requests'
import Image from 'next/image'

async function MovieDetailPage({
  params: { category, id },
}: {
  params: { category: 'movie' | 'tv'; id: string }
}) {
  let movie: any = null
  let casts: any[] = []
  let videos: any[] = []
  let similarMovies: any[] = []

  // get movie detail
  try {
    const res = await detail(category, id, { params: {} })
    movie = res

    // console.log(movie)
  } catch (err: any) {
    console.log(err)
  }

  // get movie casts
  try {
    const res = await credits(category, id)
    casts = res.cast
  } catch (err: any) {
    console.log(err)
  }

  // get movie videos
  try {
    const res = await getVideos(category, id)
    videos = res.results.slice(0, 5)
  } catch (err: any) {
    console.log(err)
  }

  // get similar movies
  try {
    const res = await similar(category, id)
    similarMovies = res.results

    console.log(similarMovies)
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div
        className="relative h-[50vh] bg-no-repeat"
        style={{
          background: `url(${`https://image.tmdb.org/t/p/original/${movie.backdrop_path ? movie.backdrop_path : movie.poster_path}`})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute left-0 top-0 h-full w-full bg-black bg-opacity-60" />
        <div className="absolute bottom-0 left-0 h-[100px] w-full bg-opacity-60 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
      </div>

      {/* Movie & Cast */}
      <div className="relative mx-auto -mt-[200px] mb-3 flex max-w-[1200px] px-21 py-8">
        <div className="hidden flex-1 sm:block">
          <div
            className="rounded-xl bg-no-repeat pt-[165%]"
            style={{
              background: `url(${`https://image.tmdb.org/t/p/original/${movie.backdrop_path ? movie.backdrop_path : movie.poster_path}`})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          ></div>
        </div>
        <div className="relative w-full pl-0 md:w-[70%] md:pl-8">
          <h1 className="mb-8 text-6xl">{movie.title || movie.name}</h1>
          <div className="mb-8 flex flex-wrap gap-2">
            {movie.genres &&
              movie.genres.slice(0, 5).map((genre: any, index: number) => (
                <span
                  key={index}
                  className="rounded-3xl border-2 border-white bg-black px-6 py-2 text-lg font-semibold"
                >
                  {genre.name}
                </span>
              ))}
          </div>
          <p className="font-body tracking-wider">{movie.overview}</p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Casts</h2>
            <div className="no-scrollbar mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto">
              {casts.map(cast => (
                <div
                  className="flex-shrink-0 snap-start"
                  key={cast.id}
                >
                  <div className="max-w-[100px] overflow-hidden rounded-lg shadow-lg">
                    <Image
                      className="h-full w-full object-cover"
                      width={100}
                      height={100}
                      src={`${`https://image.tmdb.org/t/p/original/${cast.profile_path}`}`}
                      alt={cast.name}
                    />
                  </div>
                  <p className="mt-2 font-body text-sm tracking-wider">{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="mx-auto flex max-w-1200 flex-col gap-12 px-21">
        {videos.map(video => (
          <div key={video.id}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{video.name}</h2>
            </div>
            <iframe
              className="aspect-video rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${video.key}`}
              width="100%"
              title="video"
            />
          </div>
        ))}
      </div>

      <Divider size={20} />

      {/* Similar */}
      <div className="mx-auto max-w-1200 px-21">
        <h2 className="text-center text-2xl font-semibold">Similar</h2>
        <MovieGroup
          className="mx-4"
          classChild="w-1/2 md:w-1/5"
        >
          {similarMovies.map((movie: any) => (
            <MovieCard
              id={`${category}/${movie.id}`}
              title={movie.name}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              key={movie.id}
            />
          ))}
        </MovieGroup>
      </div>
    </div>
  )
}

export default MovieDetailPage
