'use client'

import Divider from '@/components/Divider'
import { generateImageApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleLeft } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

const styleList = [
  { value: 101, label: 'Art painting Wash painting' },
  { value: 102, label: 'Conceptual art' },
  { value: 103, label: 'Oil Painting 1' },
  { value: 104, label: 'watercolour' },
  { value: 105, label: 'Pixel art' },
  { value: 106, label: 'Thick paint style' },
  { value: 107, label: 'inset' },
  { value: 108, label: 'Paper-cut style' },
  { value: 109, label: 'Impressionism 1 (Monet' },
  { value: 110, label: '2.5 D' },
  { value: 111, label: 'Classical portrait' },
  { value: 112, label: 'Black and white sketch' },
  { value: 113, label: 'cyberpunk' },
  { value: 114, label: 'Sci-fi style' },
  { value: 115, label: 'Dark style' },
  { value: 116, label: '3D' },
  { value: 118, label: 'Oil Painting 2 (Van Gogh' },
  { value: 119, label: 'Impressionism 2' },
  { value: 117, label: 'Steam wave' },
  { value: 201, label: 'Games and animation Japanese anime' },
  { value: 202, label: 'Monster style' },
  { value: 203, label: 'Beautiful and ancient' },
  { value: 204, label: 'Retro animation' },
  { value: 301, label: 'Game cartoon drawing' },
  { value: 401, label: 'Professional realism Universal realistic style' },
]

const sizeList = [
  { value: '256x256', label: '256x256' },
  { value: '512x512', label: '512x512' },
  { value: '1024x1024', label: '1024x1024' },
]

function ImageGenerationPage() {
  // states
  const [prompt, setPrompt] = useState<string>('')
  const [styles, setStyles] = useState<number>(201)
  const [size, setSize] = useState<'256x256' | '512x512' | '1024x1024'>('1024x1024')
  const [aiImageResult, setAiImageResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleGenerateImage = useCallback(async () => {
    // validate
    if (!prompt) {
      toast.error('Prompt is required')
      return
    }

    // start loading
    setLoading(true)

    try {
      const { image } = await generateImageApi({ prompt, styles, size })
      setAiImageResult(image)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [prompt, size, styles])

  return (
    <div className="mx-auto h-full min-h-screen w-full max-w-1200">
      <Link
        href="/ai"
        className="trans-200 group ml-21 mt-21 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold shadow-lg hover:text-primary"
      >
        <FaAngleLeft
          size={16}
          className="wiggle"
        />
        AI
      </Link>

      <Divider size={2} />

      <h1 className="px-21 text-center font-body text-4xl font-semibold tracking-widest text-secondary">
        Image Generation
      </h1>

      <Divider size={16} />

      <div className="flex flex-col items-center gap-4 p-21">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <select
            className="cursor-pointer rounded-lg border px-3 py-2 font-body text-sm font-semibold tracking-wider text-dark outline-none"
            value={styles}
            onChange={e => setStyles(Number(e.target.value))}
          >
            {styleList.map((style: any) => (
              <option
                key={style.value}
                value={style.value}
                className="cursor-pointer"
              >
                {style.label}
              </option>
            ))}
          </select>

          <select
            className="cursor-pointer rounded-lg border px-3 py-2 font-body text-sm font-semibold tracking-wider text-secondary outline-none"
            value={size}
            onChange={e => setSize(e.target.value as any)}
          >
            {sizeList.map((size: any) => (
              <option
                key={size.value}
                value={size.value}
                className="cursor-pointer"
              >
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full max-w-[500px] items-center overflow-hidden rounded-3xl border-2 border-dark">
          <input
            className="w-full px-4 py-3 font-body font-semibold tracking-wider text-slate-500 outline-none"
            placeholder="Prompt..."
            type="text"
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
          />

          <button
            className={`trans-200 mr-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-dark-0 px-3 font-semibold text-light hover:bg-primary ${loading ? 'pointer-events-none' : ''}`}
            onClick={handleGenerateImage}
            disabled={loading}
          >
            {loading ? (
              <RiDonutChartFill
                size={20}
                className="animate-spin"
              />
            ) : (
              'Go'
            )}
          </button>
        </div>
      </div>

      <Divider size={16} />

      <p className="px-21 text-center font-body text-xl font-semibold tracking-widest">Your Images</p>

      <Divider size={3} />

      {aiImageResult && (
        <div className="flex w-full justify-center">
          <div className="max-w-[500px] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={aiImageResult}
              width={1024}
              height={1024}
              alt="ai-generated-image"
            />
          </div>
        </div>
      )}

      <Divider size={50} />
    </div>
  )
}

export default ImageGenerationPage
