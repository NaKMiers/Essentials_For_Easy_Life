'use client'

import { getMoviesList, getVideos } from '@/requests'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import './hero-slide.scss'

// Types for movie items
interface MovieItem {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
}

// Component
const HeroSlide: React.FC = () => {
  // SwiperCore.use([Autoplay])

  const [movieItems, setMovieItems] = useState<MovieItem[]>([])

  useEffect(() => {
    const getMovies = async () => {
      const params = { page: 1 }
      try {
        const response = await getMoviesList('popular', params)
        setMovieItems(response.results.slice(1, 4))
        console.log(response)
      } catch {
        console.error('Error fetching movie list')
      }
    }
    getMovies()
  }, [])

  return (
    <div className="hero-slide">
      <Swiper
        modules={[]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        // autoplay={{ delay: 3000 }}
      >
        {movieItems.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <HeroSlideItem
                item={item}
                className={`${isActive ? 'active' : ''}`}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* {movieItems.map((item, i) => (
        <TrailerModal
          key={i}
          item={item}
        />
      ))} */}
    </div>
  )
}

interface HeroSlideItemProps {
  item: MovieItem
  className: string
}

const HeroSlideItem: React.FC<HeroSlideItemProps> = ({ item, className }) => {
  // const router = useRouter()
  const background = `https://image.tmdb.org/t/p/original/${item.backdrop_path ? item.backdrop_path : item.poster_path}`

  const setModalActive = async () => {
    const modal = document.querySelector(`#modal_${item.id}`)
    const videos = await getVideos('movie', item.id)

    if (videos.results.length > 0) {
      const videoSrc = `https://www.youtube.com/embed/${videos.results[0].key}`
      modal?.querySelector('iframe')?.setAttribute('src', videoSrc)
    } else {
      // modal?.querySelector('.modal__content')!.innerHTML = 'No trailer'
    }

    modal?.classList.toggle('active')
  }

  return (
    <div
      className={`hero-slide__item ${className}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="hero-slide__item__content container">
        <div className="hero-slide__item__content__info">
          <h2 className="title">{item.title}</h2>
          <div className="overview">{item.overview}</div>
          <div className="btns">
            {/* <Button onClick={() => router.push(`/movie/${item.id}`)}>Watch now</Button> */}
            {/* <OutlineButton onClick={setModalActive}>Watch trailer</OutlineButton> */}
          </div>
        </div>
        <div className="hero-slide__item__content__poster">
          <Image
            src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
            alt={item.title}
            fill
          />
        </div>
      </div>
    </div>
  )
}

interface TrailerModalProps {
  item: MovieItem
}

// const TrailerModal: React.FC<TrailerModalProps> = ({ item }) => {
//   const iframeRef = useRef<HTMLIFrameElement>(null)

//   const onClose = () => {
//     iframeRef.current?.setAttribute('src', '')
//   }

//   return (
//     <Modal
//       active={false}
//       id={`modal_${item.id}`}
//     >
//       <ModalContent onClose={onClose}>
//         <iframe
//           ref={iframeRef}
//           width="100%"
//           height="500px"
//           title="trailer"
//         ></iframe>
//       </ModalContent>
//     </Modal>
//   )
// }

export default HeroSlide
