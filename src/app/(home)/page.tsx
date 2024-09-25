import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Essentials For Easy Life',
  description: '',
}

async function Home() {
  return (
    <div className='min-h-screen flex items-center justify-center w-full h-full'>
      <h1 className='text-4xl'>Essentials For Easy Life</h1>
    </div>
  )
}

export default Home
