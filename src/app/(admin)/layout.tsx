import AdminMenu from '@/components/admin/AdminMenu'
import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import PageLoading from '@/components/PageLoading'
import '../globals.scss'
import Divider from '@/components/Divider'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Menu */}
      <AdminMenu />

      {/* Loading */}
      <PageLoading />

      {/* Main */}
      <main className="mt-[60px] bg-neutral-700 p-21">
        <div className="mx-auto w-full max-w-1200">{children}</div>

        <Divider size={50} />
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
