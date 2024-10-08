import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

async function uploadFile(file: File, ratio: string = '16:9') {
  const size: { width: number; height: number; fit: keyof sharp.FitEnum } = {
    width: 1920,
    height: 1080,
    fit: 'cover',
  }
  if (ratio === '1:1') {
    size.width = 480
    size.height = 480
  } else if (ratio === '9:16') {
    size.width = 1080
    size.height = 1920
  } else if (ratio === '4:3') {
    size.width = 480
    size.height = 640
  } else if (ratio === '3:4') {
    size.width = 640
    size.height = 480
  }

  try {
    let type: 'image' | 'video' | 'raw' | 'auto' = 'auto'
    if (file.type.startsWith('image')) {
      type = 'image'
    } else if (file.type.startsWith('video')) {
      type = 'video'
    }

    // Resize
    let buffer: Buffer = Buffer.from(await file.arrayBuffer())
    // if (file.type.startsWith('image')) {
    //   buffer = await sharp(buffer).resize(size).toBuffer()
    // }

    interface CloudinaryUploadResult {
      url: string
    }

    const fileUploaded: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: type }, (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve(result)
          } else {
            reject(new Error('Upload result is undefined'))
          }
        })
        .end(buffer)
    })

    return fileUploaded
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function deleteFile(url: string, type: 'image' | 'video' | 'raw' | 'auto' | undefined = 'image') {
  try {
    if (url.startsWith('http')) {
      url = url.split('/').pop() || ''
      const publicId = url.split('.')[0]

      const { result } = await cloudinary.uploader.destroy(publicId, {
        resource_type: type,
      })
      return result === 'ok'
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

export { deleteFile, uploadFile }
