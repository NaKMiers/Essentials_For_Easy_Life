import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const music = createSlice({
  name: 'music',
  initialState: {
    // user
    spotifyUser: null,

    // playlist
    playlists: [],
    curPlaylist: null,

    // track
    prevTracks: [],
    curTrack: null,
    nextTracks: [],
    isPlaying: false,

    // preview track
    curPreviewTrack: null,

    // liked tracks
    likedTracks: [],

    // sidebar
    openSidebar: false,
  },
  reducers: {
    // user
    setSpotifyUser: (state, action: PayloadAction<any>) => ({
      ...state,
      spotifyUser: action.payload,
    }),

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

    // sidebar
    setOpenSidebar: (state, action: PayloadAction<boolean | undefined>) => ({
      ...state,
      openSidebar: action.payload || !state.openSidebar,
    }),
  },
})

export const {
  // user
  setSpotifyUser,

  // playlist
  setPlaylists,
  setCurPlaylist,

  // track
  setPrevTracks,
  setCurTrack,
  setNextTracks,
  setIsPlaying,

  // preview track
  setCurPreviewTrack,

  // liked tracks
  setLikedTracks,

  // sidebar
  setOpenSidebar,
} = music.actions
export default music.reducer
