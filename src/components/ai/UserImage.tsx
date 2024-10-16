import { IFile } from '@/models/FileModel'
import { deleteFilesApi } from '@/requests'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import toast from 'react-hot-toast'
import { FaX } from 'react-icons/fa6'

interface UserImageProps {
  image: IFile
  setSelectedImages: Dispatch<SetStateAction<string[]>>
  setUserFiles: Dispatch<SetStateAction<IFile[]>>
  selectedImages: string[]
  className?: string
}

function UserImage({
  image,
  setSelectedImages,
  selectedImages,
  setUserFiles,
  className = '',
}: UserImageProps) {
  const handleDeleteFile = useCallback(
    async (ids: string[]) => {
      try {
        // send request to server to delete files
        const { message } = await deleteFilesApi(ids)

        // remove deleted files from
        setUserFiles(prev => prev.filter(file => !ids.includes(file._id)))

        // remove deleted files from selected images
        if (selectedImages.length) {
          setSelectedImages(prev => prev.filter(url => !ids.includes(url)))
        }

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [selectedImages, setSelectedImages, setUserFiles]
  )

  return (
    <div
      className={`relative ${className}`}
      onClick={() => {
        if (selectedImages.includes(image.url)) {
          setSelectedImages(prev => prev.filter(url => url !== image.url))
        } else {
          if (selectedImages.length < 2) {
            setSelectedImages(prev => [...prev, image.url])
          }
        }
      }}
      key={image._id}
    >
      <div
        className={`${
          selectedImages[0] === image.url
            ? 'border-blue-500'
            : selectedImages[1] === image.url
              ? 'border-green-500'
              : 'border-transparent'
        } trans-200 relative cursor-pointer rounded-lg border-2`}
      >
        <Image
          className="rounded-lg"
          src={image.url}
          height={150}
          width={150}
          alt="thumbnail"
        />
      </div>

      <button
        onClick={e => {
          e.stopPropagation()
          handleDeleteFile([image._id])
        }}
        className="group absolute right-2 top-2 rounded-lg bg-slate-300 p-2 hover:bg-dark-100"
      >
        <FaX
          size={16}
          className="trans-200 text-dark group-hover:text-light"
        />
      </button>
    </div>
  )
}

export default UserImage
