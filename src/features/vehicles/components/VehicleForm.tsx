'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { VehicleImageUpload } from './VehicleImageUpload'
import { createVehicle } from '../actions/vehicleActions'
import { Loader2, AlertCircle } from 'lucide-react'

export function VehicleForm({ t }: { t: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    frontPhoto: '',
    backPhoto: '',
    rightSidePhoto: '',
    leftSidePhoto: '',
    propertyCardPhoto: '',
    drivingLicensePhoto: '',
    contractAccepted: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validaciones basicas
    if (!formData.frontPhoto || !formData.backPhoto || !formData.rightSidePhoto || !formData.leftSidePhoto) {
      setError('Debes subir las 4 fotos del vehículo')
      setIsSubmitting(false)
      return
    }

    if (!formData.propertyCardPhoto || !formData.drivingLicensePhoto) {
      setError('Debes subir los documentos requeridos')
      setIsSubmitting(false)
      return
    }

    if (!formData.contractAccepted) {
      setError('Debes aceptar el contrato de responsabilidad')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createVehicle(formData)
      
      if (!result.success) {
        setError(result.error || 'Error al guardar el vehículo')
        return
      }

      router.push('/vehicles')
      
    } catch (err) {
      setError('Ocurrió un error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glassmorphism p-6 rounded-2xl dark:bg-zinc-900/50">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Datos Básicos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('brand')}</label>
            <input 
              required
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('model')}</label>
            <input 
              required
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('year')}</label>
            <input 
              required
              type="number"
              min="1950"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('color')}</label>
            <input 
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t('licensePlate')}</label>
            <input 
              required
              type="text"
              value={formData.licensePlate}
              onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="Ej: ABC 123"
            />
          </div>
        </div>
      </div>

      {/* Fotos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2">{t('photos')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VehicleImageUpload 
            label={t('front')} 
            translations={(key: string) => t(key)} 
            value={formData.frontPhoto} 
            onChange={(url) => setFormData({...formData, frontPhoto: url})} 
            onDelete={() => setFormData({...formData, frontPhoto: ''})} 
          />
          <VehicleImageUpload 
            label={t('back')} 
            translations={(key: string) => t(key)} 
            value={formData.backPhoto} 
            onChange={(url) => setFormData({...formData, backPhoto: url})} 
            onDelete={() => setFormData({...formData, backPhoto: ''})} 
          />
          <VehicleImageUpload 
            label={t('right')} 
            translations={(key: string) => t(key)} 
            value={formData.rightSidePhoto} 
            onChange={(url) => setFormData({...formData, rightSidePhoto: url})} 
            onDelete={() => setFormData({...formData, rightSidePhoto: ''})} 
          />
          <VehicleImageUpload 
            label={t('left')} 
            translations={(key: string) => t(key)} 
            value={formData.leftSidePhoto} 
            onChange={(url) => setFormData({...formData, leftSidePhoto: url})} 
            onDelete={() => setFormData({...formData, leftSidePhoto: ''})} 
          />
        </div>
      </div>

      {/* Documentos */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-zinc-800 pb-2">{t('documents')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VehicleImageUpload 
            label={t('propertyCard')} 
            translations={(key: string) => t(key)} 
            value={formData.propertyCardPhoto} 
            onChange={(url) => setFormData({...formData, propertyCardPhoto: url})} 
            onDelete={() => setFormData({...formData, propertyCardPhoto: ''})} 
          />
          <VehicleImageUpload 
            label={t('drivingLicense')} 
            translations={(key: string) => t(key)} 
            value={formData.drivingLicensePhoto} 
            onChange={(url) => setFormData({...formData, drivingLicensePhoto: url})} 
            onDelete={() => setFormData({...formData, drivingLicensePhoto: ''})} 
          />
        </div>
      </div>

      {/* Contrato */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/50 p-6 rounded-xl space-y-4">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {t('contract')}
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-600/80 leading-relaxed">
          {t('contractText')}
        </p>
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input 
            type="checkbox" 
            required
            checked={formData.contractAccepted}
            onChange={(e) => setFormData({...formData, contractAccepted: e.target.checked})}
            className="w-5 h-5 text-blue-600 mt-0.5 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm font-medium">He leído y acepto los términos de responsabilidad</span>
        </label>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  )
}
