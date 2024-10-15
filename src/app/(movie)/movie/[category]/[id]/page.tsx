import Divider from '@/components/Divider'
import MovieCard from '@/components/movies/MovieCard'
import Group from '@/components/Group'
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

  try {
    const [movieRes, castsRes, videosRes, similarMoviesRes] = await Promise.all([
      detail(category, id, { params: {} }),
      credits(category, id),
      getVideos(category, id),
      similar(category, id),
    ])

    movie = movieRes
    casts = castsRes.cast
    videos = videosRes.results.slice(0, 5)
    similarMovies = similarMoviesRes.results

    console.log(casts)
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
          />
        </div>
        <div className="relative w-full pl-0 md:w-[70%] md:pl-8">
          <h1 className="mb-8 text-6xl text-light">{movie.title || movie.name}</h1>
          <div className="mb-8 flex flex-wrap gap-2">
            {movie.genres &&
              movie.genres.slice(0, 5).map((genre: any, index: number) => (
                <span
                  key={index}
                  className="rounded-3xl border-2 border-white bg-black px-6 py-2 text-lg font-semibold text-light"
                >
                  {genre.name}
                </span>
              ))}
          </div>
          <p className="py-2 font-body tracking-wider">{movie.overview}</p>

          {/* Casts */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Casts</h2>
            <Group indicatorClass={['w-5 text-light', 'w-5']}>
              {casts.map(cast => (
                <div
                  className="flex h-full flex-col items-center gap-2"
                  key={cast.id}
                >
                  <div className="h-full max-w-[100px] overflow-hidden rounded-lg shadow-lg">
                    <Image
                      className="h-full w-full object-cover"
                      width={100}
                      height={100}
                      src={
                        cast.profile_path
                          ? `${`https://image.tmdb.org/t/p/original/${cast.profile_path}`}`
                          : cast.gender === 1
                            ? '/images/default-male-profile.jpg'
                            : '/images/default-female-profile.jpg'
                      }
                      alt={cast.name}
                    />
                  </div>
                  <p className="mt-2 font-body text-sm tracking-wider">{cast.name}</p>
                </div>
              ))}
            </Group>
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
        <Group
          className="mx-4"
          classChild="w-1/2 md:w-1/5"
        >
          {similarMovies.map((movie: any) => (
            <MovieCard
              id={`${category}/${movie.id}`}
              title={movie.title || movie.name}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              key={movie.id}
            />
          ))}
        </Group>
      </div>

      <Divider size={50} />
    </div>
  )
}

export default MovieDetailPage
