const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json()
}

// [GET]: /file/get-user-files
export const getUserFilesApi = async () => {
  const res = await fetch(`/api/file/get-user-files`)

  return handleResponse(res)
}

// [POST]: /file/upload
export const uploadFilesApi = async (data: FormData) => {
  const res = await fetch(`/api/file/upload`, {
    method: 'POST',
    body: data,
  })

  return handleResponse(res)
}

// [DELETE]: /file/delete
export const deleteFilesApi = async (ids: string[]) => {
  const res = await fetch(`/api/file/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  return handleResponse(res)
}
