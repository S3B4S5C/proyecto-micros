import { z } from "zod";

export const microSchema  = z.object({
    placa: z.string().min(1, "La placa es obligatoria"),
    interno: z.string().min(1, "El interno es obligatorio"),
    modelo: z.string().min(1,"El modelo es obligatorio"),
    año: z.string().min(1,"El año es obligatorio"),
    seguro: z.string().min(1, "El seguro es obligatorio"),
    dueño: z.string().min(1, "El dueño es obligatorio")
})

export const horarioSchema = z.object({
    salida: z.string().min(1, "La hora de salida es obligatoria"),
    partida: z.string().min(1, "El punto de partida es obligatorio"),
    fecha: z.string().min(1, "La fecha es obligatoria"),
    micro: z.string().min(1, "El id del micro es obligatorio")
})