import Link from 'next/link'
import { memo } from 'react'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'

interface AdminHeaderProps {
  title: string
  addLink?: string
  backLink?: string
  className?: string
}

function AdminHeader({ title, addLink, backLink, className = '' }: AdminHeaderProps) {
  return (
    <div className={`mb-3 flex flex-wrap items-end justify-center gap-3 text-sm ${className}`}>
      <div className="rounded-lg border border-slate-300 px-3 py-2 text-center text-lg text-light">
        {title}
      </div>

      {backLink && (
        <Link
          href={backLink}
          className="trans-200 flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-2 text-dark hover:bg-yellow-300 hover:text-secondary"
        >
          <FaArrowLeft />
          Back
        </Link>
      )}

      {addLink && (
        <Link
          href={addLink}
          className="trans-200 flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-2 text-dark hover:bg-yellow-300 hover:text-secondary"
        >
          <FaPlus />
          Add
        </Link>
      )}
    </div>
  )
}

export default memo(AdminHeader)
