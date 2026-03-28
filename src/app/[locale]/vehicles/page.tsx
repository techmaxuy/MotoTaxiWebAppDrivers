import { getTranslations } from 'next-intl/server'
import { VehicleList } from '@/features/vehicles/components/VehicleList'
import { getMyVehicles } from '@/features/vehicles/actions/vehicleActions'

import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
export default async function VehiclesPage() {
  const t = await getTranslations('Vehicles')
  const { data: vehicles } = await getMyVehicles()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToDashboard')}
        </Link>
      </div>
      <VehicleList vehicles={vehicles || []} />
    </div>
  )
}
