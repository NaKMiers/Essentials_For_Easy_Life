import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const music = createSlice({
  name: 'music',
  initialState: {
    curPlaylist: null,
    curTrack: null,
    isPlaying: false,
    curPreviewTrack: null,
    likedTracks: [],
  },
  reducers: {
    setCurPlaylist: (state, action: PayloadAction<any>) => ({
      ...state,
      curPlaylist: action.payload,
    }),
    setCurTrack: (state, action: PayloadAction<any>) => ({
      ...state,
      curTrack: action.payload,
    }),
    setIsPlaying: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPlaying: action.payload,
    }),
    setCurPreviewTrack: (state, action: PayloadAction<any>) => ({
      ...state,
      curPreviewTrack: action.payload,
    }),
    setLikedTracks: (state, action: PayloadAction<any>) => ({
      ...state,
      likedTracks: action.payload,
    }),
  },
})

export const { setCurPlaylist, setCurTrack, setIsPlaying, setCurPreviewTrack, setLikedTracks } =
  music.actions
export default music.reducer
