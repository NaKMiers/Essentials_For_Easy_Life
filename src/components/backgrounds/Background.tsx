import Image from 'next/image'
import { memo } from 'react'

function Background() {
  return (
    <div className='fixed -z-10 top-0 left-0 bottom-0 right-0 w-screen h-screen flex items-center justify-center bg-gradient-radial from-blue-950 to-neutral-950'>
      <div className='hidden lg:block absolute top-[-55%] left-[-25%] w-[70%]'>
        <Image
          className='w-full h-full object-contain object-left-top opacity-20'
          src='/backgrounds/glow-1.png'
          width={1000}
          height={1000}
          alt='Mona-Edu-Glow-1'
        />
      </div>

      <div className='hidden lg:block absolute bottom-[-90%] left-[-20%] w-[75%]'>
        <Image
          className='w-full h-full object-contain object-left-top opacity-10'
          src='/backgrounds/glow-2.png'
          width={1000}
          height={1000}
          alt='Mona-Edu-Glow-2'
        />
      </div>

      <div className='hidden lg:block absolute top-[-60%] right-[-30%] w-[80%]'>
        <Image
          className='w-full h-full object-contain object-left-top opacity-10'
          src='/backgrounds/glow-3.png'
          width={1000}
          height={1000}
          alt='Mona-Edu-Glow-3'
        />
      </div>

      <div className='h-[50rem] w-full bg-grid-white/[0.05] relative flex items-center justify-center'>
        <div className='absolute pointer-events-none inset-0 flex items-center justify-center bg-black/[0.3] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
        <p className='text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8'>
          Mona Edu
        </p>
      </div>
    </div>
  )
}

export default memo(Background)
