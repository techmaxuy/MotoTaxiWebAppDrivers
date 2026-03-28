import { getTranslations } from 'next-intl/server'
import { requireAdmin } from '@/core/auth/lib/auth-helpers'
import { getAllVehicles } from '@/features/vehicles/actions/adminVehicleActions'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { AdminVehicleList } from '@/features/vehicles/components/AdminVehicleList'

export default async function AdminVehiclesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Vehicles')
  
  // 🔒 Verificación estricta de rol
  await requireAdmin(locale)

  // Obtiene los datos
  const { data: vehicles } = await getAllVehicles()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link 
              href={`/admin`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('close')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('reviewModalTitle')}
            </h1>
          </div>
        </div>

        {/* Componente Interactivo de Cliente */}
        <AdminVehicleList vehicles={vehicles || []} />
        
      </div>
    </div>
  )
}
