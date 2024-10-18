import Background from '@/components/backgrounds/Background'
import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import PageLoading from '@/components/PageLoading'
import Script from 'next/script'
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

      {/* Load Google Maps JavaScript API with Places Library */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}&libraries=places`}
        strategy="beforeInteractive"
      />

      {/* Main */}
      <main className="mt-[60px]">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  )
}
