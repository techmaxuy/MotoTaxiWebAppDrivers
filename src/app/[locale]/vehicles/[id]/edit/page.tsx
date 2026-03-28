import { VehicleForm } from '@/features/vehicles/components/VehicleForm'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getVehicle } from '@/features/vehicles/actions/vehicleActions'
import { notFound } from 'next/navigation'

export default async function EditVehiclePage({
  params
}: {
  params: Promise<{ id: string, locale: string }>
}) {
  const { id } = await params
  const t = await getTranslations('Vehicles')
  
  const response = await getVehicle(id)
  
  if (!response.success || !response.data) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/vehicles"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToVehicles')}
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('editVehicle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('fillDataNotice')}
        </p>
      </div>

      <VehicleForm initialData={response.data} />
    </div>
  )
}
