import {z} from 'zod'
import { updateUsuario } from '../controllers/userController';

export const registerSchema = z.object({
    usuario: z.string().min(1, { message: "El usuario es obligatorio"}).max(50),
    contraseña: z.string().min(8, {message: "La contraseña debe tener al menos 8 caracteres"}),
    nombre: z.string().min(1, { message: "El nombre es obligatorio"}).max(100),
    apellido:z.string().min(1, { message: "El nombre es obligatorio"}).max(100),
    correo: z.string().email({ message: "Correo electrónico no válido "}),
    sexo: z.enum(["M", "F"]),
    fecha_de_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha inválido. Debe ser YYYY-MM-DD" }), 
    direccion: z.string().min(1, { message: "La dirección es obligatoria" }).max(200),
    carnet: z.string().min(5, { message: "El carnet es obligatorio"}).max(15),
});

export const loginSchema = z.object({
    usuario: z.string().min(1, { message: "El usuario es obligatorio" }),
    pass: z.string().min(1, {message: "La contraseña es obligatorio" }),
});

export const choferSchema = z.object({
    usuario:z.string().min(1, { message: "El usuario es obligatorio"}),
    licencia: z.string().min(1, { message: "La licencia es obligatoria" }),
});

export const operadorSchema = z.object({
    usuario:z.string().min(1, { message: "El usuario es obligatorio"}),
    codigo: z.string().min(1, { message: "La codigo es obligatoria" }),
});

export const updateUsuarioSchema = z.object({
    usuario: z.string().min(1, { message: "El usuario es obligatorio"}).max(50),
    nombre: z.string().min(1, { message: "El nombre es obligatorio"}).max(100),
    apellido:z.string().min(1, { message: "El nombre es obligatorio"}).max(100),
    correo: z.string().email({ message: "Correo electrónico no válido "}),
    sexo: z.enum(["M", "F"]),
    fecha_de_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha inválido. Debe ser YYYY-MM-DD" }), 
    direccion: z.string().min(1, { message: "La dirección es obligatoria" }).max(200),
    carnet: z.string().min(5, { message: "El carnet es obligatorio"}).max(15),
});