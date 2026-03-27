import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/../auth'
import { uploadImage } from '@/core/shared/lib/azure-storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`[UploadVehicleDoc] User ${session.user.id} uploading: ${file.name}`)

    const imageUrl = await uploadImage(file, {
      folder: `vehicles/${session.user.id}`, // Organizar por usuario
      maxWidth: 1920, // Imágenes de alta calidad para documentos/vehículos
      maxHeight: 1080,
      quality: 85,
    })

    console.log(`[UploadVehicleDoc] ✅ File uploaded successfully`)

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('[UploadVehicleDoc] Error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
