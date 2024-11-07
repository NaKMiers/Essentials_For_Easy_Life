// src/app/(recipe)/recipe/page.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import { getAreas, getCategories, getRandomMeal, searchMeals } from '@/requests'
import RecipeCard from '@/components/recipe/RecipeCard'
import RecipeSearch from '@/components/recipe/RecipeSearch'
import Divider from '@/components/Divider'
import Link from 'next/link'
import { FaAngleLeft } from 'react-icons/fa'
import Image from 'next/image'

function RecipePage() {
  const [randomMeal, setRandomMeal] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Get random meal
  useEffect(() => {
    const fetchRandomMeal = async () => {
      try {
        const { meals } = await getRandomMeal()
        setRandomMeal(meals[0])
      } catch (err) {
        console.error(err)
      }
    }
    fetchRandomMeal()
  }, [])

  // Get categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categories } = await getCategories()
        setCategories(categories)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  // Get areas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { meals } = await getAreas()
        setAreas(meals)
      } catch (err) {
        console.error(err)
      }
    }
    fetchAreas()
  }, [])

  // Handle search
  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const { meals } = await searchMeals(term)
      setSearchResults(meals || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen p-21">
      <Link
        href="/"
        className="trans-200 group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold shadow-lg hover:text-primary"
      >
        <FaAngleLeft
          size={16}
          className="wiggle"
        />
        Home
      </Link>

      <Divider size={16} />

      <h1 className="text-center font-body text-4xl font-semibold tracking-widest text-secondary">
        Recipe Finder
      </h1>

      <Divider size={16} />

      <RecipeSearch
        onSearch={handleSearch}
        loading={loading}
      />

      <Divider size={16} />

      {searchResults.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold">Search Results</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchResults.map(meal => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {randomMeal && (
            <>
              <h2 className="text-2xl font-semibold">Recipe of the Day</h2>
              <div className="mt-4">
                <RecipeCard
                  meal={randomMeal}
                  large
                />
              </div>
            </>
          )}

          <Divider size={32} />

          <h2 className="text-2xl font-semibold">Cuisines</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {areas.map(area => (
              <Link
                key={area.strArea}
                href={`/recipe/area/${area.strArea}`}
                className="trans-200 group overflow-hidden rounded-lg bg-white p-4 shadow-lg hover:-translate-y-1"
              >
                <Image
                  src={`/images/flags/${area.strArea.toLowerCase()}.png`}
                  alt={area.strArea}
                  width={200}
                  height={200}
                  className="trans-200 w-full rounded-lg group-hover:scale-110"
                />
                <h3 className="mt-2 text-center font-semibold">{area.strArea}</h3>
              </Link>
            ))}
          </div>

          <Divider size={32} />

          <h2 className="text-2xl font-semibold">Categories</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map(category => (
              <Link
                key={category.idCategory}
                href={`/recipe/category/${category.strCategory}`}
                className="trans-200 group overflow-hidden rounded-lg bg-white p-4 shadow-lg hover:-translate-y-1"
              >
                <Image
                  src={category.strCategoryThumb}
                  alt={category.strCategory}
                  width={200}
                  height={200}
                  className="trans-200 w-full rounded-lg group-hover:scale-110"
                />
                <h3 className="mt-2 text-center font-semibold">{category.strCategory}</h3>
              </Link>
            ))}
          </div>
        </>
      )}

      <Divider size={50} />
    </div>
  )
}

export default RecipePage