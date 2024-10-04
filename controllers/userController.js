import model from '../models/index.js'
import { uuid } from 'uuidv4'
import { hashPassword, comparePassword } from '../services/auth.js'

const existeCorreo = correo => {
    
}
export const login = async (req, res) => {
    const { usuario, pass } = req.body
    const usuarioLogged = await model.usuarios.findByPk(usuario)
    console.log(JSON.stringify(usuarioLogged, null, 2))

    if(comparePassword(pass, usuarioLogged.contraseña, usuarioLogged.salt)) {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }
    else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
    }
}

export const register = async (req, res) => {
    const { usuario, contraseña, nombre, apellido, correo, sexo, fecha_de_nacimiento, direccion, carnet } = req.body;
  
    try {
        const id_informacion = uuid()
        const { salt, hashedPassword } = await hashPassword(contraseña);

        const nuevaInformacion = await model.informacionesPersonales.create({ id_informacion, nombre, apellido, correo, sexo, fecha_de_nacimiento, direccion, carnet })  
        const nuevoUsuario = await model.usuarios.create({ usuario, contraseña: hashedPassword, salt, id_informacion });
                 
        res.status(201).json({ message: 'Usuario registrado con éxito', user: nuevoUsuario, informacion: nuevaInformacion });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
}