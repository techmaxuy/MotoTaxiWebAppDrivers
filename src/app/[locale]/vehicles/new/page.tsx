import { getTranslations } from 'next-intl/server'
import { VehicleForm } from '@/features/vehicles/components/VehicleForm'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'

export default async function NewVehiclePage() {
  const t = await getTranslations('Vehicles')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/vehicles"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Vehículos
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('addVehicle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Completa los datos y sube las fotos requeridas para registrar tu moto en la plataforma.
        </p>
      </div>

      <VehicleForm t={t} />
    </div>
  )
}
