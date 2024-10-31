import model from "../models/index.js";
import { uuid } from "uuidv4";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/auth.js";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config.js";
import { registrarBitacora } from "../services/bitacora.js";
import { where } from "sequelize";

const existeTelefono = async (telefono) => {
  const telefonoExistente = await model.telefono.findOne({
    where: { telefono },
  });
  return telefonoExistente !== null;
};

const existeCarnet = async (carnet) => {
  const carnetExistente = await model.informacionesPersonales.findOne({
    where : { carnet },
  })
  return  carnetExistente !==  null;
}

const existeCorreo = async (correo) => {
  const UsuarioExistente = await model.informacionesPersonales.findOne({
    where: { correo },
  });
  return UsuarioExistente !== null;
};

const existeUsuario = async (usuario) => {
  const UsuarioExistente = await model.usuarios.findByPk(usuario);
  return UsuarioExistente !== null;
};

const buscarRol = async (usuario) => {
  const op = await model.operadores.findByPk(usuario);
  const ch = await model.choferes.findByPk(usuario);

  if (op) {
    return "Operador";
  }
  if (ch) {
    return "Chofer";
  }
  return "Pasajero";
};

export const login = async (req, res) => {
  let id_linea = 1;
  let rol = "Pasajero";
  const { usuario, contraseña } = req.body; 
  try {
    const usuarioLogged = await model.usuarios.findByPk(usuario, {
      include: [
        { model: model.informacionesPersonales },
        { model: model.choferes},
        { model: model.operadores},
    ]});
    const informacion = usuarioLogged.dataValues.informaciones_personale;
    if (!usuarioLogged)
      return res.status(404).json({ message: "El usuario no existe" });

    if (await comparePassword(contraseña, usuarioLogged.contraseña)) {
      if (usuarioLogged.dataValues.operadore) {

        id_linea = usuarioLogged.dataValues.operadore.dataValues.id_linea
        registrarBitacora(
          usuario,
          "INICIO_SESION",
          `El operador ${usuario} inicio sesion`,
          id_linea
        )
        rol = "Operador"
      }else if (usuarioLogged.dataValues.chofere) {
        registrarBitacora(
          usuario,
          "INICIO_SESION",
          `El chofer ${usuario} inicio sesion`,
          id_linea
        )
        rol = "Chofer"
      }

      const token = await generateToken(usuario, rol, id_linea);
      var farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10));
      res.cookie("token", token, {
        httpOnly: true, // Protege la cookie para que no pueda ser accedida por JavaScript en el navegador
        secure: false, // Solo en HTTPS en producción
        sameSite: "none", // Evita el envío de la cookie en solicitudes entre sitios (para mayor seguridad)
        expires: farFuture 
      });
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token: token,
        datos: {
          usuario: usuarioLogged.usuario,
          nombre: informacion.nombre,
          apellido: informacion.apellido,
          correo: informacion.correo,
          sexo: informacion.sexo,
          fecha_de_nacimiento: informacion.fecha_de_nacimiento,
          direccion: informacion.direccion,
          carnet: informacion.carnet,
        },
      });
    } else {
      res.status(401).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesion", error: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logout" });
};

export const registrarTelefonoNuevo = async (usuario, telefono) => {
  const usuarioEncontrado = await model.usuarios.findByPk(usuario);
  try {
    if (!usuarioEncontrado)
      throw new Error({ message: "Usuario no encontrado" });

    if (await existeTelefono(telefono))
      throw new Error({ message: `El telefono ${telefono} ya esta en uso` });

    const id_informacion = usuarioEncontrado.id_informacion;

    return await model.telefono.create({ telefono, id_informacion });
  } catch (error) {}
};

export const registrarTelefono = async (req, res) => {
  const { telefono } = req.body;
  const usuario = req.usuario.id;
  try {
    await registrarTelefonoNuevo(usuario, telefono);

    res.status(201).json({ message: "Telefonos registrados con exito " });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar telefono", error: error.message });
  }
};

export const register = async (req, res) => {
  const {
    usuario,
    contraseña,
    nombre,
    apellido,
    correo,
    sexo,
    fecha_de_nacimiento,
    direccion,
    carnet,
    telefonos,
  } = req.body;
  try {
    if (await existeUsuario(usuario)) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    if (await existeCorreo(correo)) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    telefonos.forEach(async (telefono) => {
      if (await existeTelefono(telefono))
        throw new Error(`El telefono ${telefono} ya esta en uso`);
    });

    const id_informacion = uuid();
    const { salt, hashedPassword } = await hashPassword(contraseña);

    const nuevaInformacion = await model.informacionesPersonales.create({
      id_informacion,
      nombre,
      apellido,
      correo,
      sexo,
      fecha_de_nacimiento,
      direccion,
      carnet,
    });
    const nuevoUsuario = await model.usuarios.create({
      usuario,
      contraseña: hashedPassword,
      salt,
      id_informacion,
    });
    const rol = await buscarRol(usuario);
    const token = await generateToken(usuario, rol);

    await telefonos.forEach(async (telefono) => {
      await registrarTelefonoNuevo(usuario, telefono);
    });
    res.cookie("token", token, {
      httpOnly: true, // Protege la cookie para que no pueda ser accedida por JavaScript en el navegador
      secure: false, // Solo en HTTPS en producción
      sameSite: "None", // Evita el envío de la cookie en solicitudes entre sitios (para mayor seguridad)
      maxAge: 24 * 60 * 60 * 1000, // Expira en 1 día (en milisegundos)
    });
    res.status(201).json({
      message: "Usuario registrado con éxito",
      token: token,
      datos: {
        usuario: usuario,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        sexo: sexo,
        fecha_de_nacimiento: fecha_de_nacimiento,
        direccion: direccion,
        carnet: carnet,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

export const updateContraseña = async (req, res) => {
  const { contraseña_actual, contraseña_nueva } = req.body;
  const usuario = req.usuario.id;

  if (!usuario) return res.status(400).json({ message: "Usuario invalido" });
  try {
    const usuarioExistente = await model.usuarios.findByPk(usuario);
    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(usuarioExistente.contraseña);
    console.log(contraseña_actual);
    const buscarContraseña = await comparePassword(
      contraseña_actual,
      usuarioExistente.contraseña,
    );
    if (!buscarContraseña) {
      return res
        .status(401)
        .json({ message: "La contraseña actual es incorrecta" });
    }
    const { salt, hashedPassword } = await hashPassword(contraseña_nueva);

    usuarioExistente.contraseña = hashedPassword;
    usuarioExistente.salt = salt;
    await usuarioExistente.save();
    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la contraseña",
      error: error.message,
    });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No existe token" });
  jwt.verify(token, TOKEN_KEY, async (err, user) => {
    if (err) return res.status(401).json({ message: "Token no valido" });
    const userFound = await model.usuarios.findByPk(user.usuario);
    if (!userFound)
      return res.status(401).json({ message: "Usuario no encontrado" });
    return res.json({
      message: "hola",
    });
  });
};

