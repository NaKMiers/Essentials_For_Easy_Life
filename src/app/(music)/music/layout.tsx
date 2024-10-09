import PageLoading from '@/components/PageLoading'
import Player from '@/components/music/Player'
import Sidebar from '@/components/music/Sidebar'
import { ReactNode } from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      {/* Loading */}
      <PageLoading />

      {/* Main */}
      <div className="flex h-screen w-full flex-col overflow-hidden bg-neutral-950 text-light">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="max-w-[250px]" />
          {children}
        </div>

        <div className="flex-shrink-0">
          <Player />
        </div>
      </div>
    </>
  )
}
