import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import NextTopLoader from 'nextjs-toploader'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import authOptions from './api/auth/[...nextauth]/authOptions'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Essentials For Easy Life',
  description: '',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='vi'>
      <body suppressHydrationWarning={true}>
        <StoreProvider session={session}>
          {/* Toast */}
          <Toaster
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />

          {/* Top Loader */}
          <NextTopLoader
            color='#F7E360'
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing='ease'
            speed={200}
            shadow='0 0 10px #F7E360,0 0 5px #F7E360'
            zIndex={1600}
            showAtBottom={false}
          />

          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
