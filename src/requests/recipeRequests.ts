const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}

export const getRandomMeal = async () => {
  const res = await fetch(`${BASE_URL}/random.php`)

  return handleResponse(res)
}

export const getMealById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)

  return handleResponse(res)
}

export const getMealsByCategory = async (category: string) => {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`)

  return handleResponse(res)
}

export const getMealsByArea = async (area: string) => {
  const res = await fetch(`${BASE_URL}/filter.php?a=${area}`)

  return handleResponse(res)
}

export const searchMeals = async (term: string) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${term}`)

  return handleResponse(res)
}

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories.php`)

  return handleResponse(res)
}

export const getAreas = async () => {
  const res = await fetch(`${BASE_URL}/list.php?a=list`)

  return handleResponse(res)
}
