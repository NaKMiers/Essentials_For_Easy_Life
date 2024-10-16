import PageLoading from '@/components/PageLoading'
import MusicMenu from '@/components/music/MusicMenu'
import Player from '@/components/music/Player'
import Sidebar from '@/components/music/Sidebar'
import Script from 'next/script'
import { ReactNode } from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" />

      {/* Loading */}
      <PageLoading />

      {/* Main */}
      <main className="flex h-screen w-full flex-col overflow-hidden bg-neutral-950 text-light">
        <div className="flex h-full w-full overflow-hidden">
          {/* Center */}
          <div className="w-full p-2 pb-0 text-dark md:w-[calc(100%-250px)]">
            <div className="no-scrollbar relative h-full w-full overflow-y-auto rounded-3xl bg-neutral-200">
              {/* Menu */}
              <MusicMenu />

              {children}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar className="max-w-[250px] flex-shrink-0" />
        </div>

        <div className="relative z-30 flex flex-shrink-0 items-center">
          <Player />
        </div>
      </main>
    </>
  )
}
