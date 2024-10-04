import express from 'express'
import { updateUsuario, crearChofer, crearOperador, getChoferes, getChofer, getUsuario } from '../controllers/userController.js'

const router = express.Router()

router.put('/update', updateUsuario)
router.post('/crearChofer', crearChofer)
router.post('/crearOperador', crearOperador)
router.get('/choferes', getChoferes)
router.get('/choferes:id', getChofer)
router.get('/usuarios:id', getUsuario)
export default router