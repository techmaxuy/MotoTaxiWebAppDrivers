'use client'

import { useState } from 'react'
import { Upload, X, Loader2, Check } from 'lucide-react'

interface VehicleImageUploadProps {
  label: string
  value?: string
  onChange: (url: string) => void
  onDelete: () => void
  disabled?: boolean
  translations: any
}

export function VehicleImageUpload({ label, value, onChange, onDelete, disabled, translations }: VehicleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError(translations('upload_onlyImages'))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(translations('upload_maxSize5MB'))
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/vehicle-document', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.imageUrl)
    } catch (err) {
      console.error(err)
      setError(translations('upload_error'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {value ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <Check className="w-4 h-4" />
          </div>
        </div>
      ) : (
        <label className={`relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50'} cursor-pointer transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            ) : (
              <Upload className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : 'text-gray-400'}`} />
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
              {isUploading ? translations('uploading') : label}
            </p>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </label>
      )}
    </div>
  )
}
