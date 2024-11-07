'use client'

import Divider from '@/components/Divider'
import { getMealById } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'

function RecipeDetailPage({ params: { id } }: { params: { id: string } }) {
  const [meal, setMeal] = useState<any>(null)

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { meals } = await getMealById(id)
        setMeal(meals[0])
      } catch (err) {
        console.error(err)
      }
    }
    fetchMeal()
  }, [id])

  if (!meal) return null

  // Get ingredients
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`)
    }
  }

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

      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-lg">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            width={1200}
            height={800}
            className="w-full"
          />
        </div>

        <Divider size={8} />

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold">{meal.strMeal}</h1>
          <p className="mt-2 text-gray-500">
            {meal.strCategory} • {meal.strArea}
          </p>

          <Divider size={4} />

          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="mt-2 list-inside list-disc">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <Divider size={4} />

          <h2 className="text-xl font-semibold">Instructions</h2>
          <p className="mt-2 whitespace-pre-line">{meal.strInstructions}</p>

          {meal.strYoutube && (
            <>
              <Divider size={4} />
              <h2 className="text-xl font-semibold">Video Tutorial</h2>
              <div className="mt-2 aspect-video">
                <iframe
                  className="h-full w-full rounded-lg"
                  src={`https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}`}
                  allowFullScreen
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Divider size={50} />
    </div>
  )
}

export default RecipeDetailPage