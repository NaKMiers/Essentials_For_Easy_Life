import Divider from '@/components/Divider'
import { navItems } from '@/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Essentials For Easy Life',
  description: '',
}

async function Home() {
  return (
    <div className="mx-auto h-full min-h-screen w-full max-w-1200">
      <Divider size={16} />

      <h1 className="px-21 text-center font-body text-4xl font-semibold tracking-widest text-secondary">
        Essentials For Easy Life
      </h1>

      <Divider size={10} />

      <div className="flex flex-wrap text-xl font-semibold text-dark">
        {navItems.map(link => (
          <div
            className="w-full p-21/2 xs:w-1/2 md:w-1/4 md:p-6 lg:p-8"
            key={link.href}
          >
            <Link
              href={link.href}
              className="group flex aspect-square w-full flex-col items-center justify-center gap-8 rounded-3xl bg-white p-8 shadow-lg"
            >
              <div className="trans-300 group-hover:scale-90">
                <Image
                  className="h-full w-full object-contain"
                  src={link.image}
                  width={200}
                  height={200}
                  alt={link.title}
                />
              </div>

              <h2 className="trans-200 text-center font-body text-lg font-semibold tracking-wider text-secondary group-hover:text-primary md:text-2xl">
                {link.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>

      <Divider size={10} />
    </div>
  )
}

export default Home
