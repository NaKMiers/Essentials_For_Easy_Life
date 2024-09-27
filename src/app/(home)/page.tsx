import Divider from '@/components/Divider'
import SendButton from '@/components/SendButton'
import { Metadata } from 'next'

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

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-21'>
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400'>
          <SendButton />
        </div>
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
        <div className='flex items-center justify-center rounded-lg shadow-lg p-21 border-2 border-light aspect-square w-full bg-gradient-to-b from-slate-200 via-green-200 to-sky-400' />
      </div>

      <Divider size={10} />
    </div>
  )
}

export default Home
