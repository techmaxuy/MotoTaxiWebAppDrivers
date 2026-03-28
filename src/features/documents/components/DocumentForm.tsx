'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Loader2, AlertCircle } from 'lucide-react'
import { createOrUpdateDocument } from '../actions/documentActions'
import { VehicleImageUpload } from '@/features/vehicles/components/VehicleImageUpload'

export function DocumentForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const t = useTranslations('Documents')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    idCardNumber: initialData?.idCardNumber || '',
    idCardFront: initialData?.idCardFront || '',
    idCardBack: initialData?.idCardBack || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    placeOfBirth: initialData?.placeOfBirth || '',
    placeOfResidence: initialData?.placeOfResidence || '',
    address: initialData?.address || '',
    proofOfAddress: initialData?.proofOfAddress || '',
    drivingLicenseNumber: initialData?.drivingLicenseNumber || '',
    drivingLicenseExpires: initialData?.drivingLicenseExpires || '',
    drivingLicenseFront: initialData?.drivingLicenseFront || '',
    drivingLicenseBack: initialData?.drivingLicenseBack || '',
  })

  // Función proxy pasaremos las traducciones existentes (compartidas)
  const uiTranslations = useTranslations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    // Basic required files validation
    if (
      !formData.idCardFront || !formData.idCardBack || 
      !formData.drivingLicenseFront || !formData.drivingLicenseBack || 
      !formData.proofOfAddress
    ) {
      setError(t('validation_allFiles'))
      setIsSubmitting(false)
      return
    }

    const res = await createOrUpdateDocument(formData)
    
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/vehicles')
      }, 2000)
    } else {
      setError(res.error || t('errorSaving'))
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
            {t('success')}
          </div>
        )}

        {/* Sección Identidad */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-gray-200 dark:border-zinc-800 pb-2">{t('idGroup')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('idCardNumber')}</label>
              <input type="text" required value={formData.idCardNumber} onChange={e => setFormData({...formData, idCardNumber: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('dateOfBirth')}</label>
              <input type="date" required value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:[color-scheme:dark]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">{t('placeOfBirth')}</label>
              <input type="text" required value={formData.placeOfBirth} onChange={e => setFormData({...formData, placeOfBirth: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent" />
            </div>
            <VehicleImageUpload label={t('idCardFront')} value={formData.idCardFront} translations={(k:string) => uiTranslations(`Vehicles.${k}`)} onChange={v => setFormData({...formData, idCardFront: v})} onDelete={() => setFormData({...formData, idCardFront: ''})} disabled={isSubmitting} />
            <VehicleImageUpload label={t('idCardBack')} value={formData.idCardBack} translations={(k:string) => uiTranslations(`Vehicles.${k}`)} onChange={v => setFormData({...formData, idCardBack: v})} onDelete={() => setFormData({...formData, idCardBack: ''})} disabled={isSubmitting} />
          </div>
        </div>

        {/* Sección Residencia */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-gray-200 dark:border-zinc-800 pb-2">{t('residenceGroup')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('placeOfResidence')}</label>
              <input type="text" required value={formData.placeOfResidence} onChange={e => setFormData({...formData, placeOfResidence: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('address')}</label>
              <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent" />
            </div>
            <div className="md:col-span-2">
               <VehicleImageUpload label={t('proofOfAddress')} value={formData.proofOfAddress} translations={(k:string) => uiTranslations(`Vehicles.${k}`)} onChange={v => setFormData({...formData, proofOfAddress: v})} onDelete={() => setFormData({...formData, proofOfAddress: ''})} disabled={isSubmitting} />
            </div>
          </div>
        </div>

        {/* Sección Licencia de Conducir */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-gray-200 dark:border-zinc-800 pb-2">{t('licenseGroup')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('drivingLicenseNumber')}</label>
              <input type="text" required value={formData.drivingLicenseNumber} onChange={e => setFormData({...formData, drivingLicenseNumber: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('drivingLicenseExpires')}</label>
              <input type="date" required value={formData.drivingLicenseExpires} onChange={e => setFormData({...formData, drivingLicenseExpires: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent dark:[color-scheme:dark]" />
            </div>
            <VehicleImageUpload label={t('drivingLicenseFront')} value={formData.drivingLicenseFront} translations={(k:string) => uiTranslations(`Vehicles.${k}`)} onChange={v => setFormData({...formData, drivingLicenseFront: v})} onDelete={() => setFormData({...formData, drivingLicenseFront: ''})} disabled={isSubmitting} />
            <VehicleImageUpload label={t('drivingLicenseBack')} value={formData.drivingLicenseBack} translations={(k:string) => uiTranslations(`Vehicles.${k}`)} onChange={v => setFormData({...formData, drivingLicenseBack: v})} onDelete={() => setFormData({...formData, drivingLicenseBack: ''})} disabled={isSubmitting} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              {t('saving')}
            </>
          ) : (
            t('save')
          )}
        </button>

      </form>
    </div>
  )
}
