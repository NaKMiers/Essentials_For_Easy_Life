import Divider from '@/components/Divider'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Essentials For Easy Life',
  description: '',
}

async function Home() {
  return (
    <div className='max-w-1200 mx-auto min-h-screen w-full h-full'>
      <Divider size={10} />

      <h1 className='text-4xl text-center '>Essentials For Easy Life</h1>

      <Divider size={10} />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-21 text-dark font-semibold text-xl'>
        <Link
          href='/ai-image'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          AI IMAGE
        </Link>
        <Link
          href='/news'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          NEWS
        </Link>
        <Link
          href='/location'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          LOCATION
        </Link>
        <Link
          href='/spotify'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          SPOTIFY
        </Link>
        <Link
          href='/netflix'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          NETFLIX
        </Link>
        <Link
          href='/recipe'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          RECIPE
        </Link>
        <Link
          href='/temp-mail'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          TEMP MAIL
        </Link>
        <Link
          href='/'
          className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'
        >
          ...
        </Link>
      </div>

      <Divider size={10} />
    </div>
  )
}

export default Home
