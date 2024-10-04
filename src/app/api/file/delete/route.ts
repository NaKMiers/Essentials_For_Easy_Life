import { connectDatabase } from '@/config/database'
import FileModel from '@/models/FileModel'
import { NextRequest, NextResponse } from 'next/server'

// Model: File
import '@/models/FileModel'
import { deleteFile } from '@/utils/uploadFile'

// [DELETE]: /file/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Files -')

  try {
    // connect to database
    await connectDatabase()

    // get file ids from request to delete
    const { ids } = await req.json()

    // get delete files
    const deleteFiles = await FileModel.find({ _id: { $in: ids } })

    // delete files from database
    await FileModel.deleteMany({ _id: { $in: ids } })

    // delete files from cloudinary
    await Promise.all(deleteFiles.map(file => deleteFile(file.url)))

    // return response
    return NextResponse.json({ message: 'Delete Successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
