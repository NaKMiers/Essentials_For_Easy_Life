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
import { FaTrash } from 'react-icons/fa'

function AIPage() {
  // states
  const [files, setFiles] = useState<File[]>([])
  const [userFiles, setUserFiles] = useState<IFile[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [requestId, setRequestId] = useState<string>('')
  const [swapFaceResults, setSwapFaceResults] = useState<string[]>([])

  // get swap-face history
  useEffect(() => {
    const getSwapFaceHistory = async () => {
      try {
        const { history } = await getUserSwapFaceHistoryApi()
        setSwapFaceResults(history.map((item: any) => item.data.image))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getSwapFaceHistory()
  }, [])

  const handleUploadFiles = useCallback(async () => {
    if (!files.length) {
      toast.error('Please select files')
      return
    }

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      const data = await uploadFilesApi(formData)

      console.log(data)

      toast.success('Files uploaded successfully')

      setFiles([])
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [files])

  const handleGetUploadedFiles = useCallback(async () => {
    try {
      const { files } = await getUserFilesApi()

      setUserFiles(files)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  const handleSwapFaces = useCallback(async () => {
    if (selectedImages.length !== 2) {
      toast.error('Please select target image and source image')
      return
    }

    try {
      const { requestId } = await swapFaceApi(selectedImages[0], selectedImages[1])

      toast.success('Faces swapped successfully')

      setRequestId(requestId)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [selectedImages])

  const handleGetResult = useCallback(async () => {
    try {
      const { resultImage } = await getSwapFaceResultApi(requestId)

      setSwapFaceResults(prev => [resultImage, ...prev])
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [requestId])

  useEffect(() => {
    if (requestId) {
      handleGetResult()
    }
  }, [handleGetResult, requestId])

  const handleDeleteFile = useCallback(
    async (ids: string[]) => {
      try {
        const { message } = await deleteFilesApi(ids)

        toast.success(message)

        setUserFiles(prev => prev.filter(file => !ids.includes(file._id)))

        if (selectedImages.length) {
          setSelectedImages(prev => prev.filter(url => !ids.includes(url)))
        }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [selectedImages]
  )

  // --------------------------------------------
  const [content, setContent] = useState<string>('')
  const [detectResult, setDetectResult] = useState<any>(null)

  // AI Content Detector
  const handleDetectAIContent = useCallback(async () => {
    try {
      const data = await detectAIContentApi(content)

      setDetectResult(data.data)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [content])

  // --------------------------------------------
  const [prompt, setPrompt] = useState<string>('')
  const [styles, setStyles] = useState<number>(201)
  const [size, setSize] = useState<'768x768' | '768x1024' | '1024x768' | '1024x1024'>('1024x1024')
  const [aiImageResult, setAiImageResult] = useState<string>('')

  const handleGenerateImage = useCallback(async () => {
    try {
      const { image } = await generateImageApi({ prompt, styles, size })
      setAiImageResult(image)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [prompt, size, styles])

  // --------------------------------------------
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
      <div className="grid grid-cols-3 gap-21 p-21">
        <div className="flex flex-col items-center gap-4 border-r-2 border-white">
          <input
            className="w-80 rounded-lg border-2 border-light p-2"
            type="file"
            multiple
            accept="image/*"
            onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          />
          <button
            className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
            onClick={handleUploadFiles}
          >
            Upload
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 border-r-2 border-white">
          <button
            className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
            onClick={handleGetUploadedFiles}
          >
            Get Uploaded Images
          </button>

          <div className="flex flex-wrap items-start">
            {userFiles
              .filter(file => file.type === 'image')
              .map(file => (
                <div
                  className={`${
                    selectedImages[0] === file.url
                      ? 'border-2 border-blue-500'
                      : selectedImages[1] === file.url
                        ? 'border-2 border-green-500'
                        : ''
                  } relative flex w-1/2 min-w-[100px] flex-shrink-0 overflow-hidden rounded-lg`}
                  key={file._id}
                  onClick={() => {
                    if (selectedImages.includes(file.url)) {
                      setSelectedImages(prev => prev.filter(url => url !== file.url))
                    } else {
                      if (selectedImages.length < 2) {
                        setSelectedImages(prev => [...prev, file.url])
                      }
                    }
                  }}
                >
                  <button
                    className="bg-dark trans-200 absolute right-0 top-0 rounded-md border-2 border-white p-2 text-light hover:bg-dark-100"
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteFile([file._id])
                    }}
                  >
                    <FaTrash size={10} />
                  </button>
                  <Image
                    className="h-full w-full object-contain"
                    src={file.url}
                    width={100}
                    height={100}
                    alt="file"
                  />
                </div>
              ))}
          </div>

          {selectedImages.length === 2 && (
            <button
              className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
              onClick={handleSwapFaces}
            >
              Swap Face
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">Results</h2>

          {swapFaceResults.length > 0 &&
            swapFaceResults.map(image => (
              <div
                className="rounder-lg max-w-[200px] overflow-hidden shadow-lg"
                key={image}
              >
                <Image
                  className="h-full w-full rounded-lg object-contain"
                  src={image}
                  width={200}
                  height={200}
                  alt="file"
                />
              </div>
            ))}
        </div>
      </div>

      <Divider
        size={4}
        border
      />

      <div className="flex flex-col items-center gap-4 p-21">
        <h1 className="text-xl font-semibold">AI Content Detector</h1>
        <textarea
          className="w-full rounded-lg px-3 py-4 text-sm text-dark outline-none"
          rows={6}
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

        <div className="w-full max-w-[600px]">
          <h2 className="text-center text-xl font-semibold">Result</h2>

          {detectResult && (
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
          )}
        </div>
      </div>

      <Divider
        size={4}
        border
      />

      <div className={`grid ${aiImageResult ? 'grid-cols-2' : 'grid-cols-1'} gap-21`}>
        <div className="flex flex-col items-center gap-4 p-21">
          <h1 className="text-center text-xl font-semibold">Image Generator From Text</h1>

          <input
            className="mt-3 w-80 rounded-lg border-2 border-light p-2 text-dark outline-none"
            placeholder="Prompt..."
            type="text"
            onChange={e => setPrompt(e.target.value)}
          />
          <select
            className="rounded-lg px-3 py-2 text-dark outline-none"
            value={styles}
            onChange={e => setStyles(Number(e.target.value))}
          >
            <option value="101">Art painting Wash painting</option>
            <option value="102">Conceptual art</option>
            <option value="103">Oil Painting 1</option>
            <option value="104">watercolour</option>
            <option value="105">Pixel art</option>
            <option value="106">Thick paint style</option>
            <option value="107">inset</option>
            <option value="108">Paper-cut style</option>
            <option value="109">Impressionism 1 (Monet)</option>
            <option value="110">2.5 D</option>
            <option value="111">Classical portrait</option>
            <option value="112">Black and white sketch</option>
            <option value="113">cyberpunk</option>
            <option value="114">Sci-fi style</option>
            <option value="115">Dark style</option>
            <option value="116">3D</option>
            <option value="118">Oil Painting 2 (Van Gogh)</option>
            <option value="119">Impressionism 2</option>
            <option value="117">Steam wave</option>
            <option value="201">Games and animation Japanese anime</option>
            <option value="202">Monster style</option>
            <option value="203">Beautiful and ancient</option>
            <option value="204">Retro animation</option>
            <option value="301">Game cartoon drawing</option>
            <option value="401">Professional realism Universal realistic style</option>
          </select>

          <select
            className="rounded-lg px-3 py-2 text-dark outline-none"
            value={size}
            onChange={e => setSize(e.target.value as any)}
          >
            <option value="768x768">768x768</option>
            <option value="768x1024">768x1024</option>
            <option value="1024x768">1024x768</option>
            <option value="1024x1024">1024x1024</option>
          </select>

          <button
            className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
            onClick={handleGenerateImage}
          >
            Generate
          </button>
        </div>

        {aiImageResult && (
          <div className="flex w-full justify-center">
            <div className="max-w-[300px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={aiImageResult}
                width={300}
                height={300}
                alt="ai-generated-image"
              />
            </div>
          </div>
        )}
      </div>

      <Divider
        size={4}
        border
      />

      <div className={`grid ${audioResult ? 'grid-cols-2' : 'grid-cols-1'} gap-21`}>
        <div className={`flex flex-col items-center gap-21 p-21`}>
          <h1 className="text-center text-xl font-semibold">Text To Speech</h1>

          <textarea
            className="w-full rounded-lg px-3 py-4 text-sm text-dark outline-none"
            rows={6}
            placeholder="Audio Prompt..."
            value={audioPrompt}
            onChange={e => setAudioPrompt(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <select
              className="rounded-lg px-3 py-2 text-sm text-dark shadow-lg outline-none"
              onChange={e => setSelectedVoice(e.target.value)}
              value={selectedVoice.id}
            >
              {voices.map(voice => (
                <option
                  value={voice.id}
                  key={voice.id}
                >
                  {voice.id} - {voice.voice} - {voice.voiceGender} - {voice.language} -{' '}
                  {voice.languageDescription} - {voice.engine}
                </option>
              ))}
            </select>
          </div>

          <button
            className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
            onClick={handleTextToSpeech}
          >
            Submit
          </button>
        </div>

        {audioResult && (
          <div className="flex w-full items-center justify-center">
            <div>
              <audio
                src={audioResult}
                controls
              />
            </div>
          </div>
        )}
      </div>

      <Divider size={80} />
    </div>
  )
}

export default AIPage
