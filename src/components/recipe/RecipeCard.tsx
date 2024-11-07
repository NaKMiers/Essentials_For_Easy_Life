import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

interface RecipeCardProps {
  meal: any
  large?: boolean
  className?: string
}

function RecipeCard({ meal, large, className = '' }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${meal.idMeal}`}
      className={`trans-200 group block overflow-hidden rounded-lg bg-white shadow-lg hover:-translate-y-1 ${
        large ? 'p-21' : 'p-4'
      } ${className}`}
    >
      <div className="overflow-hidden rounded-lg">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          width={500}
          height={500}
          className="trans-200 w-full group-hover:scale-110"
        />
      </div>
      <h3 className={`mt-2 font-semibold ${large ? 'text-lg' : 'text-base'}`}>{meal.strMeal}</h3>
      {meal.strCategory && (
        <p className="mt-1 text-sm text-gray-500">
          {meal.strCategory} • {meal.strArea}
        </p>
      )}
    </Link>
  )
}

export default memo(RecipeCard)
