'use client'

import { Children, memo, MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface GroupCoursesProps {
  className?: string
  classChild?: string
  indicatorClass?: string[]
  children: ReactNode
}

function Group({
  className = '',
  classChild = '',
  indicatorClass = ['', ''],
  children,
}: GroupCoursesProps) {
  // states
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isMedium, setIsMedium] = useState<boolean>(false)

  // ref
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // MARK: Handlers

  // prev slide
  const prevSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft - slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // next slide
  const nextSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft + slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // expanded group
  useEffect(() => {
    const handleResize = () => {
      setIsMedium(window.innerWidth >= 768)
    }
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* MARK: Next - Previous */}
      {!isExpanded && (
        <>
          <button
            className={`trans-200 group absolute -left-21 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary bg-opacity-80 shadow-md hover:bg-opacity-100 ${indicatorClass[0]}`}
            onClick={prevSlide}
          >
            <FaChevronLeft
              size={18}
              className="wiggle text-dark"
            />
          </button>
          <button
            className={`trans-200 group absolute -right-21 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary bg-opacity-80 shadow-md hover:bg-opacity-100 ${indicatorClass[1]}`}
            onClick={nextSlide}
          >
            <FaChevronRight
              size={18}
              className="wiggle text-dark"
            />
          </button>
        </>
      )}

      {/* MARK: Slider */}
      <div className="flex flex-wrap">
        <div
          className={`flex ${isExpanded ? 'flex-wrap gap-y-21' : ''} no-scrollbar w-full snap-x snap-mandatory overflow-x-auto py-21`}
          ref={slideTrackRef}
        >
          {Children.toArray(children).map((child, index) => (
            <div
              key={index}
              className={`relative h-full flex-shrink-0 snap-start px-21/2 ${classChild}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(Group)
