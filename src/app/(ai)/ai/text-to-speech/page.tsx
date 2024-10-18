'use client'

import Divider from '@/components/Divider'
import voices from '@/constants/voices'
import { textToSpeechApi } from '@/requests'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleLeft } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

function TextToSpeechPage() {
  // states
  const [selectedVoice, setSelectedVoice] = useState<any>(voices[37])
  const [audioPrompt, setAudioPrompt] = useState<string>('')
  const [audioResult, setAudioResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleTextToSpeech = useCallback(async () => {
    // start loading
    setLoading(true)

    try {
      const { audio } = await textToSpeechApi(audioPrompt, selectedVoice)

      setAudioResult(audio)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [audioPrompt, selectedVoice])

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
        Text to Speech
      </h1>

      <Divider size={16} />

      <div className="flex flex-col items-center gap-21">
        <div className="flex items-center gap-2">
          <select
            className="cursor-pointer rounded-lg border px-3 py-2 font-body text-sm font-semibold tracking-wider text-dark outline-none"
            onChange={e => setSelectedVoice(e.target.value)}
            value={selectedVoice.id}
          >
            {voices.map(voice => (
              <option
                value={voice.id}
                className="cursor-pointer"
                key={voice.id}
              >
                {voice.id} - {voice.voice} - {voice.voiceGender} - {voice.language} -{' '}
                {voice.languageDescription} - {voice.engine}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="w-full rounded-lg border-2 border-dark px-3 py-4 text-sm text-dark outline-none"
          rows={6}
          placeholder="Audio Prompt..."
          value={audioPrompt}
          onChange={e => setAudioPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          className={`trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark ${loading ? 'pointer-events-none' : ''}`}
          onClick={handleTextToSpeech}
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

      <Divider size={16} />

      {audioResult && (
        <>
          <p className="px-21 text-center font-body text-xl font-semibold tracking-widest">Your Audio</p>

          <Divider size={3} />

          {audioResult && (
            <div className="flex w-full items-center justify-center">
              <audio
                className="w-full max-w-[500px]"
                src={audioResult}
                controls
              />
            </div>
          )}
        </>
      )}

      <Divider size={50} />
    </div>
  )
}

export default TextToSpeechPage
