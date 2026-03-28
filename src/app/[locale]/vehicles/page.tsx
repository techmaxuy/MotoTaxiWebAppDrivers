import { getTranslations } from 'next-intl/server'
import { VehicleList } from '@/features/vehicles/components/VehicleList'
import { getMyVehicles } from '@/features/vehicles/actions/vehicleActions'

export default async function VehiclesPage() {
  const { data: vehicles } = await getMyVehicles()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <VehicleList vehicles={vehicles || []} />
    </div>
  )
}
