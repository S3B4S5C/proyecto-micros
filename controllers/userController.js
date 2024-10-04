import model from '../models/index.js'
import { uuid } from 'uuidv4'
import { hashPassword, comparePassword, generateToken } from '../services/auth.js'

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

    if(comparePassword(pass, usuarioLogged.contraseña)) {
        const token = await generateToken(usuario)
        
        res.cookie('token', token)
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }
    else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
    }
}

export const logout = async (req, res) => {
    res.cookie('token', "", 
        {
            expires: new Date(0)
        })
    return res.status(200).json({ message: 'Logout'})
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
        const token = await generateToken(usuario)
        
        res.cookie('token', token)
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
    try {
       const choferes = await model.choferes.findAll();
       res.status(200).json({ message: 'Lista de choferes obtenida con éxito' , choferes});
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los choferes", error: error.message});
    }
}

export const getChofer = async (req, res) => {
    const { usuario } = req.params;
    try {
        const chofer = await model.choferes.findOne({ where: { usuario_chofer: usuario } });
        if (chofer) {
            res.status(200).json({ meesage: "Chofer encontrado con éxito", chofer });
        } else {
            res.status(404).json({ message: "Chofer no encontrado" });
        }
    } catch (error) {
        res.status(500),json({ message: "Error al obtener el chofer", error: error.message });
    }
}

export const getUsuario = async (req, res) => {
    const { usuario } = req.params;
    try {
        const usuarioEncontrado = await model.usuarios.findByPk(usuario, {
            include: [{ model: model.informacionesPersonales }]
        });
        if (usuarioEncontrado) {
            res.status(200).json({ message: "Usuario encontrado con éxito", usuario: usuarioEncontrado });
        } else {
            res.status(404).json({ message: "Usuario no encontrado "});
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
    }
}

export const eliminarChofer = async  (req, res) => {
    const { usuario } = req.params;
    try{
        const chofer = await model.choferes.findOne({ where: { usuario_chofer: usuario } });
        if (chofer) {
            await model.choferes.destroy({ where: {usuario_chofer: usuario } });
            res.status(200).json({ message: "Rol de chofer eliminado con éxito" });
        } else {
            res.status(404).json({ message: "El usuario no tiene el rol de chofer o no existe" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el rol de chofer", error: error.message });
    }
}
