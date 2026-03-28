'use server'

import { prisma } from '@/core/shared/lib/db'
import { requireAdmin } from '@/core/auth/lib/auth-helpers'
import { revalidatePath } from 'next/cache'

/**
 * Obtiene todos los vehículos registrados en la plataforma.
 * Exclusivo para administradores.
 */
export async function getAllVehicles() {
  try {
    // 🔒 Verificación de seguridad
    // Se extrae el locale dinámicamente si es posible o se omite para lanzar throw nativo
    await requireAdmin('en')

    const vehicles = await prisma.vehicle.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Los más recientes primero
      }
    })

    return { success: true, data: vehicles }
  } catch (error) {
    console.error('[getAllVehicles]', error)
    return { success: false, error: 'Unauthorized or Server Error', data: null }
  }
}

/**
 * Actualiza el estado de un vehículo (Aprobar / Rechazar) y deja un mensaje opcional.
 * Exclusivo para administradores.
 */
export async function updateVehicleStatus(
  vehicleId: string, 
  status: 'APPROVED' | 'REJECTED' | 'PENDING', 
  adminMessage?: string
) {
  try {
    await requireAdmin('en')

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return { success: false, error: 'Vehículo no encontrado' }
    }

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status,
        adminMessage: status === 'REJECTED' ? adminMessage : null // Solo guardamos mensaje en rechazos
      }
    })

    // Revalidar para que el panel de admin y de conductor se actualicen
    revalidatePath('/admin/vehicles')
    revalidatePath('/vehicles')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('[updateVehicleStatus]', error)
    return { success: false, error: 'Internal Server Error' }
  }
}
