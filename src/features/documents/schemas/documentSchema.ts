import * as z from 'zod'

export const documentSchema = z.object({
  idCardNumber: z.string().min(5, 'El número de cédula es demasiado corto'),
  idCardFront: z.string().url('Debe proveer una foto frontal de su cédula válida'),
  idCardBack: z.string().url('Debe proveer una foto trasera de su cédula válida'),
  dateOfBirth: z.string().min(8, 'Debe proveer una fecha válida'),
  placeOfBirth: z.string().min(2, 'Debe proveer un lugar de nacimiento válido'),
  
  placeOfResidence: z.string().min(2, 'Debe proveer su ciudad de residencia'),
  address: z.string().min(5, 'Debe proveer una dirección válida'),
  proofOfAddress: z.string().url('Debe proveer un comprobante de domicilio válido'),
  
  drivingLicenseNumber: z.string().min(5, 'El número de licencia es demasiado corto'),
  drivingLicenseExpires: z.string().min(8, 'Debe proveer una fecha de vencimiento válida'),
  drivingLicenseFront: z.string().url('Debe proveer una foto frontal de la licencia'),
  drivingLicenseBack: z.string().url('Debe proveer una foto trasera de la licencia')
})

export type DocumentFormData = z.infer<typeof documentSchema>
