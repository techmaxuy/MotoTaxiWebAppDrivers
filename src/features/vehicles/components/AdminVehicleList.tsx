'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Filter, ShieldCheck, ShieldAlert, FileText, CheckCircle, XCircle } from 'lucide-react'
import { updateVehicleStatus } from '@/features/vehicles/actions/adminVehicleActions'

type AdminVehicleInfo = {
  id: string
  userId: string
  brand: string
  model: string
  year: number
  licensePlate: string
  color: string | null
  frontPhoto: string
  backPhoto: string
  rightSidePhoto: string
  leftSidePhoto: string
  propertyCardPhoto: string
  status: string
  adminMessage: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
}

export function AdminVehicleList({ vehicles }: { vehicles: AdminVehicleInfo[] }) {
  const t = useTranslations('Vehicles')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicleInfo | null>(null)
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Filtros combinados
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Acciones de actualización
  const handleApprove = async () => {
    if (!selectedVehicle) return
    setIsProcessing(true)
    const res = await updateVehicleStatus(selectedVehicle.id, 'APPROVED')
    if (res.success) {
      setSelectedVehicle(null)
    } else {
      alert(t('unexpectedError'))
    }
    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!selectedVehicle) return
    if (!rejectionMessage.trim()) {
      alert(t('reasonRequired'))
      return
    }
    
    setIsProcessing(true)
    const res = await updateVehicleStatus(selectedVehicle.id, 'REJECTED', rejectionMessage)
    if (res.success) {
      setSelectedVehicle(null)
      setRejectionMessage('')
    } else {
      alert(t('unexpectedError'))
    }
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      {/* Controles de Filtrado */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="py-2 pl-3 pr-8 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">{t('all')}</option>
            <option value="PENDING">{t('pending')}</option>
            <option value="APPROVED">{t('approved')}</option>
            <option value="REJECTED">{t('rejected')}</option>
          </select>
        </div>
      </div>

      {/* Grid de Vehículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
            <p className="text-gray-500">{t('noVehiclesFound')}</p>
          </div>
        ) : (
          filteredVehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800 transition-all">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm font-medium text-gray-500">{vehicle.user.name || t('owner')} • {vehicle.user.email}</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded font-mono text-sm font-bold border border-gray-200 dark:border-zinc-700">
                    {vehicle.licensePlate}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider shadow-sm border ${
                    vehicle.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' :
                    vehicle.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' :
                    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50'
                  }`}>
                    {vehicle.status}
                  </span>
                  
                  <button 
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
                  >
                    {t('reviewButton')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Auditoría */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-4xl shadow-xl flex flex-col max-h-[90vh]">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">{t('reviewModalTitle')} - {selectedVehicle.licensePlate}</h2>
                <p className="text-gray-500 text-sm">Propietario: {selectedVehicle.user.name} ({selectedVehicle.user.email})</p>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-full"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo de revisión de imágenes */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2"><ShieldCheck className="w-5 h-5 text-blue-500" /> Fotografías del Vehículo</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Frente</label>
                    <img src={selectedVehicle.frontPhoto} alt="Frente" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Reverso</label>
                    <img src={selectedVehicle.backPhoto} alt="Reverso" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Lado Izquierdo</label>
                    <img src={selectedVehicle.leftSidePhoto} alt="Izq" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Lado Derecho</label>
                    <img src={selectedVehicle.rightSidePhoto} alt="Der" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2"><FileText className="w-5 h-5 text-purple-500" /> Documentación Legal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Libreta de Propiedad</label>
                    <img src={selectedVehicle.propertyCardPhoto} alt="Propiedad" className="w-full h-40 object-contain bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-300" />
                  </div>
                </div>
              </div>

            </div>

            {/* Acciones Finales (Sticky Footer) */}
            <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 rounded-b-2xl">
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Motivo de Rechazo (Sólo si decides rechazar)
                </label>
                <textarea
                  className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 rounded-lg p-3 text-sm min-h-[80px]"
                  placeholder={t('rejectPlaceholder')}
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <ShieldAlert className="w-5 h-5" />
                  {t('rejectConfirm')}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  {t('approveConfirm')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
