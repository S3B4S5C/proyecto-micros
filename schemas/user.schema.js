import {z} from 'zod'


export const registerSchema = z.object({
    usuario: z.string().min(1, { message: "El usuario es obligatorio"}).max(50),
    contraseña: z.string().min(8, {message: "La contraseña debe tener al menos 8 caracteres"}),
    nombre: z.string().min(1, { message: "El nombre es obligatorio"}).max(100),
    apellido:z.string().min(1, { message: "El apellido es obligatorio"}).max(100),
    correo: z.string().email({ message: "Correo electrónico no válido "}),
    sexo: z.enum(["M", "F"]),
    fecha_de_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha inválido. Debe ser YYYY-MM-DD" }), 
    direccion: z.string().min(1, { message: "La dirección es obligatoria" }).max(200),
    carnet: z.string().min(5, { message: "El carnet es obligatorio"}).max(15),
});

export const loginSchema = z.object({
    usuario: z.string().min(1, { message: "El usuario es obligatorio" }),
    contraseña: z.string().min(1, {message: "La contraseña es obligatorio" }),
});

export const choferSchema = z.object({
    usuario:z.string().min(1, { message: "El usuario es obligatorio"}),
    licencia: z.enum(["P", "A", "B", "C"], {message: 'Licencia invalida, debe ser ["P", "A", "B", "C"]'}),
});

export const operadorSchema = z.object({
    usuario:z.string().min(1, { message: "El usuario es obligatorio"}),
    codigo: z.string().min(1, { message: "El codigo es obligatorio" }),
});

export const updateUsuarioSchema = z.object({
    nombre: z.string().max(100, { message: "El nombre debe tener como maximo 100 caracteres"}).optional(),
    apellido:z.string().max(100, { message: "El apellido debe tener como maximo 100 caracteres"}).optional(),
    correo: z.string().email({ message: "Correo electrónico no válido "}).optional(),
    sexo: z.enum(["M", "F"], { message: "El sexo debe ser 'M' o 'F'" }).optional(),
    fecha_de_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha inválido. Debe ser YYYY-MM-DD" }).optional(), 
    direccion: z.string().max(200, { message: "La direccion debe tener como maximo 200 caracteres"}).optional(),
    carnet: z.string().max(15, { message: "El carnet debe tener como maximo 15 digitos"}).optional(),
});