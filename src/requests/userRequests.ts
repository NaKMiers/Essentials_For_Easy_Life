// [GET]: /user/get-swap-face-history
export const getUserSwapFaceHistoryApi = async () => {
  const res = await fetch(`/api/user/get-swap-face-history`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
