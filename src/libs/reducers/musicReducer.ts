import { genres } from '@/constants/music'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const music = createSlice({
  name: 'music',
  initialState: {
    // playlist
    playlists: [],
    curPlaylist: null,

    // track
    prevTracks: [],
    curTrack: null,
    nextTracks: [],
    isPlaying: false,

    // selection
    selectedTracks: [],

    // preview track
    curPreviewTrack: null,

    // liked tracks
    likedTracks: [],

    // genres
    selectedGenres: [...genres.slice(0, 2)],

    // sidebar
    openSidebar: false,
  },
  reducers: {
    // playlist
    setPlaylists: (state, action: PayloadAction<any>) => ({
      ...state,
      playlists: action.payload,
    }),
    setCurPlaylist: (state, action: PayloadAction<any>) => ({
      ...state,
      curPlaylist: action.payload,
    }),

    // track
    setPrevTracks: (state, action: PayloadAction<any>) => ({
      ...state,
      prevTracks: action.payload,
    }),
    setCurTrack: (state, action: PayloadAction<any>) => ({
      ...state,
      curTrack: action.payload,
    }),
    setNextTracks: (state, action: PayloadAction<any>) => ({
      ...state,
      nextTracks: action.payload,
    }),
    setIsPlaying: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPlaying: action.payload,
    }),

    // selection
    setSelectedTracks: (state, action: PayloadAction<any>) => ({
      ...state,
      selectedTracks: state.selectedTracks.some((track: any) => track.id === action.payload.id)
        ? state.selectedTracks.filter((track: any) => track.id !== action.payload.id)
        : ([...state.selectedTracks, action.payload] as any),
    }),
    clearSelectedTracks: (state, action: PayloadAction<any>) => ({
      ...state,
      selectedTracks: action.payload,
    }),

    // preview track
    setCurPreviewTrack: (state, action: PayloadAction<any>) => ({
      ...state,
      curPreviewTrack: action.payload,
    }),

    // liked tracks
    setLikedTracks: (state, action: PayloadAction<any>) => ({
      ...state,
      likedTracks: action.payload,
    }),

    // genres
    setSelectedGenres: (state, action: PayloadAction<any>) => ({
      ...state,
      selectedGenres: state.selectedGenres.some((genre: any) => genre === action.payload)
        ? state.selectedGenres.filter((genre: any) => genre !== action.payload)
        : ([...state.selectedGenres, action.payload] as any),
    }),
    clearSelectedGenres: (state, action: PayloadAction<any>) => ({
      ...state,
      selectedGenres: action.payload,
    }),

    // sidebar
    setOpenSidebar: (state, action: PayloadAction<boolean | undefined>) => ({
      ...state,
      openSidebar: action.payload || !state.openSidebar,
    }),
  },
})

export const {
  // playlist
  setPlaylists,
  setCurPlaylist,

  // track
  setPrevTracks,
  setCurTrack,
  setNextTracks,
  setIsPlaying,

  // selection
  setSelectedTracks,
  clearSelectedTracks,

  // preview track
  setCurPreviewTrack,

  // liked tracks
  setLikedTracks,

  // genres
  setSelectedGenres,
  clearSelectedGenres,

  // sidebar
  setOpenSidebar,
} = music.actions
export default music.reducer
