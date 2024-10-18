'use client'

import { useAppSelector } from '@/libs/hooks'
import { createTheme, LinearProgress, ThemeProvider } from '@mui/material'
import { memo } from 'react'

function PageLoading() {
  // hooks
  const isPageLoading = useAppSelector(state => state.modal.isPageLoading)

  const theme = createTheme({
    components: {
      MuiLinearProgress: {
        styleOverrides: {
          bar: {
            backgroundColor: '#F7E360',
          },
        },
      },
    },
  })

  return (
    <div
      className={`${
        isPageLoading ? 'flex' : 'hidden'
      } fixed bottom-0 left-0 right-0 top-0 z-[100] h-screen w-screen`}
    >
      <ThemeProvider theme={theme}>
        <div className="w-full">
          <LinearProgress className="h-[3px] bg-yellow-50" />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default memo(PageLoading)
