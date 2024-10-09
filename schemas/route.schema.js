import { z } from "zod";

export const coordenadaSchema = z.object({
    latitud: z.number().min(-90).max(90, "Latitud no válida"),
  longitud: z.number().min(-180).max(180, "Longitud no válida"),
})

export const paradaSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
  orden: z.number().min(1, "El orden debe ser un número positivo"),
  ruta: z.string().min(1, "La ruta es obligatoria"),
  latitud: z.number().min(-90).max(90, "Latitud no válida"),
  longitud: z.number().min(-180).max(180, "Longitud no válida"),
})

export const paradaProvisionalSchema = z.object({
    fecha_inicio: z.string().min(1, "Fecha de inicio es obligatoria"),
    fecha_fin: z.string().min(1, "Fecha de fin es obligatoria"),
    parada: z.string().min(1, "Parada es obligatoria"),
    latitud: z.number().min(-90).max(90, "Latitud no válida"),
    longitud: z.number().min(-180).max(180, "Longitud no válida"),
    id_parada_provisional: z.string().min(1, "ID de parada provisional es obligatorio"),
  });