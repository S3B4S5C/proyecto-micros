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

export const updateContraseña = async (req, res) => {
    const { usuario } = req.params;
    const { contraseña_actual, contraseña_nueva} = req.body;
    try {
        const usuarioExistente = await model.usuarios.findByPk(usuario);
        if (!usuarioExistente){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const buscarContraseña = await comparePassword(contraseña_actual, usuarioExistente.contraseña);
        if (!buscarContraseña){
            return res.status(401).json({ message: 'La contraseña actual es incorrecta'});
        }
        const { salt, hashedPassword } = await hashPassword(contraseña_nueva);
        
        usuarioExistente.contraseña = hashedPassword;
        usuarioExistente.salt = salt;
        await usuarioExistente.save();
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error){
        res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message});
    }
}