import Background from '@/components/backgrounds/Background'
import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import PageLoading from '@/components/PageLoading'
import UseMovie from '@/libs/hooks/useMovie'
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

      {/* Header */}
      <Header />

      <Background />

      <UseMovie />

      {/* Main */}
      <main className="">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  )
}
