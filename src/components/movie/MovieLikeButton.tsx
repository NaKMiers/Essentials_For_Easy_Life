'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setFavoriteMovies } from '@/libs/reducers/movieReducer'
import { likeMovieApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

interface MovieLikeButtonProps {
  type: 'movie' | 'tv'
  data: any
  size?: number
  className?: string
}

function MovieLikeButton({ type, data, size = 16, className = '' }: MovieLikeButtonProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // store
  const favoriteMovies = useAppSelector(state => state.movie.favoriteMovies)

  // values
  const [liked, setLiked] = useState<boolean>(favoriteMovies.some(m => m.movieId === data.id.toString()))

  useEffect(() => {
    setLiked(favoriteMovies.some(m => m.movieId === data.id.toString()))
  }, [favoriteMovies, data.id])

  // handle like/unlike movie
  const handleLikeMovie = useCallback(async () => {
    if (!curUser) return

    try {
      const { movie } = await likeMovieApi(data.id, type, data)

      console.log('movie:', movie)

      if (movie) {
        dispatch(setFavoriteMovies([...favoriteMovies, movie]))
        setLiked(true)
      } else {
        dispatch(setFavoriteMovies(favoriteMovies.filter(m => m.movieId !== data.id.toString())))
        setLiked(false)
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [dispatch, data.id, type, favoriteMovies, curUser])

  return (
    <button
      className={`group text-rose-500 ${className}`}
      onClick={handleLikeMovie}
    >
      {liked ? (
        <FaHeart
          size={size}
          className="wiggle"
        />
      ) : (
        <FaRegHeart
          size={size}
          className="wiggle"
        />
      )}
    </button>
  )
}

export default memo(MovieLikeButton)
