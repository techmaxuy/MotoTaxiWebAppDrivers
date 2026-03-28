import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { DocumentForm } from '@/features/documents/components/DocumentForm'
import { getMyDocuments } from '@/features/documents/actions/documentActions'

export default async function DocumentsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Documents')
  const tVehicles = await getTranslations('Vehicles')

  // Obtiene datos guardados (si los hay)
  const { data: myDocs } = await getMyDocuments()
  
  const statusColors = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    APPROVED: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    REJECTED: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link 
              href={`/vehicles`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {tVehicles('backToVehicles')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Alerta de Estado si ya existen documentos */}
        {myDocs && (
          <div className={`mb-8 p-4 rounded-xl border flex items-start gap-4 ${statusColors[myDocs.status as keyof typeof statusColors]}`}>
            {myDocs.status === 'PENDING' && <Clock className="w-6 h-6 flex-shrink-0 mt-0.5" />}
            {myDocs.status === 'APPROVED' && <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
            {myDocs.status === 'REJECTED' && <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
            
            <div>
              <h3 className="font-bold text-lg mb-1">{t('status')}: {tVehicles(myDocs.status.toLowerCase() as any)}</h3>
              <p className="opacity-90">
                {myDocs.status === 'PENDING' ? t('viewStatus') :
                 myDocs.status === 'REJECTED' ? myDocs.adminMessage :
                 'Tus documentos han sido revisados y aprobados legalmente.'}
              </p>
            </div>
          </div>
        )}

        {/* Formulario (solo se muestra si no está aprobado o si se fuerza la edición) */}
        {myDocs?.status !== 'APPROVED' ? (
          <DocumentForm initialData={myDocs || {}} />
        ) : (
           <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
             <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Documentación en Regla</h3>
             <p className="text-gray-500 mb-6">No necesitas volver a subir tus documentos al menos que te lo solicitemos formalmente.</p>
           </div>
        )}

      </div>
    </div>
  )
}
