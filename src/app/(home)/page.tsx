import Divider from '@/components/Divider'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Essentials For Easy Life',
  description: '',
}

async function Home() {
  return (
    <div className='mx-auto h-full min-h-screen w-full max-w-1200'>
      <Divider size={10} />

      <h1 className='text-center text-4xl'>Essentials For Easy Life</h1>

      <Divider size={10} />

      <div className='grid grid-cols-1 gap-21 text-xl font-semibold text-dark sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <Link
          href='/ai'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          AI IMAGE
        </Link>
        <Link
          href='/news'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          NEWS
        </Link>
        <Link
          href='/location'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          LOCATION
        </Link>
        <Link
          href='/spotify'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          SPOTIFY
        </Link>
        <Link
          href='/netflix'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          NETFLIX
        </Link>
        <Link
          href='/recipe'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          RECIPE
        </Link>
        <Link
          href='/temp-mail'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          TEMP MAIL
        </Link>
        <Link
          href='/'
          className='flex aspect-square w-full items-center justify-center rounded-lg border-2 border-light bg-gradient-to-b from-slate-200 via-green-200 to-sky-400 p-21 shadow-lg'
        >
          ...
        </Link>
      </div>

      <Divider size={10} />
    </div>
  )
}

export default Home
