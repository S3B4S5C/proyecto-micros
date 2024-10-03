import model from '../models/index.js'



export const login = async (req, res) => {
    console.log(req.body);
    const { usuario, pass } = req.body
    const usuarioLogged = await model.usuarios.findByPk(usuario)
    console.log(JSON.stringify(usuarioLogged, null, 2))
    const contraseñaLogged = usuarioLogged.contraseña
    console.log(contraseñaLogged)
    if(pass == contraseñaLogged) {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }
    else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
    }
}