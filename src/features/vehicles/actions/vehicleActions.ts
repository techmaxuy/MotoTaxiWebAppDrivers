'use server'

import { auth } from '@/../auth'
import { prisma } from '@/core/shared/lib/db'
import { vehicleSchema } from '../schemas/vehicleSchema'
import { revalidatePath } from 'next/cache'

export async function createVehicle(data: any) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const val = vehicleSchema.safeParse(data)
    if (!val.success) {
      console.error('Validation Error', val.error.flatten().fieldErrors)
      return { success: false, error: 'Validation failed', errors: val.error.flatten().fieldErrors }
    }

    // Checking if the plate already exists locally, but the unique constraint will handle it too
    const existing = await prisma.vehicle.findUnique({
      where: { licensePlate: val.data.licensePlate }
    })

    if (existing) {
      return { success: false, error: 'La patente ya está registrada' }
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: session.user.id,
        brand: val.data.brand,
        model: val.data.model,
        year: val.data.year,
        color: val.data.color || '',
        licensePlate: val.data.licensePlate,
        frontPhoto: val.data.frontPhoto,
        backPhoto: val.data.backPhoto,
        rightSidePhoto: val.data.rightSidePhoto,
        leftSidePhoto: val.data.leftSidePhoto,
        propertyCardPhoto: val.data.propertyCardPhoto,
        drivingLicensePhoto: val.data.drivingLicensePhoto,
        contractAccepted: val.data.contractAccepted,
        isActive: true, // Auto set as active right now for MVP, can be adjusted
        status: 'PENDING'
      }
    })

    revalidatePath('/') // Revalida dashboard si mostramos métricas
    revalidatePath('/vehicles')

    return { success: true, vehicleId: vehicle.id }

  } catch (error) {
    console.error('[createVehicle]', error)
    return { success: false, error: 'Internal Server Error' }
  }
}

export async function getMyVehicles() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, data: [] }
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: vehicles }
  } catch (error) {
    console.error('[getMyVehicles]', error)
    return { success: false, error: 'Internal Server Error', data: [] }
  }
}

export async function deleteVehicle(id: string) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!vehicle || vehicle.userId !== session.user.id) {
      return { success: false, error: 'Not found or forbidden' }
    }

    await prisma.vehicle.delete({
      where: { id }
    })

    revalidatePath('/vehicles')
    return { success: true }
  } catch (error) {
    console.error('[deleteVehicle]', error)
    return { success: false, error: 'Internal Server Error' }
  }
}
