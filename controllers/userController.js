import model from '../models/index.js'
import { CODIGO_OPERADOR, TOKEN_KEY } from '../config.js';



const existeUsuario = async (usuario) => {
    const UsuarioExistente = await model.usuarios.findByPk(usuario);
    return UsuarioExistente !== null;
}

export const updateUsuario = async (req, res) => {
    const { nombre, apellido, correo, direccion } = req.body
    usuario = req.usuario.id
    const datos = {
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
        ...(correo && { correo }),
        ...(direccion && { direccion })
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
        if (error instanceof z.ZodError) {
           return res.status(500).json({ message: 'Error al actualizar usuario', error: error.issues }) 
          }
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
    const { usuario, codigo, id_linea } = req.body 
    if (codigo == CODIGO_OPERADOR){
        try {
            if (existeUsuario(usuario)) {
                await model.operadores.create({ usuario_operador: usuario, id_linea })
                res.status(201).json({ message: 'Operador creado con exito'})
            }
            else {
                res.status(404).json({ message: 'Usuario no encontrado' })
            }
        } catch (error) {
            res.status(500).json({ message: "Error al crear Operador", error: error.message})
        }
    }
    else {
        res.status(401).json({ message: "Codigo Incorrecto", error: "Codigo Incorrecto"})
    }
}

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
            const usuario = await model.usuarios.findByPk(chofer.usuario_chofer)
            const informacionPersonal = await model.informacionesPersonales.findByPk(usuario.id_informacion,
                { attributes: ['nombre', 'apellido', 'correo', 'sexo', 'fecha_de_nacimiento', "direccion", "carnet"] })

            res.status(200).json({ meesage: "Chofer encontrado con éxito", chofer, informacionPersonal });
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
        const usuarioEncontrado = await model.usuarios.findByPk(usuario, { attributes: ['usuario', 'id_informacion'] })
        const informacionUsuario = await model.informacionesPersonales.findByPk(usuarioEncontrado.id_informacion, 
            { attributes: ['nombre', 'apellido', 'correo', 'sexo', 'fecha_de_nacimiento', "direccion", "carnet"] }  
        )
        const telefonos = await model.telefono.findAll(
            { 
                attributes: ['telefono'],
                where: 
                { 
                    id_informacion: usuarioEncontrado.id_informacion 
                }
            })
        if (usuarioEncontrado) {
            res.status(200).json({ message: "Usuario encontrado con éxito", usuario: {nombre_de_usuario: usuarioEncontrado.usuario, informacion: informacionUsuario, telefonos: telefonos }});
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
