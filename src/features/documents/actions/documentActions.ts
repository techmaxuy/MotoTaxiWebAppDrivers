'use server'

import { auth } from '@/../auth'
import { prisma } from '@/core/shared/lib/db'
import { documentSchema } from '../schemas/documentSchema'
import { revalidatePath } from 'next/cache'

export async function createOrUpdateDocument(data: any) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const val = documentSchema.safeParse(data)
    if (!val.success) {
      console.error('Validation Error', val.error.flatten().fieldErrors)
      return { success: false, error: 'Validation failed', errors: val.error.flatten().fieldErrors }
    }

    // Verificar si ya existe documentación para el usuario
    const existing = await prisma.driverDocument.findUnique({
      where: { userId: session.user.id }
    })

    if (existing) {
      const doc = await prisma.driverDocument.update({
        where: { id: existing.id },
        data: {
          ...val.data,
          status: 'PENDING',
          adminMessage: null // Reseteamos mensajes viejos de rechazo
        }
      })
      revalidatePath('/documents')
      return { success: true, documentId: doc.id }
    } else {
      const doc = await prisma.driverDocument.create({
        data: {
          userId: session.user.id,
          ...val.data,
          status: 'PENDING'
        }
      })
      revalidatePath('/documents')
      return { success: true, documentId: doc.id }
    }
  } catch (error) {
    console.error('[createOrUpdateDocument]', error)
    return { success: false, error: 'Internal Server Error' }
  }
}

export async function getMyDocuments() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { data: null }

    const doc = await prisma.driverDocument.findUnique({
      where: { userId: session.user.id }
    })
    
    return { data: doc }
  } catch (error) {
    console.error('[getMyDocuments]', error)
    return { data: null }
  }
}
