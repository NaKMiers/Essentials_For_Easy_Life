import { memo } from 'react'

interface HeadingProps {
  title: string
  noLine?: boolean
  space?: boolean
  className?: string
  align?: 'left' | 'center' | 'right'
}

function Heading({ title, noLine, space, align = 'center', className }: HeadingProps) {
  return (
    <div
      className={`relative max-w-1200 mx-auto ${noLine ? 'h-0' : 'h-0.5'} bg-white rounded-lg ${
        space ? 'w-[calc(100%_-_21_*_2px)]' : 'w-full'
      } ${className}`}
    >
      <h1
        className={`absolute top-1/2 ${
          align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } -translate-y-1/2 text-nowrap text-xs xs:text-xl sm:text-2xl font-semibold bg-white px-2 xs:px-4 py-1 rounded-lg text-center`}
      >
        {title}
      </h1>
    </div>
  )
}

export default memo(Heading)
