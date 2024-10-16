import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const movie = createSlice({
  name: 'movie',
  initialState: {
    favoriteMovies: [] as any[],
  },
  reducers: {
    setFavoriteMovies: (state, action: PayloadAction<any[]>) => ({
      ...state,
      favoriteMovies: action.payload,
    }),
  },
})

export const { setFavoriteMovies } = movie.actions
export default movie.reducer
