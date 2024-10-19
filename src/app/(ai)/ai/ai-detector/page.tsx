'use client'

import Divider from '@/components/Divider'
import { detectAIContentApi } from '@/requests'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleLeft } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

function AIDetectorPage() {
  // states
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)
  const [aiWords, setAIWords] = useState<number>(0)
  const [textWords, setTextWords] = useState<number>(0)
  const [fakePercentage, setFakePercentage] = useState<number>(0)
  const [isHuman, setIsHuman] = useState<number>(100)
  const [sentences, setSentences] = useState<string[]>([])

  // AI Content Detector
  const handleDetectAIContent = useCallback(async () => {
    if (!content) {
      toast.error('Content is required')
      return
    }

    // start loading
    setLoading(true)

    try {
      const { data } = await detectAIContentApi(content)

      const { aiWords, textWords, fakePercentage, isHuman, sentences } = data

      console.log(data)

      setResult(data)
      setAIWords(aiWords)
      setTextWords(textWords)
      setFakePercentage(fakePercentage)
      setIsHuman(isHuman)
      setSentences(sentences)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // end loading
      setLoading(false)
    }
  }, [content])

  return (
    <div className="mx-auto h-full min-h-screen w-full max-w-1200 px-21">
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

      <div className="grid grid-cols-12 gap-x-21 gap-y-10">
        <div
          className={`col-span-12 flex flex-col items-center gap-21 md:items-end ${result ? 'md:col-span-7' : ''}`}
        >
          <textarea
            className="w-full rounded-lg border-2 border-dark px-3 py-4 text-sm text-dark outline-none"
            rows={16}
            placeholder="Content..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <button
            className={`trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark ${loading ? 'pointer-events-none' : ''}`}
            onClick={handleDetectAIContent}
            disabled={loading}
          >
            {loading ? (
              <RiDonutChartFill
                size={20}
                className="animate-spin"
              />
            ) : (
              'Check'
            )}
          </button>
        </div>

        {result && (
          <div className="col-span-12 md:col-span-5">
            <p className="font-semibold">AI Words</p>
            <div className="flex items-center gap-2 font-body tracking-wider">
              <span className="flex-shrink-0">
                {aiWords}/{textWords}
              </span>
              <div className="relative h-4 w-full overflow-hidden rounded-md border-2 border-neutral-600">
                <div
                  className="absolute left-0 top-0 h-full w-full bg-rose-500"
                  style={{ width: `${(aiWords / textWords) * 100}%` }}
                />
              </div>
            </div>

            {sentences && sentences.length > 0 && (
              <>
                <p className="mt-4 font-semibold">Sentences From AI</p>
                <ul className="max-h-[200px] list-disc overflow-y-auto pl-4 font-body text-sm tracking-wider">
                  {sentences.map((sentence, index) => (
                    <li key={index}>{sentence}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-4 font-semibold">
              Fake: <span className="text-rose-500">{fakePercentage}%</span>
            </p>

            <p className="mt-4 font-semibold">
              This content is from{' '}
              <span className={isHuman ? 'text-green-500' : 'text-orange-500'}>
                {isHuman >= 50 ? 'Human' : 'AI'}
              </span>
            </p>

            <p className="mt-4 font-semibold">Feedback</p>
            <p className="font-body text-sm tracking-wider">{result.otherFeedback}</p>
          </div>
        )}
      </div>

      <Divider size={50} />
    </div>
  )
}

export default AIDetectorPage
