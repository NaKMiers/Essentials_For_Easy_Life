'use client'

import { memo, useCallback, useState } from 'react'

function SendButton() {
  const [targetFile, setTargetFile] = useState<File | undefined>(undefined)
  const [swapFile, setSwapFile] = useState<File | undefined>(undefined)

  const handleSend = useCallback(async () => {
    if (!targetFile || !swapFile) return

    try {
      const formData = new FormData()
      formData.append('target', targetFile)
      formData.append('swap', swapFile)

      const res = await fetch('/api/swap-face', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }, [targetFile, swapFile])

  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <input
        className='flex items-center w-full text-dark'
        type='file'
        accept='image/*'
        onChange={e => {
          const file = e.target.files?.[0]
          console.log(file)

          setTargetFile(file)
        }}
      />

      <input
        className='flex items-center w-full text-dark'
        type='file'
        accept='image/*'
        onChange={e => {
          const file = e.target.files?.[0]
          console.log(file)

          setSwapFile(file)
        }}
      />

      <button
        className='rounded-lg shadow-lg border-2 border-dark px-3 py-2 text-dark hover:bg-dark-100 hover:text-light trans-300'
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  )
}

export default memo(SendButton)
