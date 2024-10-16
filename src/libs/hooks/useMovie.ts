'use client'

import { useAppDispatch } from '@/libs/hooks'
import { setFavoriteMovies } from '@/libs/reducers/movieReducer'
import { getUserFavoriteMoviesApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

function useMovie() {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // get favorite movies
  useEffect(() => {
    const getFavoriteMovies = async () => {
      try {
        const { movies } = await getUserFavoriteMoviesApi()

        dispatch(setFavoriteMovies(movies))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    if (curUser) {
      getFavoriteMovies()
    }
  }, [dispatch, curUser])

  return null
}

export default useMovie
