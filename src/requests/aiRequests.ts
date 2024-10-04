// [POST]: /ai/swap-face
export const swapFaceApi = async (target: string, swap: string) => {
  const res = await fetch(`/api/ai/swap-face`, {
    method: 'POST',
    body: JSON.stringify({ target, swap }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /ai/swap-face/get-result
export const getSwapFaceResultApi = async (requestId: string) => {
  const res = await fetch('/api/ai/swap-face/get-result', {
    method: 'POST',
    body: JSON.stringify({ requestId }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /ai/detect-ai-content
export const detectAIContentApi = async (content: string) => {
  const res = await fetch('/api/ai/detect-ai-content', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /ai/generate-image
export const generateImageApi = async ({
  prompt,
  size = '1024x1024',
  styles = 201,
}: {
  prompt: string
  size: '768x768' | '768x1024' | '1024x768' | '1024x1024'
  styles: number
}) => {
  const res = await fetch('/api/ai/generate-image', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      size,
      styles,
    }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /ai/text-to-speech
export const textToSpeechApi = async (prompt: string, voice: any) => {
  const res = await fetch('/api/ai/text-to-speech', {
    method: 'POST',
    body: JSON.stringify({ prompt, voice }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
