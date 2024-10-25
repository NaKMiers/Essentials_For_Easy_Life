// [GET]: /user/swap-face-history
export const getUserSwapFaceHistoryApi = async (
  query: string = '',
  option: any = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/user/swap-face-history${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /user/favorite-movie
export const getUserFavoriteMoviesApi = async (
  query: string = '',
  option: any = { next: { revalidate: 0 } }
) => {
  const res = await fetch(`/api/user/favorite-movie${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /admin/user/all
export const getAllUsersApi = async (
  query: string = '',
  option: RequestInit = { cache: 'no-store' }
) => {
  // no-store to bypass cache
  const res = await fetch(`/api/admin/user/all${query}`, option)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /user/swap-face-history/delete
export const deleteSwapFaceHistoryApi = async (ids: string[]) => {
  const res = await fetch(`/api/user/swap-face-history/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /admin/user/delete
export const deleteUsersApi = async (ids: string[]) => {
  const res = await fetch('/api/admin/user/delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
