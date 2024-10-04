import model from '../models/index.js'
import { uuid } from 'uuidv4'
import { hashPassword, comparePassword } from '../services/auth.js'

const existeCorreo = async (correo) => {
    const UsuarioExistente = await model.informacionesPersonales.findOne({ where: { correo } });
    return UsuarioExistente !== null;
}

const existeUsuario = async (usuario) => {
    const UsuarioExistente = await model.usuarios.findByPk(usuario);
    return UsuarioExistente !== null;
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
        if (await existeUsuario(usuario)) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' })
        }

        if (await existeCorreo(correo)) {
            return res.status(400).json({ message: 'El correo ya está registrado' })
        }

        const id_informacion = uuid()
        const { salt, hashedPassword } = await hashPassword(contraseña);

        const nuevaInformacion = await model.informacionesPersonales.create({ id_informacion, nombre, apellido, correo, sexo, fecha_de_nacimiento, direccion, carnet })  
        const nuevoUsuario = await model.usuarios.create({ usuario, contraseña: hashedPassword, salt, id_informacion });
                 
        res.status(201).json({ message: 'Usuario registrado con éxito', user: nuevoUsuario, informacion: nuevaInformacion });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
}

export const updateUsuario = async (req, res) => {
    const { usuario, nombre, apellido, correo, sexo, fecha_de_nacimiento, direccion, carnet } = req.body

    const datos = {
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
        ...(correo && { correo }),
        ...(sexo && { sexo }),
        ...(fecha_de_nacimiento && { fecha_de_nacimiento }),
        ...(direccion && { direccion }),
        ...(carnet && { carnet })
    }
    try {
        const usuarioSeleccionado = await model.usuarios.findByPk(usuario)
            if (usuarioSeleccionado) {
            const idInformacion = usuarioSeleccionado.id_informacion
            await model.informacionesPersonales.update(
                datos,
                { 
                    where: {
                        id_informacion: idInformacion
                    }
                }
            )
            res.status(201).json({ message: "Usuario actualizado con exito" })
        }
        else {
            res.status(404).json({ message: "Usuario no encontrado" })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
}

export const crearChofer = async (req, res) => {
    const { usuario, licencia } = req.body 
    try {
        if (existeUsuario(usuario)) {
            await model.choferes.create({ usuario_chofer: usuario, licencia_categoria: licencia })
            res.status(201).json({ message: 'Chofer creado con exito'})
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ message: "Error al crear Chofer", error: error.message})
    }
}

export const crearOperador = async (req, res) => {
    const { usuario } = req.body 
    try {
        if (existeUsuario(usuario)) {
            await model.choferes.create({ usuario_operador: usuario })
            res.status(201).json({ message: 'Operador creado con exito'})
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ message: "Error al crear Operador", error: error.message})
    }
}

// Getters

export const getChoferes = async (req, res) => {
    //ToDo
}

export const getChofer = async (req, res) => {
    //ToDo
}

export const getUsuario = async (req, res) => {
    //ToDo
}