'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { LuLoader2 } from 'react-icons/lu'

function AIImagePage() {
  const [targetFile, setTargetFile] = useState<File | undefined>(undefined)
  const [swapFile, setSwapFile] = useState<File | undefined>(undefined)
  const [resultImage, setResultImage] = useState<string | undefined>('/backgrounds/background.jpg')
  const [loading, setLoading] = useState(false)

  // swap faces
  const handleSwapFace = useCallback(async () => {
    // start loading
    setLoading(true)

    try {
      if (!targetFile || !swapFile) {
        toast.error('Please select target file and swap file')
        return
      }

      const formData = new FormData()
      formData.append('target', targetFile)
      formData.append('swap', swapFile)

      const res = await fetch('/api/swap-face', {
        method: 'POST',
        body: formData,
      })

      let data = await res.json()
      data = data.data

      if (data.image_process_response && data.image_process_response.status === 'OK') {
        setResultImage(data.image_process_response.result_url)
        console.log(data.image_process_response.result_url)
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [targetFile, swapFile])

  return (
    <div className='max-w-1200 mx-auto min-h-screen w-full h-full'>
      <div className='h-screen flex flex-col items-center justify-center gap-4'>
        {resultImage && (
          <div className='rounded-lg border-light border-2 max-w-[300px]'>
            <Image src={resultImage} width={500} height={500} alt='result' />
          </div>
        )}

        <input
          className='rounded-lg border-2 border-light p-2'
          type='file'
          accept='image/*'
          onChange={e => setTargetFile(e.target.files?.[0])}
        />
        <input
          className='rounded-lg border-2 border-light p-2'
          type='file'
          accept='image/*'
          onChange={e => setSwapFile(e.target.files?.[0])}
        />

        <button
          className='rounded-lg shadow-lg min-h-10 min-w-20 flex items-center justify-center bg-dark-0 text-light border-2 border-light px-2 py-2 font-semibold hover:bg-white hover:text-dark trans-200'
          onClick={handleSwapFace}
          disabled={loading}
        >
          {loading ? <LuLoader2 size={20} className='text-slate-400 animate-spin' /> : 'Swap Face'}
        </button>
      </div>
    </div>
  )
}

export default AIImagePage
