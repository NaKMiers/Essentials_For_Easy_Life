const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const getRandomMeal = async () => {
  const res = await fetch(`${BASE_URL}/random.php`);
  return res.json();
};

export const getMealById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  return res.json();
};

export const getMealsByCategory = async (category: string) => {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  return res.json();
};

export const getMealsByArea = async (area: string) => {
  const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
  return res.json();
};

export const searchMeals = async (term: string) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${term}`);
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories.php`);
  return res.json();
};

export const getAreas = async () => {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  return res.json();
};