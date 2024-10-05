import model from "../models/index.js";

export const operadorValidation = async (req, res, next) => {
    
    const usuario = req.usuario.id

    if(!usuario) {
        return res.status(401).json({ message: "Usuario no valido"})
    }
    try {
        const usuarioEncontrado = await model.operadores.findByPk(usuario)
        if (!usuarioEncontrado) 
            return res.status(401).json({ message: "Permiso denegado"})
        next();
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    
}

export const choferValidation = async (req, res, next) => {
    
  const usuario = req.usuario

  if(!usuario) {
      return res.status(401).json({ message: "Usuario no valido"})
  }
  try {
      const usuarioEncontrado = await model.choferes.findByPk(usuario)
      if (!usuarioEncontrado) 
          return res.status(401).json({ message: "Permiso denegado"})
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error interno' });
    }
  
}

export const trabajadorValidation = async (req, res, next) => {
    
  const usuario = req.usuario

  if(!usuario) {
      return res.status(401).json({ message: "Usuario no valido"})
  }
  try {
      const operadorEncontrado = await model.operadores.findByPk(usuario)
      const choferEncontrado = await model.choferes.findByPk(usuario)
      if (!operadorEncontrado && !choferEncontrado) 
          return res.status(401).json({ message: "Permiso denegado"})
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error interno' });
    }
  
}