// [GET]: /user/swap-face-history
export const getUserSwapFaceHistoryApi = async () => {
  const res = await fetch(`/api/user/swap-face-history`, { next: { revalidate: 0 } })

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
