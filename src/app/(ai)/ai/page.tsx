'use client'

import Divider from '@/components/Divider'
import voices from '@/constants/voices'
import { IFile } from '@/models/FileModel'
import {
  deleteFilesApi,
  detectAIContentApi,
  generateImageApi,
  getSwapFaceResultApi,
  getUserFilesApi,
  getUserSwapFaceHistoryApi,
  swapFaceApi,
  textToSpeechApi,
  uploadFilesApi,
} from '@/requests'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAngleLeft, FaTrash } from 'react-icons/fa'
import { navItems } from '@/constants'
import Link from 'next/link'

function AIPage() {
  const [selectedVoice, setSelectedVoice] = useState<any>(voices[37])
  const [audioPrompt, setAudioPrompt] = useState<string>('')
  const [audioResult, setAudioResult] = useState<string>('')

  const handleTextToSpeech = useCallback(async () => {
    try {
      const { audio } = await textToSpeechApi(audioPrompt, selectedVoice)

      setAudioResult(audio)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [audioPrompt, selectedVoice])

  return (
    <div className="mx-auto h-full min-h-screen w-full max-w-1200">
      <Link
        href="/"
        className="trans-200 group ml-21 mt-21 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold shadow-lg hover:text-primary"
      >
        <FaAngleLeft
          size={16}
          className="wiggle"
        />
        Home
      </Link>

      <Divider size={16} />

      <h1 className="px-21 text-center font-body text-4xl font-semibold tracking-widest text-secondary">
        Artificial Intelligence
      </h1>

      <div className="flex flex-wrap items-center text-xl font-semibold text-dark">
        {navItems[0]?.items?.map(link => (
          <div
            className="w-full p-21/2 xs:w-1/2 md:w-1/4 md:p-6 lg:p-8"
            key={link.href}
          >
            <Link
              href={link.href}
              className="group flex aspect-square w-full flex-col items-center justify-center gap-8 rounded-3xl bg-white p-8 shadow-lg"
            >
              <div className="trans-300 group-hover:scale-90">
                <Image
                  className="h-full w-full object-contain"
                  src={link.image}
                  width={200}
                  height={200}
                  alt={link.title}
                />
              </div>

              <h2 className="trans-200 text-center font-body text-lg font-semibold tracking-wider text-secondary group-hover:text-primary md:text-2xl">
                {link.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>

      <Divider size={50} />
    </div>
  )
}

export default AIPage
