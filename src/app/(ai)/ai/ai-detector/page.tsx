'use client'

import Divider from '@/components/Divider'
import { detectAIContentApi } from '@/requests'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleLeft } from 'react-icons/fa'

function AIDetectorPage() {
  // states
  const [content, setContent] = useState<string>('')
  const [detectResult, setDetectResult] = useState<any>(null)

  // AI Content Detector
  const handleDetectAIContent = useCallback(async () => {
    try {
      const data = await detectAIContentApi(content)

      console.log(data)

      setDetectResult(data.data)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [content])

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
        AI Detector
      </h1>

      <Divider size={16} />

      <div className="grid grid-cols-12">
        <div className="col-span-12 flex flex-col items-end gap-21 md:col-span-7">
          <textarea
            className="w-full rounded-lg border-2 border-dark px-3 py-4 text-sm text-dark outline-none"
            rows={16}
            placeholder="Content..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button
            className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
            onClick={handleDetectAIContent}
          >
            Submit
          </button>
        </div>

        <div className="col-span-12 md:col-span-5">
          {/* {detectResult && (
            <div className="mt-2 flex flex-col gap-1">
              <p>Fake: {detectResult.fakePercentage}%</p>
              <p>
                AI Words: {detectResult.aiWords}/{detectResult.textWords}
              </p>
              <p>This content from: {detectResult.isHuman === 0 ? 'AI' : 'human'}</p>

              <p>Sentences from AI</p>
              <ul className="list-decimal text-sm">
                {detectResult.sentences.map((sentence: string, index: number) => (
                  <li key={index}>{sentence}</li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default AIDetectorPage
