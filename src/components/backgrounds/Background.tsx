import Image from 'next/image'
import { memo } from 'react'

function Background() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 -z-10 flex h-screen w-screen items-center justify-center">
      <div className="absolute bottom-0 left-0 w-full">
        <Image
          className="h-full w-full object-cover"
          src="/images/vector-2.png"
          width={2000}
          height={2000}
          alt="vector-1"
        />
      </div>

      <div className="absolute left-0 top-[60px] h-full w-full">
        <Image
          className="h-full w-full object-cover"
          src="/images/vector-1.png"
          width={2000}
          height={2000}
          alt="vector-1"
        />
      </div>
    </div>
  )
}

export default memo(Background)
