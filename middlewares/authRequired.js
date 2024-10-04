import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '../config.js'

export const authRequired = (req, res, next) => {
    const { token } = req.cookies

    if(!token) {
        return res.status(401).json({ message: "Autorizacion denegada"})
    }
    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        req.usuario = decoded;  
        next(); 
      } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
      }
    
}