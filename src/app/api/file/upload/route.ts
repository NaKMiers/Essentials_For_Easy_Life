import { connectDatabase } from '@/config/database'
import FileModel from '@/models/FileModel'
import { uploadFile } from '@/utils/uploadFile'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Model: File
import '@/models/FileModel'

// [POST]: /upload
export async function POST(req: NextRequest) {
  console.log('- Upload Files -')

  try {
    // connect to database
    await connectDatabase()

    // get user id
    const token = await getToken({ req })
    const userId = token?._id

    // check if user id is not found
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // get files from request
    const formData = await req.formData()
    let files: any[] = formData.getAll('files')

    // check images
    if (!files.length) {
      return NextResponse.json({ message: 'Files are required' }, { status: 400 })
    }

    if (!Array.isArray(files)) {
      files = [files]
    }

    // upload files to cloudinary to get urls
    const uploadedFiles: any[] = await Promise.all(files.map(file => uploadFile(file)))

    if (!uploadedFiles.length) {
      return NextResponse.json({ message: 'Files are not uploaded' }, { status: 500 })
    }

    // insert new files to database
    const userFiles = await FileModel.insertMany(
      uploadedFiles.map(file => ({
        userId,
        url: file.url,
        size: file.bytes,
        type: file.resource_type,
      }))
    )

    // return response
    return NextResponse.json({ files: userFiles, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
