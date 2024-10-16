import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './reducers/modalReducer'
import movieReducer from './reducers/movieReducer'
import musicReducer from './reducers/musicReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      movie: movieReducer,
      music: musicReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
