// [GET]: /file/get-user-files
export const getUserFilesApi = async () => {
  const res = await fetch(`/api/file/get-user-files`)

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /file/upload
export const uploadFilesApi = async (data: FormData) => {
  const res = await fetch(`/api/file/upload`, {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /file/delete
export const deleteFilesApi = async (ids: string[]) => {
  const res = await fetch(`/api/file/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
