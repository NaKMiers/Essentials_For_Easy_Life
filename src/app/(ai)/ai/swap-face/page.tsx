'use client'

import UserImage from '@/components/ai/UserImage'
import Divider from '@/components/Divider'
import { IFile } from '@/models/FileModel'
import {
  deleteSwapFaceHistoryApi,
  getSwapFaceResultApi,
  getUserFilesApi,
  getUserSwapFaceHistoryApi,
  swapFaceApi,
  uploadFilesApi,
} from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import toast from 'react-hot-toast'
import { FaAngleLeft } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'

const fileTypes = ['JPG', 'PNG', 'GIF']

function SwapFacePage() {
  // states
  const [userFiles, setUserFiles] = useState<IFile[]>([])

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [requestId, setRequestId] = useState<string>('')
  const [swapFaceResults, setSwapFaceResults] = useState<any[]>([])

  // get uploaded files
  useEffect(() => {
    const getUploadedFiles = async () => {
      try {
        const { files } = await getUserFilesApi()

        setUserFiles(files)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getUploadedFiles()
  }, [])

  // get swap-face history
  useEffect(() => {
    const getSwapFaceHistory = async () => {
      try {
        const { history } = await getUserSwapFaceHistoryApi()
        setSwapFaceResults(history)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getSwapFaceHistory()
  }, [])

  // handle add files when user select files
  const handleAddFiles = useCallback(async (files: File[]) => {
    if (!files) {
      toast.error('Please select files')
      return
    }
    let newFiles = Array.from(files)

    try {
      const formData = new FormData()
      newFiles.forEach(file => formData.append('files', file))
      const data = await uploadFilesApi(formData)

      setUserFiles(prev => [...prev, ...data.files])
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // handle swap faces
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

  // get results after swap face
  useEffect(() => {
    const handleGetResult = async () => {
      try {
        const { resultImage } = await getSwapFaceResultApi(requestId)

        // show result image
        setSwapFaceResults(prev => [resultImage, ...prev])

        // reset
        setRequestId('')
        setSelectedImages([])
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    if (requestId) {
      handleGetResult()
    }
  }, [requestId])

  // delete swap face history
  const deleteSwapFaceHistory = useCallback(
    async (ids: string[]) => {
      try {
        // send request to server to delete files
        const { message } = await deleteSwapFaceHistoryApi(ids)

        // remove deleted results from swap face results
        setSwapFaceResults(prev => prev.filter(item => !ids.includes(item._id)))

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [setSwapFaceResults]
  )

  return (
    <div className="min-h-screen">
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

      <Divider size={16} />

      <h1 className="text-center font-body text-4xl font-semibold tracking-widest text-secondary">
        Swap Face
      </h1>

      <Divider size={4} />

      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-7">
          <div className="flex min-h-[200px] w-full items-center justify-center py-21">
            <FileUploader
              handleChange={handleAddFiles}
              name="file"
              types={fileTypes}
              multiple
              maxSize={5}
              classes="max-w-[500px] w-full h-[100px]"
            />
          </div>

          {/* MARK: Image Urls */}
          {!!userFiles && (
            <>
              <div className="mb-5 flex flex-wrap justify-center gap-3 rounded-lg p-3">
                {userFiles
                  .filter(file => file.type === 'image')
                  .map(file => (
                    <UserImage
                      image={file}
                      setSelectedImages={setSelectedImages}
                      selectedImages={selectedImages}
                      setUserFiles={setUserFiles}
                      key={file._id}
                    />
                  ))}
              </div>
            </>
          )}

          {selectedImages.length === 2 && (
            <div className="flex items-center justify-center">
              <button
                className="trans-200 flex min-h-10 min-w-20 items-center justify-center rounded-lg border-2 border-light bg-dark-0 px-2 py-2 font-semibold text-light shadow-lg hover:bg-white hover:text-dark"
                onClick={handleSwapFaces}
              >
                Swap Face
              </button>
            </div>
          )}
        </div>

        <div className="col-span-12 border-dark md:col-span-5">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Results</h2>

            <div className="flex flex-wrap gap-3">
              {swapFaceResults.length > 0 &&
                swapFaceResults.map(item => (
                  <div
                    className="rounder-lg relative max-w-[150px] overflow-hidden shadow-lg"
                    key={item._id}
                  >
                    <Image
                      className="h-full w-full rounded-lg object-contain"
                      src={item.data.image}
                      width={150}
                      height={150}
                      alt="file"
                    />

                    <button
                      onClick={e => {
                        e.stopPropagation()
                        deleteSwapFaceHistory([item._id])
                      }}
                      className="group absolute right-1 top-1 rounded-lg bg-slate-300 p-2 hover:bg-dark-100"
                    >
                      <FaX
                        size={16}
                        className="trans-200 text-dark group-hover:text-light"
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Divider size={50} />
    </div>
  )
}

export default SwapFacePage
