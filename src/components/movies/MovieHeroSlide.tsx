'use client'

import Image from 'next/image'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import MovieHeroSlideItem from './MovieBannerItem'

interface SliderProps {
  movies: any[]
  time?: number
  className?: string
}

function MovieHeroSlide({ time, movies, className = '' }: SliderProps) {
  // states
  const [slide, setSlide] = useState<number>(1)
  const [isChanging, setIsChanging] = useState<boolean>(false)

  // refs
  const slideTrackRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // MARK: Slide Functions
  const changeSlide = useCallback((value: number) => {
    const slideTrack = slideTrackRef.current
    const indicator = indicatorRef.current

    if (slideTrack && indicator) {
      setIsChanging(true)
      const slideWidth = slideTrack.children[0].clientWidth

      slideTrack.scrollTo({
        left: slideWidth * (value - 1),
        behavior: 'smooth',
      })

      if (indicator) {
        indicator.scrollTo({
          left: indicator.children[0].clientWidth * (value - 1),
          behavior: 'smooth',
        })
      }

      setSlide(value)

      setTimeout(() => {
        setIsChanging(false)
      }, 500)
    }
  }, [])

  // to previous slide
  const prevSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft - slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // to next slide
  const nextSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft + slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // catch event scroll slider to set current slide
  useEffect(() => {
    const slideTrack = slideTrackRef.current
    const indicator = indicatorRef.current

    if (!slideTrack || !indicator) return

    const handleSetSlide = () => {
      if (isChanging) return

      const slideWidth = slideTrack.children[0].clientWidth
      const slideIndex = Math.round(slideTrack.scrollLeft / slideWidth) + 1

      setSlide(slideIndex)

      // set scroll left for indicatorRef
      if (indicator) {
        indicator.scrollTo({
          left: indicator.children[0].clientWidth * (slideIndex - 1),
          behavior: 'smooth',
        })
      }
    }

    slideTrackRef.current.addEventListener('scroll', handleSetSlide)

    return () => {
      slideTrack.removeEventListener('scroll', handleSetSlide)
    }
  }, [isChanging])

  // next slide by time
  useEffect(() => {
    if (time) {
      const interval = setInterval(() => {
        nextSlide()
      }, time)

      return () => clearInterval(interval)
    }
  }, [time, nextSlide])

  return (
    <div className={`group relative h-screen w-full overflow-hidden ${className}`}>
      {/* MARK: Slide Track */}
      <div
        className={`no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto ease-linear`}
        ref={slideTrackRef}
      >
        {movies.map(movie => (
          <MovieHeroSlideItem
            movie={movie}
            key={movie._id}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="arrows absolute bottom-[50px] left-[10%] z-20 flex gap-4 md:left-[30%]">
        <button
          className="prev trans-200 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-dark bg-white text-dark shadow-lg hover:bg-dark-0 hover:text-light"
          onClick={prevSlide}
        >
          <FaChevronLeft size={16} />
        </button>
        <button
          className="next trans-200 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-dark bg-white text-dark shadow-lg hover:bg-dark-0 hover:text-light"
          onClick={nextSlide}
        >
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* MARK: Indicators */}
      {movies.length >= 2 && (
        <div
          className={`trans-300 no-scrollbar absolute bottom-[0] left-[43%] z-10 flex w-[57%] snap-x snap-mandatory items-center overflow-x-auto p-21`}
          ref={indicatorRef}
        >
          {movies.map((movie, index) => (
            <div
              className="flex-shrink-0 snap-start p-21/2"
              key={movie._id}
            >
              <button
                className={`relative aspect-video max-w-[200px] rounded-lg border-2 ${
                  slide === index + 1 ? 'shadow-lg' : 'border-light shadow-md'
                } trans-300 overflow-hidden hover:-translate-y-1 hover:scale-105 hover:opacity-100`}
                onClick={() => changeSlide(index + 1)}
                key={movie._id}
              >
                <Image
                  className="h-full w-full object-cover"
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  width={200}
                  height={200}
                  alt={movie.title}
                  loading="lazy"
                />

                <div
                  className={`absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-neutral-900 bg-opacity-40 p-2 text-light`}
                >
                  <div
                    className="line-clamp-1 text-ellipsis text-xs font-bold uppercase tracking-[5px] drop-shadow-lg"
                    title={movie.author}
                  >
                    {movie.author}
                  </div>
                  <div
                    className="line-clamp-2 text-ellipsis font-semibold drop-shadow-md"
                    title={movie.title}
                  >
                    {movie.title}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(MovieHeroSlide)
