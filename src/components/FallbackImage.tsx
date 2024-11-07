import Image from 'next/image'
import { memo, useState } from 'react'

function FallbackImage({ src, alt, fallbackSrc = '/images/default-image.png', ...props }: any) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}

export default memo(FallbackImage)
