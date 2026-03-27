import * as z from 'zod'

export const vehicleSchema = z.object({
  brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  year: z.number().int().min(1950, 'El año debe ser mayor a 1950').max(new Date().getFullYear() + 1, 'Año inválido'),
  color: z.string().optional(),
  licensePlate: z.string().min(3, 'La patente debe tener al menos 3 caracteres'),
  frontPhoto: z.string().url('Debe proveer una foto frontal válida'),
  backPhoto: z.string().url('Debe proveer una foto trasera válida'),
  rightSidePhoto: z.string().url('Debe proveer una foto lateral derecha válida'),
  leftSidePhoto: z.string().url('Debe proveer una foto lateral izquierda válida'),
  propertyCardPhoto: z.string().url('Debe proveer una foto de la libreta de propiedad'),
  drivingLicensePhoto: z.string().url('Debe proveer una foto de la libreta de conducir'),
  contractAccepted: z.boolean().refine(val => val === true, {
    message: 'Debe aceptar el contrato de responsabilidad para poder registrar el vehículo'
  })
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
