import model from "../models/index.js";
import { CODIGO_OPERADOR, TOKEN_KEY } from "../config.js";
import { registrarBitacora } from "../services/bitacora.js";
import { userFromToken, idLineaFromToken } from "../services/auth.js";
const existeUsuario = async (usuario) => {
  const UsuarioExistente = await model.usuarios.findByPk(usuario);
  return UsuarioExistente !== null;
};

// ENDPOINT PARA BORRAR UN USUARIO
export const deleteUsuario = async(req, res)=> {
  const { carnet } = req.body;
  try {
    if (existeUsuario(usuario)) {
      await model.usuarios.destroy({ where: { carnet } });
      res.status(200).json({ message: "Usuario eliminado con exito" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
}


export const updateUsuario = async (req, res) => {
  const { usuario, nombre, apellido, correo, direccion } = req.body;

  const datos = {
    ...(nombre && { nombre }),
    ...(apellido && { apellido }),
    ...(correo && { correo }),
    ...(direccion && { direccion }),
  };
  try {
    const usuarioSeleccionado = await model.usuarios.findByPk(usuario);
    if (usuarioSeleccionado) {
      const idInformacion = usuarioSeleccionado.id_informacion;
      await model.informacionesPersonales.update(datos, {
        where: {
          id_informacion: idInformacion,
        },
      });
      const idInfo =
        await model.informacionesPersonales.findByPk(idInformacion);

      registrarBitacora(
        usuario,
        "ACTUALIZACION",
        `El usuario ${usuario} ha sido actualizado`
      );

      res.status(201).json({
        datos: {
          usuario: usuario,
          nombre: idInfo.nombre,
          apellido: idInfo.apellido,
          correo: idInfo.correo,
          sexo: idInfo.sexo,
          fecha_de_nacimiento: idInfo.fecha_de_nacimiento,
          direccion: idInfo.direccion,
          carnet: idInfo.carnet,
        },
        message: "Usuario actualizado con exito",
      });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
};

export const crearChofer = async (req, res) => {
  const { usuario, licencia } = req.body;
  const id_linea = idLineaFromToken(req.body.token);
  const operador = userFromToken(req.body.token);
  try {
    if (existeUsuario(usuario)) {
      await model.choferes.create({
        usuario_chofer: usuario,
        licencia_categoria: licencia,
      });
      registrarBitacora(
        operador,
        "ACTUALIZACION",
        `Al usuario ${usuario} se le ha asignado el rol de chofer`,
        id_linea
      );
      res.status(201).json({ message: "Chofer creado con exito" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear Chofer", error: error.message });
  }
};

export const crearOperador = async (req, res) => {
  const { usuario, codigo, id_linea } = req.body;
  if (codigo == CODIGO_OPERADOR) {
    try {
      if (existeUsuario(usuario)) {
        await model.operadores.create({ usuario_operador: usuario, id_linea });
        registrarBitacora(
          "ADMINISTRADOR",
          "ACTUALIZACION",
          `Al usuario ${usuario} se le ha asignado el rol de operador`
        );
        res.status(201).json({ message: "Operador creado con exito" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear Operador", error: error.message });
    }
  } else {
    res
      .status(401)
      .json({ message: "Codigo Incorrecto", error: "Codigo Incorrecto" });
  }
};

export const crearDueño = async (res, req) => {
  const { usuario } = req.body;
  const id_linea = idLineaFromToken(req.body.token);
  const operador = userFromToken(req.body.token);
  try {
    if (existeUsuario(usuario)) {
      const usuarioExistente = await model.usuarios.findByPk(usuario);
      const id_informacion = usuarioExistente.id_informacion;
      await model.dueños.create({
        id_informacion,
      });
      registrarBitacora(
        operador,
        "ACTUALIZACION",
        `El usuario ${usuario} se ha actualizado a dueño de micro`,
        id_linea
      );
      res.status(201).json({ message: "Dueño creado con exito" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear Dueño", error: error.message });
  }
};

export const getChoferes = async (req, res) => {
  const { token } = req.body;
  const user = userFromToken(token);
  try {
    const operador = await model.operadores.findByPk(user);
    const choferes = await model.choferes.findAll({
      include: [
        {
          model: model.turno,
          required: true,
          include: [
            {
              model: model.micro,
              required: true,
              include: [
                {
                  model: model.linea,
                  required: true,
                  where: { id_linea: operador.id_linea },
                },
              ],
            },
          ],
        },
        {
          model: model.usuarios,
          include: [
            {
              model: model.informacionesPersonales,
              include: [{ model: model.telefono, attributes: ["telefono"] }],
            },
          ],
        },
      ],
    });
    let listaDeChoferes = [];
    for (const chofer of choferes) {
      const choferInfo = {
        usuario: chofer.usuario_chofer,
        licencia_categoria: chofer.licencia_categoria,
        nombre: chofer.usuario.informaciones_personale.nombre,
        apellido: chofer.usuario.informaciones_personale.apellido,
        correo: chofer.usuario.informaciones_personale.correo,
        carnet: chofer.usuario.informaciones_personale.carnet,
        sexo: chofer.usuario.informaciones_personale.sexo,
        telefonos: chofer.usuario.informaciones_personale.telefonos,
      };
      listaDeChoferes.push(choferInfo);
    }
    res.status(200).json({
      message: "Lista de choferes obtenida con éxito",
      listaDeChoferes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los choferes", error: error.message });
  }
};

export const getChofer = async (req, res) => {
  const { usuario } = req.params;
  try {
    const chofer = await model.choferes.findOne({
      where: { usuario_chofer: usuario },
    });
    if (chofer) {
      const usuario = await model.usuarios.findByPk(chofer.usuario_chofer);
      const informacionPersonal = await model.informacionesPersonales.findByPk(
        usuario.id_informacion,
        {
          attributes: [
            "nombre",
            "apellido",
            "correo",
            "sexo",
            "fecha_de_nacimiento",
            "direccion",
            "carnet",
          ],
        }
      );

      res.status(200).json({
        meesage: "Chofer encontrado con éxito",
        chofer,
        informacionPersonal,
      });
    } else {
      res.status(404).json({ message: "Chofer no encontrado" });
    }
  } catch (error) {
    res.status(500),
      json({ message: "Error al obtener el chofer", error: error.message });
  }
};

export const getUsuario = async (req, res) => {
  const { usuario } = req.params;
  try {
    const usuarioEncontrado = await model.usuarios.findByPk(usuario, {
      attributes: ["usuario", "id_informacion"],
    });
    const informacionUsuario = await model.informacionesPersonales.findByPk(
      usuarioEncontrado.id_informacion,
      {
        attributes: [
          "nombre",
          "apellido",
          "correo",
          "sexo",
          "fecha_de_nacimiento",
          "direccion",
          "carnet",
        ],
      }
    );
    const telefonos = await model.telefono.findAll({
      attributes: ["telefono"],
      where: {
        id_informacion: usuarioEncontrado.id_informacion,
      },
    });
    if (usuarioEncontrado) {
      res.status(200).json({
        message: "Usuario encontrado con éxito",
        usuario: {
          nombre_de_usuario: usuarioEncontrado.usuario,
          informacion: informacionUsuario,
          telefonos: telefonos,
        },
      });
    } else {
      res.status(404).json({ message: "Usuario no encontrado " });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

export const eliminarChofer = async (req, res) => {
  const { usuario } = req.params;
  const id_linea = idLineaFromToken(req.body.token);
  const operador = userFromToken(req.body.token);
  try {
    const chofer = await model.choferes.findOne({
      where: { usuario_chofer: usuario },
    });
    if (chofer) {
      await model.choferes.destroy({ where: { usuario_chofer: usuario } });
      registrarBitacora(
        operador,
        "ACTUALIZACION",
        `Al usuario ${usuario} se le ha quitado el rol de chofer`,
        id_linea
      );
      res.status(200).json({ message: "Rol de chofer eliminado con éxito" });
    } else {
      res
        .status(404)
        .json({ message: "El usuario no tiene el rol de chofer o no existe" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el rol de chofer",
      error: error.message,
    });
  }
};

export const eliminarDueño = async (res, req) => {
  const { usuario, token } = req.body;
  const id_linea = idLineaFromToken(token);
  try {
    const informacionPersonal = await model.informacionesPersonales.findOne({
      where: { usuario },
    });
    if (!informacionPersonal) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const dueño = await model.dueño.findOne({
      where: { id_informacion: informacionPersonal.id_informacion },
    });
    if (!dueño) {
      return res
        .status(404)
        .json({ message: "El usuario no es dueño actualmente" });
    }
    await dueño.destroy();
    registrarBitacora(
      usuario,
      "ELIMINACION",
      `El usuario ${usuario} ha dejado de ser dueño`,
      id_linea
    );
    res.status(200).json({ message: "Dueño eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el dueño", error: error.message });
  }
};

export const getDueños = async (req, res) => {
  try {
    const dueños = await model.dueño.findAll({
      attributes: ["id_dueño"],
      include: [
        {
          model: model.informacionesPersonales,
          attributes: ["nombre", "apellido"],
        },
      ],
    });
    if (!dueños.length) {
      return res.status(404).json({ message: "No se encontraron dueños " });
    }
    let listaDeDueños = [];
    for (const dueño of dueños) {
      const dueñoInfo = {
        id: dueño.id_dueño,
        nombre: dueño.informaciones_personale.nombre,
        apellido: dueño.informaciones_personale.apellido,
      };
      listaDeDueños.push(dueñoInfo);
    }
    res.status(200).json(listaDeDueños);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los dueños",
      error: error.message,
    });
  }
};

export const getBitacora = async (req, res) => {
  try {
    const bitacora = await model.bitacora.findAll({
      include: [
        {
          model: model.usuarios,
          include: [
            {
              model: model.operadores,
              where: {
                id_linea: idLineaFromToken(req.body.token),
              },
            },
          ],
        },
      ],
    });
    res.status(200).json(bitacora);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la bitacora", error: error.message });
  }
};
