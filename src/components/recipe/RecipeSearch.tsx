// src/components/recipe/RecipeSearch.tsx
import { memo, useState } from 'react'
import { RiDonutChartFill } from 'react-icons/ri'

interface RecipeSearchProps {
  onSearch: (term: string) => void
  loading?: boolean
  className?: string
}

function RecipeSearch({ onSearch, loading, className = '' }: RecipeSearchProps) {
  const [term, setTerm] = useState('')

  return (
    <div className={`mx-auto max-w-2xl ${className}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="Search recipes..."
          className="w-full rounded-lg border px-4 py-2 outline-none focus:border-primary"
        />
        <button
          onClick={() => onSearch(term)}
          disabled={loading}
          className="trans-200 rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <RiDonutChartFill
              size={20}
              className="animate-spin"
            />
          ) : (
            'Search'
          )}
        </button>
      </div>
    </div>
  )
}

export default memo(RecipeSearch)