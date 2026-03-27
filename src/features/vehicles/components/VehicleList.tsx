'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/routing'
import { Plus, Trash2, Edit, AlertCircle, Loader2 } from 'lucide-react'
import { deleteVehicle } from '../actions/vehicleActions'

interface VehicleListProps {
  vehicles: any[]
  t: any
}

export function VehicleList({ vehicles, t }: VehicleListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return

    try {
      setDeletingId(id)
      await deleteVehicle(id)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete', error)
      alert(t('errorDeleting') || 'Error al eliminar')
    } finally {
      setDeletingId(null)
    }
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
        <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t('noVehicles')}</h3>
        <p className="text-gray-500 max-w-sm mb-6">
          Comienza registrando tu primer vehículo para poder utilizar la plataforma.
        </p>
        <Link 
          href="/vehicles/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addVehicle')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-medium text-gray-500 mt-1">{t('description')}</p>
        </div>
        <Link 
          href="/vehicles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">{t('addVehicle')}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-all">
            {/* Imagen Principal (Frontal) */}
            <div className="relative aspect-video bg-gray-100 dark:bg-zinc-800">
              {vehicle.frontPhoto ? (
                <Image 
                  src={vehicle.frontPhoto} 
                  alt={vehicle.model} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Sin foto</div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                  vehicle.status === 'APPROVED' ? 'bg-green-500/90 text-white border-green-400' :
                  vehicle.status === 'REJECTED' ? 'bg-red-500/90 text-white border-red-400' :
                  'bg-yellow-500/90 text-white border-yellow-400'
                }`}>
                  {t(`status${vehicle.status}`)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold leading-tight">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-sm font-medium text-gray-500">{vehicle.year} • {vehicle.color}</p>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded font-mono text-sm font-bold border border-gray-200 dark:border-zinc-700">
                  {vehicle.licensePlate}
                </div>
              </div>

              {/* Botonera Oculta (Aparece en hover) */}
              <div className="absolute opacity-0 group-hover:opacity-100 bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity flex justify-end gap-2 text-white">
                <button 
                  onClick={() => handleDelete(vehicle.id)}
                  disabled={deletingId === vehicle.id}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors disabled:opacity-50"
                  title={t('delete')}
                >
                  {deletingId === vehicle.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
