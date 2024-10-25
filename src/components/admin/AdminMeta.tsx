import React, { Children, memo, useEffect } from 'react'
import { BiReset } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'

interface AdminMetaProps {
  children: React.ReactNode
  handleFilter: () => void
  handleResetFilter: () => void
  className?: string
}

function AdminMeta({ handleFilter, handleResetFilter, className = '', children }: AdminMetaProps) {
  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + F (Filter)
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        handleFilter()
      }

      // Alt + R (Reset)
      if (e.altKey && e.key === 'r') {
        e.preventDefault()
        handleResetFilter()
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter])

  return (
    <div
      className={`trans-300 no-scrollbar mt-8 w-full max-w-full self-end overflow-auto rounded-medium bg-white p-21 text-dark shadow-md ${className}`}
    >
      <div className="grid grid-cols-12 gap-21">
        {/* MARK: children 1 -> n - 1 */}
        {Children.toArray(children).slice(0, -1)}

        {/* MARK: Filter Buttons */}
        <div className="col-span-12 flex items-center justify-end gap-2 md:col-span-4">
          {/* Filter Button */}
          <button
            className="trans-200 group flex cursor-pointer items-center text-nowrap rounded-md bg-primary px-3 py-2 text-[16px] font-semibold text-light hover:bg-secondary"
            title="Alt + Enter"
            onClick={handleFilter}
          >
            Filter
            <FaFilter
              size={14}
              className="wiggle ml-[6px]"
            />
          </button>

          {/* Reset Button */}
          <button
            className="trans-200 group flex cursor-pointer items-center text-nowrap rounded-md bg-slate-600 px-3 py-2 text-[16px] font-semibold text-light hover:bg-slate-800"
            title="Alt + R"
            onClick={handleResetFilter}
          >
            Reset
            <BiReset
              size={22}
              className="wiggle ml-1"
            />
          </button>
        </div>

        {/* MARK: children n */}
        {Children.toArray(children).slice(-1)}
      </div>
    </div>
  )
}

export default memo(AdminMeta)
