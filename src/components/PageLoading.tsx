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
      } fixed z-[60] w-screen h-screen top-0 left-0 right-0 bottom-0`}
    >
      <ThemeProvider theme={theme}>
        <div className='w-full'>
          <LinearProgress className='bg-yellow-50 h-[3px]' />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default memo(PageLoading)
