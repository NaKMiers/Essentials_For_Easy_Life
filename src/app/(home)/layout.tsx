import Header from '@/components/layouts/Header'
import PageLoading from '@/components/PageLoading'
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

      {/* Main */}
      <main className="bg-neutral-800 text-light">{children}</main>

      {/* Footer */}
      {/* <Footer /> */}
    </>
  )
}
