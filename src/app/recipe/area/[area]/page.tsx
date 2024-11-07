'use client'

import Divider from '@/components/Divider'
import RecipeCard from '@/components/recipe/RecipeCard'
import { getMealsByArea } from '@/requests'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'

function RecipeAreaPage({ params: { area } }: { params: { area: string } }) {
  const [meals, setMeals] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { meals } = await getMealsByArea(area)
        setMeals(meals || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMeals()
  }, [area])

  return (
    <div className="min-h-screen p-21">
      <Link
        href="/recipe"
        className="trans-200 group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold shadow-lg hover:text-primary"
      >
        <FaAngleLeft
          size={16}
          className="wiggle"
        />
        Back
      </Link>

      <Divider size={16} />

      <h1 className="text-center font-body text-4xl font-semibold tracking-widest text-secondary">
        {area} Cuisine
      </h1>

      <Divider size={16} />

      {loading ? (
        <div className="grid animate-pulse grid-cols-2 gap-21 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-white p-4 shadow-lg"
            >
              <div className="aspect-video w-full rounded-lg bg-slate-200" />
              <div className="mt-2 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-1 h-4 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-21 lg:grid-cols-4">
          {meals.map(meal => (
            <RecipeCard
              key={meal.idMeal}
              meal={meal}
            />
          ))}
        </div>
      )}

      <Divider size={50} />
    </div>
  )
}

export default RecipeAreaPage
