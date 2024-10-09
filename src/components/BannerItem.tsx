import { getVideos } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { memo, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface BannerItemProps {
  movie: any
  className?: string
}

function MovieHeroSlideItem({ movie, className }: BannerItemProps) {
  // states
  const [openTrailer, setOpenTrailer] = useState<boolean>(false)
  const [trailerSrc, setTrailerSrc] = useState<string>('')

  // handle get video trailer
  const handleShowTrailer = useCallback(async () => {
    if (trailerSrc) {
      setOpenTrailer(true)
      return
    }

    try {
      const videos = await getVideos('movie', movie.id)

      if (videos.results.length < 0 || !videos.results[0].key) {
        toast.error('No trailer found')
        return
      }

      setTrailerSrc(`https://www.youtube.com/embed/${videos.results[0].key}?rel=0`)
      setOpenTrailer(true)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [trailerSrc, movie.id])

  return (
    <>
      <div
        className={`relative h-full w-full flex-shrink-0 snap-center ${className}`}
        key={movie._id}
      >
        <div
          className="h-full w-full"
          style={{
            background: `url(${`https://image.tmdb.org/t/p/original/${movie.backdrop_path ? movie.backdrop_path : movie.poster_path}`})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <div className="content absolute left-1/2 top-[20%] w-full max-w-[1200px] -translate-x-1/2 px-21 text-light drop-shadow-2xl md:top-[15%]">
          <div className="w-full max-w-[700px]">
            <div className="author font-bold uppercase tracking-[10px] drop-shadow-lg">
              {movie.author}
            </div>
            <div
              className="title line-clamp-2 text-ellipsis stroke-neutral-950 stroke-2 text-[30px] font-bold leading-[1.3em] drop-shadow-md md:text-[3em]"
              title={movie.title}
            >
              {movie.title}
            </div>

            <div className="desc line-clamp-4 text-ellipsis pr-[20%] font-body tracking-wider drop-shadow-md">
              {movie.overview}
            </div>
            <div className="buttons mt-5 flex flex-wrap gap-2">
              <Link
                href={`/movie/${movie.id}`}
                className="relative flex items-center rounded-[30px] border-4 border-transparent bg-red-500 px-7 py-2 text-xl font-semibold text-white shadow-[0px_0px_7px_8px_#ff00004d] transition-shadow duration-300 hover:shadow-[0px_0px_7px_15px_#ff00004d]"
              >
                Watch now
              </Link>
              <button
                className="rounded-[30px] border-[3px] border-white bg-transparent px-7 py-2 text-xl font-semibold text-white transition-all duration-300 hover:bg-white hover:text-red-500"
                onClick={handleShowTrailer}
              >
                Watch trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openTrailer && trailerSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-0 left-0 right-0 top-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-21 ${className}`}
            onClick={() => setOpenTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="aspect-video w-full rounded-medium bg-white p-21 shadow-medium"
              onClick={e => e.stopPropagation()}
            >
              <iframe
                className="h-full w-full rounded-lg"
                src={trailerSrc}
                title="Responsive React Movies App With API | ReactJS Movies | ReactJS Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(MovieHeroSlideItem)
